import SidebarCos from "../components/SidebarCos";
import { useEffect, useRef, useState } from "react";
import api from "@/api/axiosApi";
import AutoLogout from "@/hooks/AutoLogout";
import ContentLayout from "@/components/common/ContentLayout";
import { Client } from "@stomp/stompjs";

const Home = () => {
  const [userId, setUserId] = useState<number | null>(null);
  const [menu, setMenu] = useState<string>("");
  const [connectedClient, setConnectedClient] = useState<Client | null>(null);

  const changeMenu = (value: string) => {
    setMenu(value);
  };

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

  useEffect(() => {
    if (userId == null) return;

    const client = new Client({
      brokerURL: "ws://localhost:8080/ws",
      onConnect: () => {
        console.log("connected!");
        setConnectedClient(client);
      },
      onWebSocketError: () => {
        console.log("WebSocket error");
      },
      onStompError: () => {
        console.log("Stomp error");
      },
      onDisconnect: () => {
        console.log("Disconnected");
      },
    });
    client.activate();

    return () => {
      client.deactivate();
    };
  }, [userId]);

  return (
    <div className="flex flex-row h-full py-2 mb-2 bg-stone-950">
      <div className="h-full">
        <SidebarCos menu={changeMenu} />
      </div>
      {userId != null && connectedClient ? (
        <div className="w-full h-full bg-white rounded-3xl ">
          <ContentLayout idUser={userId} client={connectedClient} />
        </div>
      ) : (
        <div className="p-4 text-white ">Loading...</div>
      )}
    </div>
  );
};

export default Home;
