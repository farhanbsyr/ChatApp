import axios from "axios";
// Setup axios instance
const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
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
