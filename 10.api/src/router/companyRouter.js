import express from 'express';

import authenticate from '../middleware/authenticate.js';
import {
  getCompany,
  registerCompanyWithMember,
  approveMember,
  assignResource,
  requestResource,
  reviewRequest,
  getCompanyByMemberID,
} from '../controllers/companyController.js';

const companyRouter = express.Router();

// Company registration and retrieval
companyRouter.post("/register-company-by-member", registerCompanyWithMember);
companyRouter.get("/get-company", getCompany);
 
// Member actions
companyRouter.post("/approve-member", approveMember);

// Resource management
companyRouter.post("/assign-resource", assignResource);
companyRouter.post("/request-resource", requestResource);
companyRouter.post("/review-request", reviewRequest);


companyRouter.get("/get-company-by-member-id", getCompanyByMemberID);

export default companyRouter;
