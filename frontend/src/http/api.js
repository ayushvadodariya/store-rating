import useTokenStore from "@/store/tokenStore";
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use((config) => {
  const token = useTokenStore.getState().token;
  if (token) {
    if (!config.headers) {
      config.headers = {};
    }
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const userDetail = async () =>
  api.get('/api/auth/me');

export const login = async (data) =>
  api.post('/api/auth/login', data);

export const register = async (data) =>
  api.post('/api/auth/register', data);

export const changePassword= async (data) =>
  api.post('/api/auth/password', data);