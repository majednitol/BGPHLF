
import { Wallets, Gateway }  from "fabric-network"
import path from 'path'
const walletPath = path.join(__dirname, "wallet");
import { buildWallet }  from "./utils/AppUtils.js";
import { getCCP } from './common/buildCCP.js'


export const updateAsset = async (request) => {
  console.log("Update Asset Request:", request);

  try {
    let org = request.org;
    console.log("Organization:", org);

    let num = Number(org.match(/\d/g).join(""));
    console.log("Organization Number:", num);

    const ccp = getCCP(num);
    const wallet = await buildWallet(Wallets, walletPath);

    const gateway = new Gateway();
    await gateway.connect(ccp, {
      wallet,
      identity: request.userId,
      discovery: { enabled: true, asLocalhost: false },
    });

    const network = await gateway.getNetwork(request.channelName);
    const contract = network.getContract(request.chaincodeName);

    let data = request.data;
    console.log("Asset Data for Update:", data);

    let result = await contract.submitTransaction(
      "UpdateAsset",
      data.ID,
      data.color,
      data.size,
      data.owner,
      data.appraisedValue
    );
    console.log("Update Result:", result.toString());

    return result;
  } catch (error) {
    console.error("Error in updateAsset:", error);
    throw error;
  }
};

export const deleteAsset = async (request) => {
  console.log("Delete Asset Request:", request);

  try {
    let org = request.org;
    let num = Number(org.match(/\d/g).join(""));
    const ccp = getCCP(num);
    const wallet = await buildWallet(Wallets, walletPath);

    const gateway = new Gateway();
    await gateway.connect(ccp, {
      wallet,
      identity: request.userId,
      discovery: { enabled: true, asLocalhost: false },
    });

    const network = await gateway.getNetwork(request.channelName);
    const contract = network.getContract(request.chaincodeName);

    let data = request.data;
    console.log("Asset Data for Delete:", data);

    let result = await contract.submitTransaction("DeleteAsset", data.id);
    console.log("Delete Result:", result.toString());

    return result;
  } catch (error) {
    console.error("Error in deleteAsset:", error);
    throw error;
  }
};

export const TransferAsset = async (request) => {
  console.log("Transfer Asset Request:", request);

  try {
    let org = request.org;
    let num = Number(org.match(/\d/g).join(""));
    const ccp = getCCP(num);
    const wallet = await buildWallet(Wallets, walletPath);

    const gateway = new Gateway();
    await gateway.connect(ccp, {
      wallet,
      identity: request.userId,
      discovery: { enabled: true, asLocalhost: false },
    });

    const network = await gateway.getNetwork(request.channelName);
    const contract = network.getContract(request.chaincodeName);

    let data = request.data;
    console.log("Asset Data for Transfer:", data);

    let result = await contract.submitTransaction(
      "TransferAsset",
      data.id,
      data.newOwner
    );
    console.log("Transfer Result:", JSON.parse(result));

    return JSON.parse(result);
  } catch (error) {
    console.error("Error in TransferAsset:", error);
    throw error;
  }
};
