'use strict';

const { WorkloadModuleBase } = require('@hyperledger/caliper-core');

class GetSystemManagerWorkload extends WorkloadModuleBase {
    async submitTransaction() {
        const { userId } = this.roundArguments;

        try {
            // Call chaincode function "GetSystemManager" with userId argument
            const response = await this.sutAdapter.sendRequests({
                contractId: 'basic',
                contractFunction: 'GetSystemManager',
                contractArguments: [userId],
                readOnly: true
            });

            console.log('Response:', response);

        } catch (error) {
            console.error('❌ Query transaction failed:', error);
            throw error;
        }
    }
}

function createWorkloadModule() {
    return new GetSystemManagerWorkload();
}

module.exports.createWorkloadModule = createWorkloadModule;
