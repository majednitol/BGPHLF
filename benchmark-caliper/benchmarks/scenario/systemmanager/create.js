'use strict';

const axios = require('axios');
const { WorkloadModuleBase } = require('@hyperledger/caliper-core');

const ENROLL_API_URL = 'http://68.183.80.241:30400/user/register'; // Your enroll API

// Generate random 5-digit userId
function getRandomUserId() {
    return Math.floor(10000 + Math.random() * 90000).toString();
}

class CreateSystemManagerWorkload extends WorkloadModuleBase {
    constructor() {
        super();
        this.counter = 0;
    }

    async submitTransaction() {
        // Generate a unique id
        const userId = getRandomUserId();
        const name = this.roundArguments.name;
        const email = this.roundArguments.email;
        const orgMSP = this.roundArguments.orgMSP;
        const role = this.roundArguments.role;
        const createdAt = this.roundArguments.createdAt;

        // Generate a random userId for enrollment
        

        // Prepare enrollment payload
        const enrollPayload = {
            org: orgMSP,
            userId: userId,
            affiliation: 'rono.technical'
        };

        try {
            // Enroll user before submitting transaction
            await axios.post(ENROLL_API_URL, enrollPayload, {
                headers: { 'Content-Type': 'application/json' }
            });
            // Enrollment successful, now submit transaction
            const args = [userId, name, email, orgMSP, role, createdAt];

            await this.sutAdapter.sendRequests({
                contractId: 'basic',                  // Update if needed
                contractFunction: 'CreateSystemManager',
                invokerIdentity: 'Admin@org1.example.com', // Change if needed
                contractArguments: args,
                readOnly: false
            });
        } catch (error) {
            console.error(`Enrollment failed for user ${userId}:`, error.message);
        
            throw error;
        }
    }
}

function createWorkloadModule() {
    return new CreateSystemManagerWorkload();
}

module.exports.createWorkloadModule = createWorkloadModule;
