import apiClient from './apiClient';

const getAccessToken = () => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('accessToken');
};

const getAuthHeaders = (tokenRequired = true) => {
  if (!tokenRequired) return {};
  const token = getAccessToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const apiRepository = {
  async get(endpoint, params = {}, tokenRequired = true) {
    return apiClient.get(endpoint, {
      params,
      headers: {
        ...getAuthHeaders(tokenRequired),
      },
    });
  },

  async post(endpoint, data = {}, tokenRequired = true) {
    return apiClient.post(endpoint, data, {
      headers: {
        ...getAuthHeaders(tokenRequired),
      },
    });
  },

  async put(endpoint, data = {}, tokenRequired = true) {
    return apiClient.put(endpoint, data, {
      headers: {
        ...getAuthHeaders(tokenRequired),
      },
    });
  },

  async delete(endpoint, params = {}, tokenRequired = true) {
    return apiClient.delete(endpoint, {
      params,
      headers: {
        ...getAuthHeaders(tokenRequired),
      },
    });
  },

  async customRequest({ method = 'get', endpoint, data = {}, headers = {}, tokenRequired = true }) {
    const isWriteMethod = ['POST', 'PUT', 'PATCH'].includes(method.toUpperCase());
    return apiClient({
      method,
      url: endpoint,
      ...(isWriteMethod ? { data } : { params: data }),
      headers: {
        ...headers,
        ...getAuthHeaders(tokenRequired),
      },
    });
  },
};

export default apiRepository;
