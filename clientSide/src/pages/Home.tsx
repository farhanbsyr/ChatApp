import SidebarCos from "../components/SidebarCos";
import { useEffect, useRef, useState } from "react";
import api from "@/api/axiosApi";
import AutoLogout from "@/hooks/AutoLogout";
import ContentLayout from "@/components/common/ContentLayout";
import { Client } from "@stomp/stompjs";
import { group, userProfile } from "@/types";

const Home = () => {
  const [userId, setUserId] = useState<number | null>(null);
  const [menu, setMenu] = useState<string>("chat");
  const [connectedClient, setConnectedClient] = useState<Client | null>(null);
  const [profile, setProfile] = useState<userProfile>();
  const [contactNotif, setContactNotif] = useState<boolean>(false);
  const [friendRequest, setFriendRequest] = useState<userProfile[]>([]);
  const [friend, setFriend] = useState<userProfile[]>([]);
  const [group, setGroup] = useState<group[]>([]);
  const changeMenu = (value: string) => {
    setMenu(value);
  };
  const friendRef = useRef<userProfile[]>();
  const friendRequesRef = useRef<userProfile[]>();

  useEffect(() => {
    if (friend) {
      friendRef.current = friend;
    }
  }, [friend]);

  useEffect(() => {
    if (friendRequest) {
      friendRequesRef.current = friendRequest;
    }
  }, [friendRequest]);

  AutoLogout();

  const getProfileUser = async () => {
    try {
      const response = await api.get("user/userId", {
        withCredentials: true,
      });
      const profileUser: userProfile = response.data.data;

      setUserId(profileUser.id);
      setProfile(profileUser);
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

        client.subscribe(`/topic/${profile?.id}`, (response: any) => {
          const parsedResponse: any = JSON.parse(response.body);

          if (parsedResponse.type === "ADDEDFRIEND") {
            const userProfile: userProfile = parsedResponse.userProfile;

            if (parsedResponse.addedBy == profile?.id) {
              if (friendRequesRef.current) {
                const newFriendRequest = friendRequesRef.current.filter(
                  (fr) => fr.id !== userProfile.id
                );

                setFriendRequest(newFriendRequest);
              }

              if (friendRef.current) {
                const newFriend: userProfile[] = [
                  ...friendRef.current,
                  userProfile,
                ];

                setFriend(newFriend);
                return;
              }

              setFriend([userProfile]);
              return;
            }

            if (parsedResponse.isSaved == true) {
              return;
            }

            const coba: userProfile[] = [...friendRequest, userProfile];

            setFriendRequest(coba);
          }
        });
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

  const getFriendRequest = async () => {
    try {
      const response = await api.get("/friend/getFriendRequest", {
        withCredentials: true,
      });

      if (response.data.data.length > 0) {
        // setFriendRequestDropdown(true);
        setContactNotif(true);
      }

      setFriendRequest(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getFriend = async () => {
    try {
      const response = await api.get("/friend/getFriend", {
        withCredentials: true,
      });

      setFriend(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getUserGroup = async () => {
    try {
      const response = await api.get("/group/userGroup", {
        withCredentials: true,
      });

      setGroup(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getFriendRequest();
    getFriend();
    getUserGroup();
  }, []);

  return (
    <div className="flex flex-row h-full py-2 mb-2 bg-stone-950">
      <div className="h-full">
        <SidebarCos
          menu={changeMenu}
          contactNotif={contactNotif ? "Contact" : ""}
        />
      </div>
      {profile != null && connectedClient ? (
        <div className="w-full h-full bg-white rounded-3xl ">
          <ContentLayout
            friendRequest={friendRequest}
            friend={friend}
            group={group}
            contactNotif={setContactNotif}
            profileUser={profile}
            client={connectedClient}
            menu={menu}
            setMenu={setMenu}
          />
        </div>
      ) : (
        <div className="p-4 text-white ">Loading...</div>
      )}
    </div>
  );
};

export default Home;
