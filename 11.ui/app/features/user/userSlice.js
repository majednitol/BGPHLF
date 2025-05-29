import apiRepository from '@/app/lib/apiRepository';
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
  reducers: {
    logout: (state) => {
      state.userData = null;
      state.isLoggedIn = false;
      state.success = null;
      state.error = null;
    },
  },
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
      });
  },
});

export const { logout } = userSlice.actions;
export default userSlice.reducer;
