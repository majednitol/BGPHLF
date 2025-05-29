import express from 'express'
import authenticate from '../middleware/authenticate.js';
import { announceRoute, assignPrefix, getPrefixAssignment, revokeRoute, subAssignPrefix, tracePrefix, validatePath } from '../controllers/ipPrefixController.js';


const ipPrefixRouter = express.Router()
ipPrefixRouter.post("/validate-path", validatePath)

ipPrefixRouter.post("/assign-prefix", assignPrefix)
ipPrefixRouter.post("/sub-assign-prefix", subAssignPrefix)
ipPrefixRouter.post("/announce-route", announceRoute)
ipPrefixRouter.post("/revoke-route", revokeRoute)

ipPrefixRouter.get("/get-prefix-assignment", getPrefixAssignment)
//TracePrefix
ipPrefixRouter.get("/trace-prefix", tracePrefix)
 
export default ipPrefixRouter