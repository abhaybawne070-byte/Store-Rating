import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8000/api"
});

// Har request ke saath JWT token automatically bhejna
api.interceptors.request.use(
    (config) => {

        const token = localStorage.getItem("token");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;