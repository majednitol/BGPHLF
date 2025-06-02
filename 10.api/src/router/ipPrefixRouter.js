import express from 'express'
import authenticate from '../middleware/authenticate.js';
import { announceRoute, assignPrefix, getAllOwnedPrefixes, getPrefixAssignment, listAllMembers, listApprovedRequests, listPendingRequests, revokeRoute, subAssignPrefix, tracePrefix, validatePath } from '../controllers/ipPrefixController.js';


const ipPrefixRouter = express.Router()
ipPrefixRouter.post("/validate-path", validatePath)

ipPrefixRouter.post("/assign-prefix", assignPrefix)
ipPrefixRouter.post("/sub-assign-prefix", subAssignPrefix)
ipPrefixRouter.post("/announce-route", announceRoute)
ipPrefixRouter.post("/revoke-route", revokeRoute)

ipPrefixRouter.get("/get-prefix-assignment", getPrefixAssignment)
//TracePrefix
ipPrefixRouter.get("/trace-prefix", tracePrefix)

ipPrefixRouter.get("/list-pending-requests", listPendingRequests)

ipPrefixRouter.get("/list-approved-requests", listApprovedRequests)
ipPrefixRouter.get("/list-all-owned-prefixes", getAllOwnedPrefixes)
ipPrefixRouter.get("/list-all-members",listAllMembers)
 
export default ipPrefixRouter