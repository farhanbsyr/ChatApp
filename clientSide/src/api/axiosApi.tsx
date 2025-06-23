// src/api/axiosInstance.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api", // ganti sesuai backend kamu
  withCredentials: true, // agar cookie dikirim otomatis
});

export default api;
