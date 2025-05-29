import apiClient from './apiClient';

// Replace this with a better token mechanism (cookies, session) in production
const getAccessToken = () => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('accessToken');
};

const getAuthHeaders = () => {
  const token = getAccessToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const apiRepository = {
  async get(endpoint, params = {}, requireToken = true) {
    return apiClient.get(endpoint, {
      params,
      headers: requireToken ? getAuthHeaders() : {},
    });
  },

  async post(endpoint, data = {}, requireToken = true) {
    return apiClient.post(endpoint, data, {
      headers: requireToken ? getAuthHeaders() : {},
    });
  },

  async put(endpoint, data = {}, requireToken = true) {
    return apiClient.put(endpoint, data, {
      headers: requireToken ? getAuthHeaders() : {},
    });
  },

  async delete(endpoint, params = {}, requireToken = true) {
    return apiClient.delete(endpoint, {
      params,
      headers: requireToken ? getAuthHeaders() : {},
    });
  },

  async customRequest({ method, endpoint, data = {}, headers = {}, requireToken = true }) {
    return apiClient({
      method,
      url: endpoint,
      data: ['POST', 'PUT', 'PATCH'].includes(method.toUpperCase()) ? data : undefined,
      params: ['GET', 'DELETE'].includes(method.toUpperCase()) ? data : undefined,
      headers: {
        ...headers,
        ...(requireToken ? getAuthHeaders() : {}),
      },
    });
  },
};

export default apiRepository;
