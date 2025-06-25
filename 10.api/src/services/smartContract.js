
import { Gateway, Wallets } from 'fabric-network';
import { resolve } from 'path'
import { getCCP } from '../common/buildCCP.js';
import { buildWallet } from '../utils/AppUtils.js';
const walletPath = resolve("wallet");
export const smartContract = async (request, userId) => {
    // console.log("request",request)
    let OrgMSP = request.org;

    if (!OrgMSP) {
        throw new Error("Organization not specified in the request");
    }
     const org = OrgMSP.replace('MSP', '').toLowerCase();
    const ccp = getCCP(org);
    const wallet = await buildWallet(Wallets, walletPath);
    console.log("wallet", wallet)

    const gateway = new Gateway();

    await gateway.connect(ccp, {
        wallet,
        identity: userId,
        discovery: { enabled: true, asLocalhost: false }
    });
    const network = await gateway.getNetwork(request.channelName);
    const contract = network.getContract(request.chaincodeName);
    return contract
}
