/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';
import { Wallets } from "fabric-network";
import { existsSync, readFileSync } from 'fs';
import nano from "nano";
import { resolve } from 'path';

export function buildCCPOrg1(orgMSP) {

	const org = orgMSP.replace('MSP', '').toLowerCase();
	console.log("org".org)
  const ccpPath = resolve(`connection-profile/connection-${org}.json`);
	console.log("ccpPath", ccpPath)
	const fileExists = existsSync(ccpPath);
	if (!fileExists) {
		throw new Error(`no such file or directory: ${ccpPath}`);
	}
	const contents = readFileSync(ccpPath, 'utf8');

	const ccp = JSON.parse(contents);

	console.log(`Loaded the network configuration located at ${ccpPath}`);
	return ccp;
}




export async function buildWallet() {
	const url = process.env.COUCHDB_URL || 'http://admin:adminpw@couchdb:5982';
	const dbName = process.env.COUCHDB_WALLET_DB || 'fabric_wallet';

	// Create database if not exists
	const nanoClient = nano(url);
	try {
		await nanoClient.db.create(dbName);
		console.log(`Created database ${dbName}`);
	} catch (error) {
		if (error.error === 'file_exists') {
			console.log(`Using existing database ${dbName}`);
		} else {
			throw error;
		}
	}

	const wallet = await Wallets.newCouchDBWallet({
		url: url,
		database: dbName
	});

	console.log(`Connected to CouchDB wallet at ${url}/${dbName}`);
	return wallet;
}
export function prettyJSONString(inputString) {
	if (inputString) {
		return JSON.stringify(JSON.parse(inputString), null, 2);
	}
	else {
		return inputString;
	}
}
