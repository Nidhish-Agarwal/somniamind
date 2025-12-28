// src/api/axios.js
import axios from "axios";

// const BASE_URL = import.meta.env.VITE_API_URL;
const BASE_URL = "/api";

export default axios.create({
  baseURL: BASE_URL,
});

export const axiosPrivate = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});
