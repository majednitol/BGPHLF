/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

import createHttpError from "http-errors";

const adminUserId = 'admin';


/**
 * Login User by validating secret and retrieving user attributes.
 * @param {object} caClient - Fabric CA client instance.
 * @param {object} wallet - Wallet containing user identities.
 * @param {string} secret - ID token to verify.
 * @param {string} userId - User ID to validate.
 * @returns {object} - User attributes if validation succeeds.
 * @throws {Error} - If user validation fails.
 */
import { Wallets } from "fabric-network";
import FabricCAServices from 'fabric-ca-client';
import { Utils as utils } from 'fabric-common';
import { getCCP } from "../common/buildCCP.js";
import { resolve } from 'path';
import { buildWallet } from "./AppUtils.js";
import { buildCAClient } from "./CAUtil.js";
let config = utils.getConfig()
config.file(resolve('config.json'))
let walletPath;
export async function LoginUtils(secret, userId,next) {
    try {
        walletPath = resolve("wallet")
        const wallet = await buildWallet(Wallets, walletPath);
        console.log("wallet ", wallet)
        const userIdentity = await wallet.get(userId);
        console.log("userIdentity mspId", userIdentity?.mspId)
        if (!userIdentity) {
            return next(createHttpError(400, 'user identity does not exist in the wallet'));

        }
        const OrgMSP = userIdentity.mspId
        let org = Number(OrgMSP.match(/\d/g).join(""));
        let ccp = getCCP(org)
        const caClient = buildCAClient(FabricCAServices, ccp, `ca-org${org}`);
   

        const adminIdentity = await wallet.get(adminUserId);
        if (!adminIdentity) {
            throw createHttpError(400, 'Admin identity does not exist in the wallet. Please enroll the admin user.');
        }
        const provider = wallet.getProviderRegistry().getProvider(adminIdentity.type);
        const adminUser = await provider.getUserContext(adminIdentity, adminUserId);
        const identityService = caClient.newIdentityService();
        const userAttributes = await identityService.getOne(userId, adminUser);
        if (!userAttributes || !userAttributes.result || !userAttributes.result.attrs) {
            throw createHttpError(404, `User ${userId} not found.`);
        }
        console.log(`Validating attributes for user: ${userId}`);
        const attrs = userAttributes.result.attrs;
        const validsecret = attrs.find(attr => attr.name === 'secret' && attr.value === secret);
        const validOrg = attrs.find(attr => attr.name === 'org' && attr.value === 'Org1MSP');

        if (!validsecret || !validOrg) {
            throw createHttpError(403, `User validation failed: Invalid ID token or organization mismatch.${validsecret}, ${validOrg} , ${secret}` );
        }
        const orgAttr = attrs.find(attr => attr.name === 'org');
        console.log(`User ${userId} successfully validated.`);
        return { userId, org: orgAttr.value };
    } catch (error) {
        console.error(`Failed to login user: ${error.message}`);
        throw createHttpError(500, `Failed to login user: ${error.message}`);
    }
}