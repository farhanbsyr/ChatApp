import axios from "axios";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`, // ganti sesuai backend kamu
  withCredentials: true, // agar cookie dikirim otomatis
});

export default api;
