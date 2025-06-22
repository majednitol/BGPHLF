'use strict';

const axios = require('axios');
const { WorkloadModuleBase } = require('@hyperledger/caliper-core');
class CreateSystemManagerWorkload extends WorkloadModuleBase {
    // getRandom number 6 digit 
    getRandomNumber() {
        return Math.floor(Math.random() * 1000000);
    }
    async submitTransaction() {

        const { name, email, orgMSP, role, createdAt } = this.roundArguments;
        try {
            let userId = this.getRandomNumber();
            const args = [userId, name, email, orgMSP, role, createdAt];
            await this.sutAdapter.sendRequests({
                contractId: 'basic',
                contractFunction: 'CreateSystemManager',
                contractArguments: args,
                readOnly: false
            });

        } catch (error) {

            console.error('❌ API Call failed:', error);

            throw error;
        }
    }
}

function createWorkloadModule() {
    return new CreateSystemManagerWorkload();
}

module.exports.createWorkloadModule = createWorkloadModule;
