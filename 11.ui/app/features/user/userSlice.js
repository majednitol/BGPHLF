
import apiRepository from '../../lib/apiRepository';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// ✅ Get User
export const getUser = createAsyncThunk('user/getUser', async ({ userId, org }, thunkAPI) => {
  try {
    const params = { userId, org };
    const response = await apiRepository.get('/user/get-user', params, true);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const getAllPrefixesAssignedByOrg = createAsyncThunk('user/getAllPrefixesAssignedByOrg', async ({ userId, org }, thunkAPI) => {
  try {
    const params = { userId, org };
    const response = await apiRepository.get('/user/get-all-prefixes-assigned-by-org', params, true);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const getOrgUser = createAsyncThunk('user/getOrgUser', async ({ userId, org }, thunkAPI) => {
  try {
    const params = { userId, org };
    const response = await apiRepository.get('/user/get-system-manager', params, true);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

// ✅ Register User (Enroll identity only)
export const registerUser = createAsyncThunk('user/registerUser', async ({ userId, org, affiliation }, thunkAPI) => {
  try {
    const data = { userId, org, affiliation };
    const response = await apiRepository.post('/user/register', data, false);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

// ✅ Create User (Chaincode level)
export const createUser = createAsyncThunk('user/createUser', async ({ userID, org, dept, comapanyID, timestamp }, thunkAPI) => {
  try {
    const data = { userID, org, dept, comapanyID, timestamp };
    const response = await apiRepository.post('/user/create-user', data, false);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});
export const createOrgUser = createAsyncThunk('user/createOrgUser', async ({ userID, name, email, orgMSP, role, createdAt }, thunkAPI) => {
  try {
    const data = { userID, name, email, orgMSP, role, createdAt };
    const response = await apiRepository.post('/user/create-system-manager', data, false);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});
// ✅ Login User
export const loginUser = createAsyncThunk('user/loginUser', async ({ userID, org }, thunkAPI) => {
  try {
    const data = { userID, org };
    const response = await apiRepository.post('/user/login-user', data, false);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const loggedInUser = createAsyncThunk('user/loggedInUser', async ({ userId, org }, thunkAPI) => {
  try {
    const data = { userId, org };
    const response = await apiRepository.post('/user/loggin-user', data, false);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

const initialState = {
  userData: null,
  isLoggedIn: false,
  loading: false,
  error: null,
  success: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  extraReducers: (builder) => {
    builder
      // Get User
      .addCase(getUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.loading = false;
        state.userData = action.payload;
      })
      .addCase(getUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get All Prefixes Assigned By RONO
      .addCase(getAllPrefixesAssignedByOrg.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllPrefixesAssignedByOrg.fulfilled, (state, action) => {
        state.loading = false;
        state.userData = action.payload;
      })
      .addCase(getAllPrefixesAssignedByOrg.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getOrgUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOrgUser.fulfilled, (state, action) => {
        state.loading = false;
        state.userData = action.payload;
      })
      .addCase(getOrgUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Register User
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create User
      .addCase(createUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload;
      })
      .addCase(createUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createOrgUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(createOrgUser.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload;
      })
      .addCase(createOrgUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Login User
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isLoggedIn = true;
        state.userData = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.isLoggedIn = false;
        state.error = action.payload;
      })
      // Logged In User
      .addCase(loggedInUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(loggedInUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isLoggedIn = true;
        state.userData = action.payload;
      })
      .addCase(loggedInUser.rejected, (state, action) => {
        state.loading = false;
        state.isLoggedIn = false;
        state.error = action.payload;
      });

  },
});

export default userSlice.reducer;
