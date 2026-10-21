import axios from "axios";

export const TOKEN_KEY = "rentify_token";

// One shared client. Every request goes to the Express server on port 5000
const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

// Before each request, attach the saved token if there is one
api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
