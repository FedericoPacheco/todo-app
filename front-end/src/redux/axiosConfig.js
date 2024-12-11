import axios from 'axios';
import { getCsrfToken } from './app/api';

// Enable sending cookies with requests automatically
// Sails back end sends the cookie in the "Set-Cookie" header
axios.defaults.withCredentials = true; 

// https://axios-http.com/docs/interceptors
// Request interceptor to add CSRF token to headers for state-changing requests
axios.interceptors.request.use(
    async (config) => {
        const methodsRequiringCsrf = ['post', 'put', 'delete', 'patch'];
        if (methodsRequiringCsrf.includes(config.method)) {
            const csrfToken = await getCsrfToken();
            config.headers['X-CSRF-Token'] = csrfToken;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error)
    }
);
