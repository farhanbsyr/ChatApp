import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/api/axiosApi";

const AutoLogout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkToken = async () => {
      try {
        await api.get("auth/check", { withCredentials: true });
      } catch (err) {
        console.log("Token expired or invalid");
        navigate("/login");
      }
    };

    checkToken();
    const interval = setInterval(checkToken, 30000); // cek tiap 30 detik

    return () => clearInterval(interval);
  }, []);

  return null;
};

export default AutoLogout;
