'use strict';

const axios = require('axios');
const { WorkloadModuleBase } = require('@hyperledger/caliper-core');
class CreateSystemManagerWorkload extends WorkloadModuleBase {
    async submitTransaction() {
     
        const {userId, name, email, orgMSP, role, createdAt } = this.roundArguments;
        try {
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
