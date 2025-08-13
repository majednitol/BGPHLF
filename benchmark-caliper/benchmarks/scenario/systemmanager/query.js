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
                contractArguments: ["100"],
                timeout: 30000,

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


// this file showing error 
// 2025-06-21T13:48:32.066Z - error: [RoundRobinQueryHandler]: evaluate: message=Query failed. Errors: [], stack=FabricError: Query failed. Errors: []
//     at RoundRobinQueryHandler.evaluate (/home/node/.npm-global/lib/node_modules/fabric-network/lib/impl/query/roundrobinqueryhandler.js:70:23)
//     at Transaction.evaluate (/home/node/.npm-global/lib/node_modules/fabric-network/lib/transaction.js:322:49)
//     at V2FabricGateway._submitOrEvaluateTransaction (/home/node/.npm-global/lib/node_modules/@hyperledger/caliper-cli/node_modules/@hyperledger/caliper-fabric/lib/connector-versions/v2/FabricGateway.js:384:44)
//     at process.processTicksAndRejections (node:internal/process/task_queues:95:5)
//     at async V2FabricGateway._sendSingleRequest (/home/node/.npm-global/lib/node_modules/@hyperledger/caliper-cli/node_modules/@hyperledger/caliper-fabric/lib/connector-versions/v2/FabricGateway.js:168:16)
//     at async V2FabricGateway.sendRequests (/home/node/.npm-global/lib/node_modules/@hyperledger/caliper-core/lib/common/core/connector-base.js:83:26)
//     at async GetSystemManagerWorkload.submitTransaction (/hyperledger/caliper/workspace/benchmarks/scenario/systemmanager/query.js:11:30), name=FabricError
// 2025.06.21-13:48:32.067 error [caliper] [connectors/v2/FabricGateway] 	Failed to perform query transaction [GetSystemManager] using arguments [100],  with error: FabricError: Query failed. Errors: []
//     at RoundRobinQueryHandler.evaluate (/home/node/.npm-global/lib/node_modules/fabric-network/lib/impl/query/roundrobinqueryhandler.js:70:23)
//     at Transaction.evaluate (/home/node/.npm-global/lib/node_modules/fabric-network/lib/transaction.js:322:49)
//     at V2FabricGateway._submitOrEvaluateTransaction (/home/node/.npm-global/lib/node_modules/@hyperledger/caliper-cli/node_modules/@hyperledger/caliper-fabric/lib/connector-versions/v2/FabricGateway.js:384:44)
//     at process.processTicksAndRejections (node:internal/process/task_queues:95:5)
//     at async V2FabricGateway._sendSingleRequest (/home/node/.npm-global/lib/node_modules/@hyperledger/caliper-cli/node_modules/@hyperledger/caliper-fabric/lib/connector-versions/v2/FabricGateway.js:168:16)
//     at async V2FabricGateway.sendRequests (/home/node/.npm-global/lib/node_modules/@hyperledger/caliper-core/lib/common/core/connector-base.js:83:26)
//     at async GetSystemManagerWorkload.submitTransaction (/hyperledger/caliper/workspace/benchmarks/scenario/systemmanager/query.js:11:30)
// Response: TxStatus {
//   status: {
//     id: '734775722036a6b82ff79024df593742a55113dbac16646d50b1017889679786',
//     status: 'failed',
//     time_create: 1750513712061,
//     time_final: 1750513712067,
//     result: '',
//     verified: true,
//     flags: 0,
//     error_messages: [],
//     custom_data: Map(1) { 'request_type' => 'query' }
//   }
// }
// 2025-06-21T13:48:32.164Z - error: [RoundRobinQueryHandler]: evaluate: message=Query failed. Errors: [], stack=FabricError: Query failed. Errors: []
//     at RoundRobinQueryHandler.evaluate (/home/node/.npm-global/lib/node_modules/fabric-network/lib/impl/query/roundrobinqueryhandler.js:70:23)
//     at Transaction.evaluate (/home/node/.npm-global/lib/node_modules/fabric-network/lib/transaction.js:322:49)
//     at V2FabricGateway._submitOrEvaluateTransaction (/home/node/.npm-global/lib/node_modules/@hyperledger/caliper-cli/node_modules/@hyperledger/caliper-fabric/lib/connector-versions/v2/FabricGateway.js:384:44)
//     at process.processTicksAndRejections (node:internal/process/task_queues:95:5)
//     at async V2FabricGateway._sendSingleRequest (/home/node/.npm-global/lib/node_modules/@hyperledger/caliper-cli/node_modules/@hyperledger/caliper-fabric/lib/connector-versions/v2/FabricGateway.js:168:16)
//     at async V2FabricGateway.sendRequests (/home/node/.npm-global/lib/node_modules/@hyperledger/caliper-core/lib/common/core/connector-base.js:83:26)
//     at async GetSystemManagerWorkload.submitTransaction (/hyperledger/caliper/workspace/benchmarks/scenario/systemmanager/query.js:11:30), name=FabricError
// 2025.06.21-13:48:32.165 error [caliper] [connectors/v2/FabricGateway] 	Failed to perform query transaction [GetSystemManager] using arguments [100],  with error: FabricError: Query failed. Errors: []
//     at RoundRobinQueryHandler.evaluate (/home/node/.npm-global/lib/node_modules/fabric-network/lib/impl/query/roundrobinqueryhandler.js:70:23)
//     at Transaction.evaluate (/home/node/.npm-global/lib/node_modules/fabric-network/lib/transaction.js:322:49)
//     at V2FabricGateway._submitOrEvaluateTransaction (/home/node/.npm-global/lib/node_modules/@hyperledger/caliper-cli/node_modules/@hyperledger/caliper-fabric/lib/connector-versions/v2/FabricGateway.js:384:44)
//     at process.processTicksAndRejections (node:internal/process/task_queues:95:5)
//     at async V2FabricGateway._sendSingleRequest (/home/node/.npm-global/lib/node_modules/@hyperledger/caliper-cli/node_modules/@hyperledger/caliper-fabric/lib/connector-versions/v2/FabricGateway.js:168:16)
//     at async V2FabricGateway.sendRequests (/home/node/.npm-global/lib/node_modules/@hyperledger/caliper-core/lib/common/core/connector-base.js:83:26)
//     at async GetSystemManagerWorkload.submitTransaction (/hyperledger/caliper/workspace/benchmarks/scenario/systemmanager/query.js:11:30)
// Response: TxStatus {
//   status: {
//     id: 'fa604194705642816f022eaeaf5644e25e35ac071293fc791480eb487dace8ff',
//     status: 'failed',
//     time_create: 1750513712161,
//     time_final: 1750513712165,
//     result: '',
//     verified: true,
//     flags: 0,
//     error_messages: [],
//     custom_data: Map(1) { 'request_type' => 'query' }
//   }
// }