import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

// Create an Axios instance
const apiClient = axios.create({
    baseURL: "http://www.patient-bio.majedurnitol.site",
    timeout: 1000000, // Request timeout
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
});

// Request Interceptor
apiClient.interceptors.request.use(
    (config) => {
        console.log(`Request: ${config.method.toUpperCase()} ${config.url}`);
        return config;
    },
    (error) => Promise.reject(error)
);

// Response Interceptor
apiClient.interceptors.response.use(
    (response) => {
        console.log("Response122:", response.data);
        return response;
    },
    (error) => {
        console.log("API Error:", error.response?.data || error.message);
        return Promise.reject(error.response?.data || error.message);
    } 
);
export const getAccessToken = async () => {
    try {
        const token = await AsyncStorage.getItem('accessToken');
        if (token !== null) {
            console.log('Token retrieved successfully', token);
            return token;
        }
        console.log('No token found');
        return null;
    } catch (error) {
        console.error('Error retrieving token', error);
        return null;
    }
};


const getAuthHeaders = async (requireToken) => {
    if (!requireToken) return {};
    const token = await getAccessToken();
    console.log("Token: from getAuthHeaders", token)
    if (!token || token.trim() === "") {
        throw new Error("Authorization token is required but not provided.");
    }
    return { Authorization: `Bearer ${token}` };
};

// API Repository
const apiRepository = {
    /**
     * GET request
     * @param {string} endpoint - The API endpoint
     * @param {object} params - Query parameters
     * @param {boolean} requireToken - Whether an auth token is required
     */
    async get(endpoint, params = {}, requireToken = true) {
        return apiClient.get(endpoint, {
            params,
            headers:  await getAuthHeaders(requireToken),
        });
    },

    /**
     * POST request
     * @param {string} endpoint - The API endpoint
     * @param {object} data - Request payload
     * @param {boolean} requireToken - Whether an auth token is required
     */
    async post(endpoint, data = {}, requireToken = true) {
        return apiClient.post(endpoint, data, {
            headers: await getAuthHeaders(requireToken),
        });
    },

    /**
     * PUT request
     * @param {string} endpoint - The API endpoint
     * @param {object} data - Request payload
     * @param {boolean} requireToken - Whether an auth token is required
     */
    async put(endpoint, data = {}, requireToken = true) {
        return apiClient.put(endpoint, data, {
            headers:await getAuthHeaders(requireToken),
        });
    },

    /**
     * DELETE request
     * @param {string} endpoint - The API endpoint
     * @param {object} params - Query parameters
     * @param {boolean} requireToken - Whether an auth token is required
     */
    async delete(endpoint, params = {}, requireToken = true) {
        return apiClient.delete(endpoint, {
            params,
            headers: await getAuthHeaders(requireToken),
        });
    },

    /**
     * Custom request
     * @param {object} config - Axios request config
     * @param {boolean} requireToken - Whether an auth token is required
     */
    customRequest({ method, endpoint, data = {}, headers = {}, requireToken = true }) {
        return apiClient({
            method,
            url: endpoint,
            data: ["POST", "PUT", "PATCH"].includes(method.toUpperCase()) ? data : {},
            params: ["GET", "DELETE"].includes(method.toUpperCase()) ? data : {},
            headers: { ...headers, ...getAuthHeaders(requireToken) },
        });
    },
};

export default apiRepository;
