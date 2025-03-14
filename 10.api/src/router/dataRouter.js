import express from 'express' 
import { allUserTypeData, revokeAccessData, shareData } from '../controllers/dataController.js';
import authenticate from '../middleware/authenticate.js';

const dataRouter = express.Router()
dataRouter.post("/share-user-data",authenticate, shareData)
dataRouter.delete("/revoke-access-data",authenticate, revokeAccessData)
dataRouter.get('/all-user-type-data',authenticate, allUserTypeData);
export default dataRouter