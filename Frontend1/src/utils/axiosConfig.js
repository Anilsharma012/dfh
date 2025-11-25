// utils/axiosConfig.js
import axios from "axios";

// Configure axios baseURL when an explicit API base is provided (useful for deployed previews)
const explicitApi = (typeof window !== 'undefined' && window.__API_BASE_URL__) || process.env.REACT_APP_API_URL || '';
if (explicitApi && explicitApi.length > 0) {
  try {
    axios.defaults.baseURL = explicitApi.replace(/\/$/, '');
    console.info('Axios baseURL set to explicit API base:', axios.defaults.baseURL);
  } catch (e) {
    console.warn('Failed to set explicit axios baseURL', e);
  }
} else {
  console.log("Axios configured without baseURL to prevent double /api prefix");
}

axios.defaults.withCredentials = true;
axios.defaults.timeout = 20000;

// Add request interceptor for debugging
axios.interceptors.request.use(
  (config) => {
    // Respect explicit header if already provided by the caller
    const hasAuth = !!(config.headers && config.headers.Authorization);
    // Prefer admin token for admin routes; otherwise fallback
    const token = localStorage.getItem('adminToken') || localStorage.getItem('authToken') || localStorage.getItem('token');
    if (!hasAuth && token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    const prefix = (config.baseURL && config.baseURL.length) ? config.baseURL : ((typeof window !== 'undefined' && window.location) ? window.location.origin : '');
    console.log(`Making ${config.method?.toUpperCase()} request to: ${prefix}${config.url}`);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging and clearer 404 guidance
axios.interceptors.response.use(
  (response) => {
    console.log('Response received:', response.status, response.config.url);
    return response;
  },
  (error) => {
    const status = error.response?.status;
    const data = error.response?.data;
    console.error('Response error:', status, data || error.message);

    // If 404 on an /api/ route, give a clearer hint for misconfigured API_BASE or proxy
    try {
      const url = error.config?.url || '';
      if (status === 404 && typeof url === 'string' && url.startsWith('/api')) {
        console.error(`404 for API request ${url}. If you're running a hosted preview make sure the backend API is reachable from the frontend origin. Set window.__API_BASE_URL__ or REACT_APP_API_URL to the backend base URL.`);
      }
    } catch (e) {
      // ignore
    }

    if (status === 401) {
      // Clear all possible token keys on unauthorized
      localStorage.removeItem('authToken');
      localStorage.removeItem('token');
      localStorage.removeItem('adminToken');
      localStorage.removeItem('user');
    }
    return Promise.reject(error);
  }
);

export default axios;
