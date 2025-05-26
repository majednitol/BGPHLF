
import { Gateway, Wallets } from 'fabric-network';
import { resolve } from 'path'
import { getCCP } from '../common/buildCCP.js';
import { buildWallet } from '../utils/AppUtils.js';
const walletPath = resolve("wallet");
export const smartContract = async (request, userId) => {
    // console.log("request",request)
    let org = request.org;
    console.log("org",org)
    if (!org) {
        throw new Error("Organization not specified in the request");
    }
    let num = Number(org.match(/\d/g).join(""));
    const ccp = getCCP(num);
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
