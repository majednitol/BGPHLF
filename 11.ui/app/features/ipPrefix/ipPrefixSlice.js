import apiRepository from '../../lib/apiRepository';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// ✅ Validate Path
export const validatePath = createAsyncThunk(
  'ipPrefix/validatePath',
  async ({ org ,comapanyID, prefix, pathJSON }, thunkAPI) => {
    try {
      const data = {org, comapanyID, prefix, pathJSON }
      const response = await apiRepository.post('ip/validate-path', data, true);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// ✅ Assign Prefix
export const assignPrefix = createAsyncThunk(
  'ipPrefix/assignPrefix',
  async ({ org,userID, prefix,
    assignedTo,
    timestamp }, thunkAPI) => {
    try {
      const data = {
       org, userID, prefix,
        assignedTo,
        timestamp
      }
      console.log(data)
      const response = await apiRepository.post('ip/assign-prefix', data, true);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.responses[0]?.response?.message || error.message);
    }
  }
);

// // ✅ Sub-Assign Prefix
// export const subAssignPrefix = createAsyncThunk(
//   'ipPrefix/subAssignPrefix',
//   async (payload, thunkAPI) => {
//     try {
//       const response = await apiRepository.post('ip/sub-assign-prefix', payload, true);
//       return response.data;
//     } catch (error) {
//       return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
//     }
//   }
// );

// ✅ Announce Route
export const announceRoute = createAsyncThunk(
  'ipPrefix/announceRoute',
  async ({org, comapanyID, asn,
    prefix,
    pathJSON }, thunkAPI) => {
    try {
      const data = {org,
        comapanyID, asn,
        prefix,
        pathJSON
      }
      const response = await apiRepository.post('ip/announce-route', data, true);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// ✅ Revoke Route
export const revokeRoute = createAsyncThunk(
  'ipPrefix/revokeRoute',
  async ({org, comapanyID, asn,
    prefix }, thunkAPI) => {
    try {
      const data = {org,comapanyID, asn,
    prefix}
      const response = await apiRepository.post('ip/revoke-route', data, true);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// ✅ Get Prefix Assignment
export const getPrefixAssignment = createAsyncThunk(
  'ipPrefix/getPrefixAssignment',
  async ({org,comapanyID,prefix}, thunkAPI) => {
    try {
      const params ={org,comapanyID,prefix}
      const response = await apiRepository.get('ip/get-prefix-assignment', params, true);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// ✅ Trace Prefix
export const tracePrefix = createAsyncThunk(
  'ipPrefix/tracePrefix',
  async ({org,comapanyID,prefix}, thunkAPI) => {
    try {
      const params = {comapanyID,prefix}
      const response = await apiRepository.get('ip/trace-prefix', params, true);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const listPendingRequests = createAsyncThunk(
  'ipPrefix/listPendingRequests',
  async ({org,userID}, thunkAPI) => {
    try {
      const params = {org,userID}
      const response = await apiRepository.get('ip/list-pending-requests', params, true);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);
export const getAllOwnedPrefixes = createAsyncThunk(
  'ipPrefix/getAllOwnedPrefixes',
  async ({org,userID}, thunkAPI) => {
    try {
      const params = {org,userID}
      const response = await apiRepository.get('ip/list-all-owned-prefixes', params, true);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);
export const listApprovedRequests = createAsyncThunk(
  'ipPrefix/listApprovedRequests',
  async ({org,userID}, thunkAPI) => {
    try {
      const params = {org,userID}
      const response = await apiRepository.get('ip/list-approved-requests', params, true);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);
export const listAllMembers = createAsyncThunk(
  'ipPrefix/listAllMembers',
  async ({org,userID}, thunkAPI) => {
    try {
      const params = {org,userID}
      const response = await apiRepository.get('ip/list-all-members', params, true);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);
const initialState = {
  data: null,
  prefix: null,
  loading: false,
  error: null,
  success: null,
};

const ipPrefixSlice = createSlice({
  name: 'ipPrefix',
  initialState,
  reducers: {
    resetState: (state) => {
      state.data = null;
      state.loading = false;
      state.error = null;
      state.success = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Validate Path
      .addCase(validatePath.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(validatePath.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload;
      })
      .addCase(validatePath.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Assign Prefix
      .addCase(assignPrefix.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(assignPrefix.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload;
      })
      .addCase(assignPrefix.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // // Sub-Assign Prefix
      // .addCase(subAssignPrefix.pending, (state) => {
      //   state.loading = true;
      //   state.error = null;
      //   state.success = null;
      // })
      // .addCase(subAssignPrefix.fulfilled, (state, action) => {
      //   state.loading = false;
      //   state.success = action.payload;
      // })
      // .addCase(subAssignPrefix.rejected, (state, action) => {
      //   state.loading = false;
      //   state.error = action.payload;
      // })

      // Announce Route
      .addCase(announceRoute.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(announceRoute.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload;
      })
      .addCase(announceRoute.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Revoke Route
      .addCase(revokeRoute.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(revokeRoute.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload;
      })
      .addCase(revokeRoute.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get Prefix Assignment
      .addCase(getPrefixAssignment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPrefixAssignment.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(getPrefixAssignment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Trace Prefix
      .addCase(tracePrefix.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(tracePrefix.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(tracePrefix.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
    // List Pending Requests
      .addCase(listPendingRequests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(listPendingRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(listPendingRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // List Approved Requests
      .addCase(listApprovedRequests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(listApprovedRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(listApprovedRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // List All Owned Prefixes
       .addCase(getAllOwnedPrefixes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllOwnedPrefixes.fulfilled, (state, action) => {
        state.loading = false;
        state.prefix = action.payload;
      })
      .addCase(getAllOwnedPrefixes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
    // List All Members
      .addCase(listAllMembers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(listAllMembers.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(listAllMembers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
  },
});

export const { resetState } = ipPrefixSlice.actions;
export default ipPrefixSlice.reducer;
