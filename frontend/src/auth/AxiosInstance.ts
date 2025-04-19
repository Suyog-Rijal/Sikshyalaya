import axios from 'axios';
import type { AxiosInstance } from 'axios';

const AxiosInstance: AxiosInstance = axios.create({
    baseURL: 'http://localhost:8000',
});


AxiosInstance.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem('accessToken');
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => Promise.reject(error),
);

export default AxiosInstance;