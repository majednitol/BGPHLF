import express from 'express'
import authenticate from '../middleware/authenticate.js';
import { announceRoute, assignPrefix, getPrefixAssignment, registerAS, revokeRoute, subAssignPrefix, validatePath } from '../controllers/ipPrefixController.js';


const ipPrefixRouter = express.Router()
ipPrefixRouter.post("/validate-path", validatePath)

ipPrefixRouter.post("/assign-prefix", assignPrefix)
ipPrefixRouter.post("/sub-assign-prefix", subAssignPrefix)
ipPrefixRouter.post("/announce-route", announceRoute)
ipPrefixRouter.post("/revoke-route", revokeRoute)
ipPrefixRouter.post("/register-as", registerAS)
ipPrefixRouter.get("/get-prefix-assignment", getPrefixAssignment)
export default ipPrefixRouter