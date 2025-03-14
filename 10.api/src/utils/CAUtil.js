/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const adminUserId = 'admin';
const adminUserPasswd = 'adminpw';

/**
 *
 * @param {*} FabricCAServices
 * @param {*} ccp
 */
import { performance } from 'perf_hooks';

export async function registerAndEnrollUser(caClient, wallet, orgMspId, userId, affiliation, secret, encryptionKey) {
    const timers = {
        checkUserExists: 0,
        getAdminIdentity: 0,
        registerUser: 0,
        enrollUser: 0,
        saveToWallet: 0,
        total: performance.now()
    };

    try {
        // Check if user identity already exists in the wallet
        const checkUserStart = performance.now();
        const userIdentity = await wallet.get(userId);
        timers.checkUserExists = performance.now() - checkUserStart;

        if (userIdentity) {
            console.log(`User ${userId} exists.`);
            console.log(`Execution times:`);
            console.log(`- Check if user exists: ${timers.checkUserExists.toFixed(2)}ms`);
            console.log(`Total execution time: ${(performance.now() - timers.total).toFixed(2)}ms`);
            return;
        }

        // Get admin identity from the wallet
        const getAdminStart = performance.now();
        const adminIdentity = await wallet.get(adminUserId);
        if (!adminIdentity) {
            throw new Error('Admin identity not found.');
        }
        timers.getAdminIdentity = performance.now() - getAdminStart;

        // Prepare admin context for registration
        const provider = wallet.getProviderRegistry().getProvider(adminIdentity.type);
        const adminUser = await provider.getUserContext(adminIdentity, adminUserId);

        // Register the user
        const registerStart = performance.now();
        const secretData = await caClient.register({
            affiliation: affiliation,
            enrollmentID: userId,
            role: 'client'
        }, adminUser);
        timers.registerUser = performance.now() - registerStart;

        // Enroll the user
        const enrollStart = performance.now();
        const enrollment = await caClient.enroll({
            enrollmentID: userId,
            enrollmentSecret: secretData
        });
        timers.enrollUser = performance.now() - enrollStart;

        // Save user identity to the wallet
        const saveWalletStart = performance.now();
        const x509Identity = {
            credentials: {
                certificate: enrollment.certificate,
                privateKey: enrollment.key.toBytes(),
            },
            mspId: orgMspId,
            type: 'X.509'
        };

        await wallet.put(userId, x509Identity);
        timers.saveToWallet = performance.now() - saveWalletStart;

        // Calculate total execution time
        timers.total = performance.now() - timers.total;

        // Log timing results
        console.log(`User ${userId} enrolled successfully.`);
        console.log('Execution times:');
        console.log(`- Check if user exists: ${timers.checkUserExists.toFixed(2)}ms`);
        console.log(`- Get admin identity: ${timers.getAdminIdentity.toFixed(2)}ms`);
        console.log(`- Register user: ${timers.registerUser.toFixed(2)}ms`);
        console.log(`- Enroll user: ${timers.enrollUser.toFixed(2)}ms`);
        console.log(`- Save to wallet: ${timers.saveToWallet.toFixed(2)}ms`);
        console.log(`Total execution time: ${timers.total.toFixed(2)}ms`);
    } catch (error) {
        timers.total = performance.now() - timers.total;
        console.error(`Error: ${error}`);
        console.error('Execution times until error:', timers);
    }
}

export function buildCAClient(FabricCAServices, ccp, caHostName) {

	const caInfo = ccp.certificateAuthorities[caHostName];
	const caTLSCACerts = caInfo.tlsCACerts.pem;
	const caClient = new FabricCAServices(caInfo.url, { trustedRoots: caTLSCACerts, verify: true }, caInfo.caName);
	console.log(`Built a CA Client named ${caInfo.caName}`);
	return caClient;
}

export async function enrollAdmin(caClient, wallet, orgMspId) {
	try {
		// Check to see if we've already enrolled the admin user.
		const identity = await wallet.get(adminUserId);
		if (identity) {
			console.log('An identity for the admin user already exists in the wallet');
			return;
		}

		console.log("Admin Identity not found... Enroll admin")
		// Enroll the admin user, and import the new identity into the wallet.
		const enrollment = await caClient.enroll({ enrollmentID: adminUserId, enrollmentSecret: adminUserPasswd });
		const x509Identity = {
			credentials: {
				certificate: enrollment.certificate,
				privateKey: enrollment.key.toBytes(),
			},
			mspId: orgMspId,
			type: 'X.509',
		};

		await wallet.put(adminUserId, x509Identity);
		console.log('Successfully enrolled admin user and imported it into the wallet');
	} catch (error) {
		console.error(`Failed to enroll admin user : ${error}`);
	}
}
// export async function registerAndEnrollUser(caClient, wallet, orgMspId, userId, affiliation, secret, encryptionKey) {
//     try {
//         const userIdentity = await wallet.get(userId);
//         if (userIdentity) {
//             console.log(`User ${userId} exists.`);
//             return;
//         }

//         const adminIdentity = await wallet.get(adminUserId);
//         if (!adminIdentity) {
//             throw new Error('Admin identity not found.');
//         }

//         const provider = wallet.getProviderRegistry().getProvider(adminIdentity.type);
//         const adminUser = await provider.getUserContext(adminIdentity, adminUserId);

//         // Register without attributes for testing
//         const secretData = await caClient.register({
//             affiliation: affiliation,
//             enrollmentID: userId,
//             role: 'client'
//         }, adminUser);

//         const enrollment = await caClient.enroll({
//             enrollmentID: userId,
//             enrollmentSecret: secretData
//         });

//         const x509Identity = {
//             credentials: {
//                 certificate: enrollment.certificate,
//                 privateKey: enrollment.key.toBytes(),
//             },
//             mspId: orgMspId,
//             type: 'X.509'
//         };

//         await wallet.put(userId, x509Identity);
//         console.log(`User ${userId} enrolled successfully.`);
//     } catch (error) {
//         console.error(`Error: ${error}`);
//     }
// }




// export async function registerAndEnrollUser(caClient, wallet, orgMspId, userId, affiliation,secret,encryptionKey) {
// 	try {

// 		const userIdentity = await wallet.get(userId);
// 		if (userIdentity) {
// 			console.log(`An identity for the user ${userId} already exists in the wallet`);
			
// 			return;
// 		}

// 		// Must use an admin to register a new user
// 		const adminIdentity = await wallet.get(adminUserId);
// 		console.log("adminIdentity", adminIdentity)
// 		if (!adminIdentity) {
// 			console.log('An identity for the admin user does not exist in the wallet');
// 			console.log('Enroll the admin user before retrying');
// 			return;
// 		}
// 		const provider = wallet.getProviderRegistry().getProvider(adminIdentity.type);
// 		const adminUser = await provider.getUserContext(adminIdentity, adminUserId);
// 		const secretData = await caClient.register({
// 			affiliation: affiliation,
// 			enrollmentID: userId,
// 			role: 'client',
// 			attrs: [
// 				{ name: 'secret', value: secret, ecert: true },
// 				{ name: 'encryptionKey', value: encryptionKey, ecert: true },
// 				{ name: 'org', value: orgMspId, ecert: true },
// 				{ name: 'issuedAt', value: new Date().toISOString(), ecert: true }, // Timestamp of issuance
// 			],
// 		}, adminUser);
// 		const enrollment = await caClient.enroll({
// 			enrollmentID: userId,
// 			enrollmentSecret: secretData
// 		});

// 		const x509Identity = {
// 			credentials: {
// 				certificate: enrollment.certificate,
// 				privateKey: enrollment.key.toBytes(),
// 			},
// 			mspId: orgMspId,
// 			type: 'X.509'
// 		};
// 		await wallet.put(userId, x509Identity);
// 		console.log(`Successfully registered and enrolled user ${userId} and imported it into the wallet`);
// 		const identityService = caClient.newIdentityService();
//     const userAttributes = await identityService.getOne(userId, adminUser);

// 		console.log(`User ${userId} registered with the following attributes:`);
// 		console.log("userAttributes.result",userAttributes.result)
//     userAttributes.result.attrs.forEach(attr => 
//         console.log(`- ${attr.name}: ${attr.value}`)
//     );
// 	} catch (error) {
// 		console.error(`Failed to register user : ${error}`);
// 	}
// }


// export async function userExist(wallet, userId) {
// 	console.log("userExist: wallet path", wallet)
// 	const identity = await wallet.get(userId);
// 	if (!identity) {
// 		throw new Error("Identity not exist ")
// 	}
// 	return true;
// }