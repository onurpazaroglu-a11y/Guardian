import axios, { AxiosError } from 'axios';

const api = axios.create({
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor - add auth token
api.interceptors.request.use(async (config) => {
    // Get token from Supabase session if needed
    // const { data: { session } } = await supabase.auth.getSession();
    // if (session) {
    //   config.headers.Authorization = `Bearer ${session.access_token}`;
    // }
    return config;
});

// Response interceptor - handle errors
api.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
        if (error.response?.status === 401) {
            // Redirect to login
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;