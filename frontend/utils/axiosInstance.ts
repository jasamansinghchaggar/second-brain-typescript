import axios from 'axios';

const BASE_URL = (import.meta as any).env.VITE_BASE_URL;

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

export default axiosInstance