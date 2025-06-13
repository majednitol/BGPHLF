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
  getAllocationsByMember,
  getResourceRequestsByMember,
} from '../controllers/companyController.js';

const companyRouter = express.Router();

// Company registration and retrieval
companyRouter.post("/register-company-by-member", registerCompanyWithMember);
companyRouter.get("/get-company",authenticate, getCompany);
 
// Member actions
companyRouter.post("/approve-member",authenticate, approveMember);

// Resource management
companyRouter.post("/assign-resource",authenticate, assignResource);
companyRouter.post("/request-resource",authenticate, requestResource);
companyRouter.post("/review-request",authenticate, reviewRequest);


companyRouter.get("/get-resource-requests-by-member",authenticate, getResourceRequestsByMember);
companyRouter.get("/get-allocations-by-member",authenticate, getAllocationsByMember);
companyRouter.get("/get-company-by-member-id",authenticate, getCompanyByMemberID);

export default companyRouter;
