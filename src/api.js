import axios from "axios";

const API = axios.create({
  baseURL: "https://fyp-backend-production.up.railway.app/api/chat",
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;
