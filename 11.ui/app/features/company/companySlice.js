import apiRepository from '../../lib/apiRepository';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// ✅ Register Company With Member
export const registerCompanyWithMember = createAsyncThunk(
  'company/registerCompanyWithMember',
  async (payload, thunkAPI) => {
    try {
      const response = await apiRepository.post('/register-company-by-member', payload, true);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// ✅ Get Company
export const getCompany = createAsyncThunk(
  'company/getCompany',
  async (params, thunkAPI) => {
    try {
      const response = await apiRepository.get('/get-company', params, true);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// ✅ Approve Member
export const approveMember = createAsyncThunk(
  'company/approveMember',
  async (payload, thunkAPI) => {
    try {
      const response = await apiRepository.post('/approve-member', payload, true);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// ✅ Assign Resource
export const assignResource = createAsyncThunk(
  'company/assignResource',
  async (payload, thunkAPI) => {
    try {
      const response = await apiRepository.post('/assign-resource', payload, true);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// ✅ Request Resource
export const requestResource = createAsyncThunk(
  'company/requestResource',
  async (payload, thunkAPI) => {
    try {
      const response = await apiRepository.post('/request-resource', payload, true);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// ✅ Review Request
export const reviewRequest = createAsyncThunk(
  'company/reviewRequest',
  async (payload, thunkAPI) => {
    try {
      const response = await apiRepository.post('/review-request', payload, true);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// ✅ Get Company By Member ID
export const getCompanyByMemberID = createAsyncThunk(
  'company/getCompanyByMemberID',
  async (params, thunkAPI) => {
    try {
      const response = await apiRepository.get('/get-company-by-member-id', params, true);
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
  initialState,
  reducers: {
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
      });
  },
});

export const { resetState } = companySlice.actions;
export default companySlice.reducer;
