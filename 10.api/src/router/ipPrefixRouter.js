import express from 'express'
import authenticate from '../middleware/authenticate.js';
import { announceRoute, assignPrefix, getAllOwnedPrefixes, getPrefixAssignment, listAllASNValues, listAllMembers, listApprovedRequests, listPendingRequests, revokeRoute, subAssignPrefix, tracePrefix, validatePath } from '../controllers/ipPrefixController.js';


const ipPrefixRouter = express.Router()
ipPrefixRouter.post("/validate-path",authenticate, validatePath)

ipPrefixRouter.post("/assign-prefix",authenticate, assignPrefix)
ipPrefixRouter.post("/sub-assign-prefix", subAssignPrefix)
ipPrefixRouter.post("/announce-route",authenticate, announceRoute)
ipPrefixRouter.post("/revoke-route",authenticate, revokeRoute)

ipPrefixRouter.get("/get-prefix-assignment",authenticate, getPrefixAssignment)
//TracePrefix
ipPrefixRouter.get("/trace-prefix",authenticate, tracePrefix)

ipPrefixRouter.get("/list-pending-requests",authenticate, listPendingRequests)

ipPrefixRouter.get("/list-approved-requests",authenticate, listApprovedRequests)
ipPrefixRouter.get("/list-all-owned-prefixes",authenticate, getAllOwnedPrefixes)
ipPrefixRouter.get("/list-all-members",authenticate,listAllMembers)
   .get("/list-all-asn-values",authenticate, listAllASNValues)
export default ipPrefixRouter