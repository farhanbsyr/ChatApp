import axios from "axios";
import { useNavigate } from "react-router-dom";

// Setup axios instance
const api = axios.create({
  baseURL: "http://localhost:8080/api",
  withCredentials: true, // jika pakai cookie
});

export const setupInterceptors = (navigate: any) => {
  api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (
        (error.response && error.response.status === 401) ||
        (error.response && error.response.status === 403)
      ) {
        // Token habis atau tidak valid
        localStorage.removeItem("accessToken"); // Jika pakai localStorage
        navigate("/login");
      }
      return Promise.reject(error);
    }
  );
};

export default api;
