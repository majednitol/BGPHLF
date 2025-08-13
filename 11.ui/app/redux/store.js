import { configureStore } from '@reduxjs/toolkit';
import ipPrefixReducer from '../features/ipPrefix/ipPrefixSlice';
import userReducer from '../features/user/userSlice';
import companyReducer from '../features/company/companySlice';

const store = configureStore({
  reducer: {
    ipPrefix: ipPrefixReducer,
    user: userReducer,
    company: companyReducer,
  },
});
 
export default store;
