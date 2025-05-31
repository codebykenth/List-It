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
  async postData(endpoint: string, data: object | FormData) {
    let config = {};

    if (data instanceof FormData) {
      config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };
    } else {
      config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
    }

    const response = await api.post(endpoint, data, config);
    return response.data;
  },

  async getData(endpoint: string, params?: object) {
    const response = await api.get(endpoint, { params });
    return response.data;
  },

  async putData(endpoint: string, data: object | FormData) {
    const headers =
      data instanceof FormData
        ? { "Content-Type": "multipart/form-data" }
        : { "Content-Type": "application/json" };

    const response = await api.put(endpoint, data, { headers });
    return response.data;
  },

  async deleteData(endpoint: string) {
    const response = await api.delete(endpoint);
    return response.data;
  },
};
