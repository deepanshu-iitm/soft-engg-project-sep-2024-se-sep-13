import axios from 'axios';

const API = axios.create({
    baseURL: 'https://soft-engg-project-sep-2024-se-sep-13-1.onrender.com', 
});

API.interceptors.request.use((req) => {
    const token = localStorage.getItem('token'); 
    if (token) {
        req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
});

export default API;
