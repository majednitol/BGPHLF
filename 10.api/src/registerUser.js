import { Wallets } from "fabric-network";
import FabricCAServices from 'fabric-ca-client';

import { buildCAClient, registerAndEnrollUser, enrollAdmin } from "./utils/CAUtil.js";
import { buildWallet } from "./utils/AppUtils.js";

import { resolve } from 'path';
import { Utils as utils } from 'fabric-common';
import { getCCP } from "./common/buildCCP.js";

let config = utils.getConfig()
config.file(resolve('config.json'))
let walletPath;
export async function registerUser({ OrgMSP, userId,affiliation }) {
    let org = Number(OrgMSP.match(/\d/g).join(""));
    
    let ccp = getCCP(org);
    const caClient = buildCAClient(FabricCAServices, ccp, `ca-org${org}`);
    const wallet = await buildWallet(); 
    await enrollAdmin(caClient, wallet, OrgMSP);
    const aff= "rono.technical";
    await registerAndEnrollUser(caClient, wallet, OrgMSP, userId, affiliation);
    return { wallet };
}
