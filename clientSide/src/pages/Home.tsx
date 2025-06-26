import SidebarCos from "../components/SidebarCos";
import Content from "../components/Content";
import { useEffect, useState } from "react";
import api from "@/api/axiosApi";
import AutoLogout from "@/hooks/AutoLogout";

const Home = () => {
  const [userId, setUserId] = useState<number | null>(null);

  AutoLogout();

  const getProfileUser = async () => {
    try {
      const response = await api.get("user/userId", {
        withCredentials: true,
      });

      console.log(response);
      setUserId(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getProfileUser();
  }, []);

  return (
    <div className="flex flex-row h-full py-2 mb-2 bg-stone-950">
      <div className="h-full">
        <SidebarCos />
      </div>
      {userId == null ? (
        <div className="p-4 text-white">Loading...</div>
      ) : (
        <div className="w-full h-full bg-white rounded-3xl ">
          <Content userId={userId} />
        </div>
      )}
    </div>
  );
};

export default Home;
