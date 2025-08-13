import axios from 'axios';

// Axios instance
const apiClient = axios.create({
  baseURL: 'http://localhost:4000', // Change this
  timeout: 100000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Interceptors
apiClient.interceptors.request.use(
  (config) => {
    console.log(`[Request] ${config.method.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => {
    console.log('[Response]', response.data);
    return response;
  },
  (error) => {
    console.error('[API Error]', error.response?.data || error.message);
    return Promise.reject(error.response?.data || error.message);
  }
);

export default apiClient;
