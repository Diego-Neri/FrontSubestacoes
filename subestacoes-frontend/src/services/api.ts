// src/services/api.ts
import axios, { type AxiosInstance } from 'axios';

const api: AxiosInstance = axios.create({
  baseURL: 'http://localhost:8080/api',  // URL da sua API Spring Boot
});

export default api;
