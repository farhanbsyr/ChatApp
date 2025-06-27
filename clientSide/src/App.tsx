import "./App.css";

import { Routes, Route, useNavigate } from "react-router-dom";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import { useEffect } from "react";
import { setupInterceptors } from "./hooks/useAxiosInterceptor";
import { Toaster } from "./components/ui/sonner";

function App() {
  const navigate = useNavigate();

  useEffect(() => {
    setupInterceptors(navigate);
  }, []);
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Auth />} />
      </Routes>
      <Toaster richColors position="top-center" />
    </>
  );
}

export default App;
