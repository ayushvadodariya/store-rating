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

export const changePassword = async (data) =>
  api.post('/api/auth/password', data);

export const getAdminUsers = async ({ name = "", email = "", address = "", sort = "createdAt", order = "desc" } = {}) => {
  const params = new URLSearchParams();
  if (name) params.append("name", name);
  if (email) params.append("email", email);
  if (address) params.append("address", address);
  if (sort) params.append("sort", sort);
  if (order) params.append("order", order);

  const queryString = params.toString();
  return api.get(`/api/admin/users${queryString ? `?${queryString}` : ""}`);
};

export const createAdminUser = async (data) =>
  api.post('/api/admin/users', data);

export const getAdminUserDetails = async (id) =>
  api.get(`/api/admin/users/${id}`);

export const updateAdminUser = async (id, data) =>
  api.patch(`/api/admin/users/${id}`, data);

export const deleteAdminUser = async (id) =>
  api.delete(`/api/admin/users/${id}`);

export const getAdminStores = async ({ name = "", address = "", sort = "createdAt", order = "desc" } = {}) => {
  const params = new URLSearchParams();
  if (name) params.append("name", name);
  if (address) params.append("address", address);
  if (sort) params.append("sort", sort);
  if (order) params.append("order", order);

  const queryString = params.toString();

  return api.get(`/api/admin/stores${queryString ? `?${queryString}` : ""}`);
};

export const createAdminStore = async (data) =>
  api.post('/api/admin/stores', data);

export const updateAdminStore = async (id, data) =>
  api.patch(`/api/admin/stores/${id}`, data);

export const deleteAdminStore = async (id) =>
  api.delete(`/api/admin/stores/${id}`);

export const getAdminDashboard = async () =>
  api.get('/api/admin/dashboard');

export const getPublicStores = async ({
  page = 1,
  limit = 10,
  sort = "rating_highest",
  search = "",
  address = ""
} = {}) => {
  const params = new URLSearchParams();
  if (page) params.append("page", page.toString());
  if (limit) params.append("limit", limit.toString());
  if (sort) params.append("sort", sort);
  if (search) params.append("search", search);
  if (address) params.append("address", address);

  const queryString = params.toString();
  return api.get(`/api/public/stores${queryString ? `?${queryString}` : ""}`);
};

export const getPublicStoreDetails = async (storeId) =>
  api.get(`/api/public/stores/${storeId}`);

// Check user's rating for a specific store
export const getUserStoreRating = async (storeId) =>
  api.get(`/api/public/store-rating/${storeId}`);

export const createStoreRating = async (storeId, data) =>
  api.post(`/api/user/stores/${storeId}/ratings`, data);

export const getUserRating = async (ratingId) =>
  api.get(`/api/user/ratings/${ratingId}`);

export const updateUserRating = async (ratingId, data) =>
  api.patch(`/api/user/ratings/${ratingId}`, data);

export const deleteUserRating = async (ratingId) =>
  api.delete(`/api/user/ratings/${ratingId}`);

export const getOwnerDashboard = async () =>
  api.get(`/api/owner/dashboard`);

export const getOwnerRatings = async ({
  page = 1,
  limit = 10,
  sort = "date_newest",
  minRating = 0,
  maxRating = 5,
  search = ""
} = {}) => {
  const params = new URLSearchParams();
  if (page) params.append("page", page.toString());
  if (limit) params.append("limit", limit.toString());
  if (sort) params.append("sort", sort);
  if (minRating) params.append("minRating", minRating.toString());

  const queryString = params.toString();
  return api.get(`/api/owner/ratings${queryString ? `?${queryString}` : ""}`);
};