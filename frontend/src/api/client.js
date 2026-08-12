import axios from "axios";

function defaultApiUrl() {
  const { protocol, hostname } = window.location;
  return `${protocol}//${hostname}:5000`;
}

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || defaultApiUrl()
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem("secure-records-token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
