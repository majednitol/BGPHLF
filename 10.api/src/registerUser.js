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
     
    const org = OrgMSP.replace('MSP', '').toLowerCase();
    let ccp = getCCP(org);
    const caClient = buildCAClient(FabricCAServices, ccp, `ca-${org}`);
    const wallet = await buildWallet(); 
    await enrollAdmin(caClient, wallet, OrgMSP);
    await registerAndEnrollUser(caClient, wallet, OrgMSP, userId, affiliation);
    return { wallet };
}
