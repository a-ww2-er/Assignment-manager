// utils/axiosInterceptor.ts
import axios from "axios";
import { useUserStore } from "../store/userStore";
import { useAuthStore } from "../store/authStore";
import { API_URL } from "../variables";

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().clearTokens();
      useUserStore.getState().clearUser();
    }
    return Promise.reject(error);
  }
);

export default api;
