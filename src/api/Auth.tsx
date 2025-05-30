import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 20000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("auth_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authApiService = {
  async postData(endpoint: string, data: FormData) {
    const response = await api.post(endpoint, data);
    return response.data;
  },

  async getData(endpoint: string, params?: Record<string, FormData>) {
    const response = await api.get(endpoint, { params });
    return response.data;
  },

  async putData(endpoint: string, data: FormData) {
    const response = await api.put(endpoint, data);
    return response.data;
  },

  async deleteData(endpoint: string) {
    const response = await api.delete(endpoint);
    return response.data;
  },
};
