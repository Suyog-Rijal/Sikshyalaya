import axios from 'axios';
import type { AxiosInstance } from 'axios';

const AxiosInstance: AxiosInstance = axios.create({
    baseURL: 'http://localhost:8000',
    headers: {
        'Content-Type': 'application/json',
    },
});

export default AxiosInstance;