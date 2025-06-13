import apiRepository from '../../lib/apiRepository';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';

const newUUID = uuidv4();
// ✅ Register Company With Member
export const registerCompanyWithMember = createAsyncThunk(
  'company/registerCompanyWithMember',
  async ({ org, comapanyID,
    legalEntityName,
    industryType,
    addressLine1,
    city,
    state,
    postcode,
    economy,
    phone,
    orgEmail,
    abuseEmail,
    isMemberOfNIR,
    memberID,
    memberName,
    memberCountry,
    memberEmail }, thunkAPI) => {
    try {
      const data = {
        org,
        comapanyID: newUUID,
        legalEntityName,
        industryType,
        addressLine1,
        city,
        state,
        postcode,
        economy,
        phone,
        orgEmail,
        abuseEmail,
        isMemberOfNIR,
        memberID,
        memberName,
        memberCountry,
        memberEmail
      }
      const response = await apiRepository.post('company/register-company-by-member', data, false);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// ✅ Get Company
export const getCompany = createAsyncThunk(
  'company/getCompany',
  async (_, thunkAPI) => {
    try {
      const response = await apiRepository.get('/company/get-company', {}, false);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// ✅ Approve Member
export const approveMember = createAsyncThunk(
  'company/approveMember',
  async ({ org, memberID }, thunkAPI) => {
    try {
      const data = { org, memberID }
      const response = await apiRepository.post('company/approve-member', data, true);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// ✅ Assign Resource
export const assignResource = createAsyncThunk(
  'company/assignResource',
  async ({ org, allocationID, memberID, parentPrefix, subPrefix, expiry, timestamp }, thunkAPI) => {
    try {
      const data = { org, allocationID:newUUID, memberID, parentPrefix, subPrefix, expiry, timestamp }
      const response = await apiRepository.post('company/assign-resource', data, true);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// ✅ Request Resource
export const requestResource = createAsyncThunk(
  'company/requestResource',
  async ({ org, reqID,
    memberID,
    resType,
    value, date, country, rir, prefixMaxLength, timestamp }, thunkAPI) => {
    try {
      const data = {
        org,
        reqID:newUUID,
        memberID,
        resType,
        value, date, country, rir, prefixMaxLength, timestamp
      }
      console.log("data", data)
      const response = await apiRepository.post('company/request-resource', data, true);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// ✅ Review Request
export const reviewRequest = createAsyncThunk(
  'company/reviewRequest',
  async ({ org, reqID,
    decision,
    reviewedBy }, thunkAPI) => {
    try {
      const data = {
        org,
        reqID,
        decision,
        reviewedBy
      }
      console.log("payload", data)
      const response = await apiRepository.post('company/review-request', data, false);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// ✅ Get Company By Member ID
export const getCompanyByMemberID = createAsyncThunk(
  'company/getCompanyByMemberID',
  async (_, thunkAPI) => {
    try {
      const response = await apiRepository.get('company/get-company-by-member-id', {}, true);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);
export const getResourceRequestsByMember = createAsyncThunk(
  'company/getResourceRequestsByMember',
  async (_, thunkAPI) => {
    try {
  
      const response = await apiRepository.get('company/get-resource-requests-by-member', {}, true);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);
export const getAllocationsByMember = createAsyncThunk(
  'company/getAllocationsByMember',
  async (_, thunkAPI) => {
    try {
      const response = await apiRepository.get('company/get-allocations-by-member', {}, true);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);
const initialState = {
  companyData: null,
  loading: false,
  error: null,
  success: null,
};

const companySlice = createSlice({
  name: 'company',
  initialState, reducers: {
    resetState: (state) => {
      state.companyData = null;
      state.loading = false;
      state.error = null;
      state.success = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Register Company With Member
      .addCase(registerCompanyWithMember.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(registerCompanyWithMember.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload;
      })
      .addCase(registerCompanyWithMember.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get Company
      .addCase(getCompany.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCompany.fulfilled, (state, action) => {
        state.loading = false;
        state.companyData = action.payload;
      })
      .addCase(getCompany.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Approve Member
      .addCase(approveMember.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(approveMember.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload;
      })
      .addCase(approveMember.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Assign Resource
      .addCase(assignResource.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(assignResource.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload;
      })
      .addCase(assignResource.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Request Resource
      .addCase(requestResource.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(requestResource.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload;
      })
      .addCase(requestResource.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Review Request
      .addCase(reviewRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(reviewRequest.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload;
      })
      .addCase(reviewRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get Company By Member ID
      .addCase(getCompanyByMemberID.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCompanyByMemberID.fulfilled, (state, action) => {
        state.loading = false;
        state.companyData = action.payload;
      })
      .addCase(getCompanyByMemberID.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get Resource Requests By Member
      .addCase(getResourceRequestsByMember.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getResourceRequestsByMember.fulfilled, (state, action) => {
        state.loading = false;
        state.companyData = action.payload;
      })
      .addCase(getResourceRequestsByMember.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get Allocations By Member
      .addCase(getAllocationsByMember.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllocationsByMember.fulfilled, (state, action) => {
        state.loading = false;
        state.companyData = action.payload;
      })
      .addCase(getAllocationsByMember.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
  },
});
export const { resetState } = companySlice.actions;
export default companySlice.reducer;
