// // /*
// //  * Copyright IBM Corp. All Rights Reserved.
// //  *
// //  * SPDX-License-Identifier: Apache-2.0
// //  */

// // const grpc = require('@grpc/grpc-js');
// // const { connect, hash, signers } = require('@hyperledger/fabric-gateway');
// // const crypto = require('node:crypto');

// // const path = require('node:path');
// // const { TextDecoder } = require('node:util');
// // const fs = require('node:fs'); // Use the regular fs module
// // const fsPromises = require('node:fs/promises');
// // const channelName = envOrDefault('CHANNEL_NAME', 'mychannel');
// // const chaincodeName = envOrDefault('CHAINCODE_NAME', 'basic');
// // const mspId = envOrDefault('MSP_ID', 'Org1MSP');
// // 'use strict';

// // const { Wallets } = require('fabric-network');
// // const FabricCAServices = require('fabric-ca-client');


// // // Environment variable helpers
// // function envOrDefault(key, defaultValue) {
// //     return process.env[key] || defaultValue;
// // }

// // // Constants
// // const adminUserId = 'admin';
// // const adminUserPasswd = 'adminpw';

// // // Path to crypto materials.
// // const cryptoPath = envOrDefault(
// //     'CRYPTO_PATH',
// //     path.resolve(
// //         __dirname,
// //         '..',
// //         '..',
// //         '..',
// //         'test-network',
// //         'organizations',
// //         'peerOrganizations',
// //         'org1.example.com'
// //     )
// // );

// // // Path to user private key directory.
// // const keyDirectoryPath = envOrDefault(
// //     'KEY_DIRECTORY_PATH',
// //     path.resolve(
// //         cryptoPath,
// //         'users',
// //         'User1@org1.example.com',
// //         'msp',
// //         'keystore'
// //     )
// // );

// // // Path to user certificate directory.
// // const certDirectoryPath = envOrDefault(
// //     'CERT_DIRECTORY_PATH',
// //     path.resolve(
// //         cryptoPath,
// //         'users',
// //         'User1@org1.example.com',
// //         'msp',
// //         'signcerts'
// //     )
// // );

// // // Path to peer tls certificate.
// // const tlsCertPath = envOrDefault(
// //     'TLS_CERT_PATH',
// //     path.resolve(cryptoPath, 'peers', 'peer0.org1.example.com', 'tls', 'ca.crt')
// // );

// // // Gateway peer endpoint.
// // const peerEndpoint = envOrDefault('PEER_ENDPOINT', 'localhost:7051');

// // // Gateway peer SSL host name override.
// // const peerHostAlias = envOrDefault('PEER_HOST_ALIAS', 'peer0.org1.example.com');

// // const utf8Decoder = new TextDecoder();
// // const assetId = `asset${String(Date.now())}`;
// // const org = 'org1'; 
// // const userId = 'user2'; 
// // const affiliation = 'org1.department1'; 

// // async function buildCAClient(org) {
// //     const ccpPath = (`${cryptoPath}/connection-${org}.json`);
// //     console.log("ccpPath",ccpPath)
// //     if (!fs.existsSync(ccpPath)) {
// //         throw new Error(`No such file or directory: ${ccpPath}`);
// //     }
// //     const ccp = JSON.parse(await fsPromises.readFile(ccpPath, 'utf8'));
// //     const caInfo = ccp.certificateAuthorities[`ca.${org}.example.com`];
// //     const caTLSCACerts = caInfo.tlsCACerts.pem;
// //     const caClient = new FabricCAServices(caInfo.url, { trustedRoots: caTLSCACerts, verify: true }, caInfo.caName);
// //     return caClient;
// // }

// // // Function to build the wallet
// // async function buildWallet(walletPath) {
// //     const wallet = await Wallets.newFileSystemWallet(walletPath);
// //     console.log(`Wallet path: ${walletPath}`);
// //     return wallet;
// // }

// // // Enroll the admin user
// // async function enrollAdmin(org) {
// //     try {
// //         const caClient = await buildCAClient(org);
// //         const wallet = await buildWallet(path.join(__dirname, 'wallet'));

// //         const identity = await wallet.get(adminUserId);
// //         if (identity) {
// //             console.log('Admin identity already exists in the wallet');
// //             return;
// //         }

// //         const enrollment = await caClient.enroll({ enrollmentID: adminUserId, enrollmentSecret: adminUserPasswd });
// //         const x509Identity = {
// //             credentials: {
// //                 certificate: enrollment.certificate,
// //                 privateKey: enrollment.key.toBytes(),
// //             },
// //             mspId: `${org}MSP`,
// //             type: 'X.509',
// //         };

// //         await wallet.put(adminUserId, x509Identity);
// //         console.log('Successfully enrolled admin user and imported it into the wallet');
// //     } catch (error) {
// //         console.error(`Failed to enroll admin user: ${error}`);
// //     }
// // }

// // // Register a new user
// // async function registerUser(org, userId, affiliation) {
// //     try {
// //         const caClient = await buildCAClient(org);
// //         const wallet = await buildWallet(path.join(__dirname, 'wallet'));

// //         const userIdentity = await wallet.get(userId);
// //         if (userIdentity) {
// //             console.log(`User ${userId} already exists in the wallet`);
// //             return;
// //         }

// //         const adminIdentity = await wallet.get(adminUserId);
// //         if (!adminIdentity) {
// //             console.log('Admin identity does not exist in the wallet. Enroll admin first.');
// //             return;
// //         }

// //         const provider = wallet.getProviderRegistry().getProvider(adminIdentity.type);
// //         const adminUser = await provider.getUserContext(adminIdentity, adminUserId);

// //         const secret = await caClient.register({
// //             affiliation,
// //             enrollmentID: userId,
// //             role: 'client',
// //         }, adminUser);

// //         const enrollment = await caClient.enroll({
// //             enrollmentID: userId,
// //             enrollmentSecret: secret,
// //         });

// //         const x509Identity = {
// //             credentials: {
// //                 certificate: enrollment.certificate,
// //                 privateKey: enrollment.key.toBytes(),
// //             },
// //             mspId: `${org}MSP`,
// //             type: 'X.509',
// //         };

// //         await wallet.put(userId, x509Identity);
// //         console.log(`Successfully registered and enrolled user ${userId}`);
// //     } catch (error) {
// //         console.error(`Failed to register user: ${error}`);
// //     }
// // }

// // // Check if a user exists
// // async function userExists(userId) {
// //     try {
// //         const wallet = await buildWallet(path.join(__dirname, 'wallet'));
// //         const identity = await wallet.get(userId);
// //         if (!identity) {
// //             console.log(`User ${userId} does not exist`);
// //             return false;
// //         }
// //         console.log(`User ${userId} exists`);
// //         return true;
// //     } catch (error) {
// //         console.error(`Error checking user existence: ${error}`);
// //     }
// // }
// // async function main() {
// //     displayInputParameters();

// //     // The gRPC client connection should be shared by all Gateway connections to this endpoint.
// //     const client = await newGrpcConnection();

// //     const gateway = connect({
// //         client,
// //         identity: await newIdentity(),
// //         signer: await newSigner(),
// //         hash: hash.sha256,
// //         // Default timeouts for different gRPC calls
// //         evaluateOptions: () => {
// //             return { deadline: Date.now() + 5000 }; // 5 seconds
// //         },
// //         endorseOptions: () => {
// //             return { deadline: Date.now() + 15000 }; // 15 seconds
// //         },
// //         submitOptions: () => {
// //             return { deadline: Date.now() + 5000 }; // 5 seconds
// //         },
// //         commitStatusOptions: () => {
// //             return { deadline: Date.now() + 60000 }; // 1 minute
// //         },
// //     });

// //     try {
// //         // Get a network instance representing the channel where the smart contract is deployed.
// //         const network = gateway.getNetwork(channelName);

// //         // Get the smart contract from the network.
// //         const contract = network.getContract(chaincodeName);

// //         // Initialize a set of asset data on the ledger using the chaincode 'InitLedger' function.
// //         await initLedger(contract);

// //         // Return all the current assets on the ledger.
// //         await getAllAssets(contract);

// //         // Create a new asset on the ledger.
// //         await createAsset(contract);

// //         // Update an existing asset asynchronously.
// //         await transferAssetAsync(contract);

// //         // Get the asset details by assetID.
// //         await readAssetByID(contract);

// //         // Update an asset which does not exist.
// //         await updateNonExistentAsset(contract);


// //     // Enroll Admin
// //     await enrollAdmin(org);

// //     // Register User
// //     await registerUser(org, userId, affiliation);

// //     // Check if User Exists
// //     await userExists(userId);
// //     } finally {
// //         gateway.close();
// //         client.close();
// //     }
// // }

// // main().catch((error) => {
// //     console.error('******** FAILED to run the application:', error);
// //     process.exitCode = 1;
// // });

// // async function newGrpcConnection() {
// //     const tlsRootCert = await fsPromises.readFile(tlsCertPath);
// //     const tlsCredentials = grpc.credentials.createSsl(tlsRootCert);
// //     return new grpc.Client(peerEndpoint, tlsCredentials, {
// //         'grpc.ssl_target_name_override': peerHostAlias,
// //     });
// // }

// // async function newIdentity() {
// //     const certPath = await getFirstDirFileName(certDirectoryPath);
// //     const credentials = await fsPromises.readFile(certPath);
// //     return { mspId, credentials };
// // }

// // async function getFirstDirFileName(dirPath) {
// //     const files = await fsPromises.readdir(dirPath);
// //     const file = files[0];
// //     if (!file) {
// //         throw new Error(`No files in directory: ${dirPath}`);
// //     }
// //     return path.join(dirPath, file);
// // }

// // async function newSigner() {
// //     const keyPath = await getFirstDirFileName(keyDirectoryPath);
// //     const privateKeyPem = await fsPromises.readFile(keyPath);
// //     const privateKey = crypto.createPrivateKey(privateKeyPem);
// //     return signers.newPrivateKeySigner(privateKey);
// // }

// // /**
// //  * This type of transaction would typically only be run once by an application the first time it was started after its
// //  * initial deployment. A new version of the chaincode deployed later would likely not need to run an "init" function.
// //  */
// // async function initLedger(contract) {
// //     console.log(
// //         '\n--> Submit Transaction: InitLedger, function creates the initial set of assets on the ledger'
// //     );

// //     await contract.submitTransaction('InitLedger');

// //     console.log('*** Transaction committed successfully');
// // }

// // /**
// //  * Evaluate a transaction to query ledger state.
// //  */
// // async function getAllAssets(contract) {
// //     console.log(
// //         '\n--> Evaluate Transaction: GetAllAssets, function returns all the current assets on the ledger'
// //     );

// //     const resultBytes = await contract.evaluateTransaction('GetAllAssets');

// //     const resultJson = utf8Decoder.decode(resultBytes);
// //     const result = JSON.parse(resultJson);
// //     console.log('*** Result:', result);
// // }

// // /**
// //  * Submit a transaction synchronously, blocking until it has been committed to the ledger.
// //  */
// // async function createAsset(contract) {
// //     console.log(
// //         '\n--> Submit Transaction: CreateAsset, creates new asset with ID, Color, Size, Owner and AppraisedValue arguments'
// //     );

// //     await contract.submitTransaction(
// //         'CreateAsset',
// //         assetId,
// //         'yellow',
// //         '5',
// //         'Tom',
// //         '1300'
// //     );

// //     console.log('*** Transaction committed successfully');
// // }

// // /**
// //  * Submit transaction asynchronously, allowing the application to process the smart contract response (e.g. update a UI)
// //  * while waiting for the commit notification.
// //  */
// // async function transferAssetAsync(contract) {
// //     console.log(
// //         '\n--> Async Submit Transaction: TransferAsset, updates existing asset owner'
// //     );

// //     const commit = await contract.submitAsync('TransferAsset', {
// //         arguments: [assetId, 'Saptha'],
// //     });
// //     const oldOwner = utf8Decoder.decode(commit.getResult());

// //     console.log(
// //         `*** Successfully submitted transaction to transfer ownership from ${oldOwner} to Saptha`
// //     );
// //     console.log('*** Waiting for transaction commit');

// //     const status = await commit.getStatus();
// //     if (!status.successful) {
// //         throw new Error(
// //             `Transaction ${
// //                 status.transactionId
// //             } failed to commit with status code ${String(status.code)}`
// //         );
// //     }

// //     console.log('*** Transaction committed successfully');
// // }

// // async function readAssetByID(contract) {
// //     console.log(
// //         '\n--> Evaluate Transaction: ReadAsset, function returns asset attributes'
// //     );

// //     const resultBytes = await contract.evaluateTransaction(
// //         'ReadAsset',
// //         assetId
// //     );

// //     const resultJson = utf8Decoder.decode(resultBytes);
// //     const result = JSON.parse(resultJson);
// //     console.log('*** Result:', result);
// // }

// // /**
// //  * submitTransaction() will throw an error containing details of any error responses from the smart contract.
// //  */
// // async function updateNonExistentAsset(contract) {
// //     console.log(
// //         '\n--> Submit Transaction: UpdateAsset asset70, asset70 does not exist and should return an error'
// //     );

// //     try {
// //         await contract.submitTransaction(
// //             'UpdateAsset',
// //             'asset70',
// //             'blue',
// //             '5',
// //             'Tomoko',
// //             '300'
// //         );
// //         console.log('******** FAILED to return an error');
// //     } catch (error) {
// //         console.log('*** Successfully caught the error: \n', error);
// //     }
// // }

// // /**
// //  * envOrDefault() will return the value of an environment variable, or a default value if the variable is undefined.
// //  */
// // function envOrDefault(key, defaultValue) {
// //     return process.env[key] || defaultValue;
// // }

// // /**
// //  * displayInputParameters() will print the global scope parameters used by the main driver routine.
// //  */
// // function displayInputParameters() {
// //     console.log(`channelName:       ${channelName}`);
// //     console.log(`chaincodeName:     ${chaincodeName}`);
// //     console.log(`mspId:             ${mspId}`);
// //     console.log(`cryptoPath:        ${cryptoPath}`);
// //     console.log(`keyDirectoryPath:  ${keyDirectoryPath}`);
// //     console.log(`certDirectoryPath: ${certDirectoryPath}`);
// //     console.log(`tlsCertPath:       ${tlsCertPath}`);
// //     console.log(`peerEndpoint:      ${peerEndpoint}`);
// //     console.log(`peerHostAlias:     ${peerHostAlias}`);
// // }











// const express = require('express');
// const { Wallets } = require('fabric-network');
// const FabricCAServices = require('fabric-ca-client');
// const path = require('path');
// const fs = require('fs');

// const app = express();
// app.use(express.json());

// // Environment variable helpers
// function envOrDefault(key, defaultValue) {
//     return process.env[key] || defaultValue;
// }

// // Constants
// const adminUserId = 'admin';
// const adminUserPasswd = 'adminpw';
//     const ccpPath = path.resolve(__dirname, 'connection-profile/connection-org1.json');

// // Function to build the CA client
// async function buildCAClient(org) {
//     if (!fs.existsSync(ccpPath)) {
//         throw new Error(`No such file or directory: ${ccpPath}`);
//     }
//     const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));
//     const caInfo = ccp.certificateAuthorities[`ca.${org}.example.com`];
//     const caTLSCACerts = caInfo.tlsCACerts.pem;
//     const caClient = new FabricCAServices(caInfo.url, { trustedRoots: caTLSCACerts, verify: true }, caInfo.caName);
//     return caClient;
// }

// // Function to build the wallet
// async function buildWallet(walletPath) {
//     const wallet = await Wallets.newFileSystemWallet(walletPath);
//     console.log(`Wallet path: ${walletPath}`);
//     return wallet;
// }

// // Enroll Admin
// app.post('/enroll-admin/:org', async (req, res) => {
//     const { org } = req.params;

//     try {
//         const caClient = await buildCAClient(org);
//         const wallet = await buildWallet(path.join(__dirname, 'wallet'));

//         const identity = await wallet.get(adminUserId);
//         if (identity) {
//             return res.status(200).send('Admin identity already exists in the wallet');
//         }

//         const enrollment = await caClient.enroll({ enrollmentID: adminUserId, enrollmentSecret: adminUserPasswd });
//         const x509Identity = {
//             credentials: {
//                 certificate: enrollment.certificate,
//                 privateKey: enrollment.key.toBytes(),
//             },
//             mspId: `${org}MSP`,
//             type: 'X.509',
//         };

//         await wallet.put(adminUserId, x509Identity);
//         res.status(201).send('Successfully enrolled admin user and imported it into the wallet');
//     } catch (error) {
//         console.error(`Failed to enroll admin user: ${error}`);
//         res.status(500).send(`Failed to enroll admin user: ${error.message}`);
//     }
// });

// // Register User
// app.post('/register-user', async (req, res) => {
//     const { org, userId, affiliation } = req.body;

//     try {
//         const caClient = await buildCAClient(org);
//         const wallet = await buildWallet(path.join(__dirname, 'wallet'));

//         const userIdentity = await wallet.get(userId);
//         if (userIdentity) {
//             return res.status(200).send(`User ${userId} already exists in the wallet`);
//         }

//         const adminIdentity = await wallet.get(adminUserId);
//         if (!adminIdentity) {
//             return res.status(400).send('Admin identity does not exist in the wallet. Enroll admin first.');
//         }

//         const provider = wallet.getProviderRegistry().getProvider(adminIdentity.type);
//         const adminUser = await provider.getUserContext(adminIdentity, adminUserId);

//         const secret = await caClient.register({
//             affiliation,
//             enrollmentID: userId,
//             role: 'client',
//         }, adminUser);

//         const enrollment = await caClient.enroll({
//             enrollmentID: userId,
//             enrollmentSecret: secret,
//         });

//         const x509Identity = {
//             credentials: {
//                 certificate: enrollment.certificate,
//                 privateKey: enrollment.key.toBytes(),
//             },
//             mspId: `${org}MSP`,
//             type: 'X.509',
//         };

//         await wallet.put(userId, x509Identity);
//         res.status(201).send(`Successfully registered and enrolled user ${userId}`);
//     } catch (error) {
//         console.error(`Failed to register user: ${error}`);
//         res.status(500).send(`Failed to register user: ${error.message}`);
//     }
// });

// // Check if User Exists
// app.get('/user-exists/:userId', async (req, res) => {
//     const { userId } = req.params;

//     try {
//         const wallet = await buildWallet(path.join(__dirname, 'wallet'));
//         const identity = await wallet.get(userId);
//         if (!identity) {
//             return res.status(404).send(`User ${userId} does not exist`);
//         }
//         res.status(200).send(`User ${userId} exists`);
//     } catch (error) {
//         console.error(`Error checking user existence: ${error}`);
//         res.status(500).send(`Error checking user existence: ${error.message}`);
//     }
// });

// // Start server
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
// });
