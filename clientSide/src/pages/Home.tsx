import SidebarCos from "../components/SidebarCos";
import { useEffect, useRef, useState } from "react";
import api from "@/api/axiosApi";
import AutoLogout from "@/hooks/AutoLogout";
import ContentLayout from "@/components/common/ContentLayout";
import { Client } from "@stomp/stompjs";
import { group, userChat, userProfile } from "@/types";

const Home = () => {
  const [userId, setUserId] = useState<number | null>(null);
  const [pinnedMessage, setPinnedMessage] = useState<userChat[]>();
  const [unPinnedMessage, setUnPinnedMessage] = useState<userChat[]>();
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
  const unPinnedMessageRef = useRef<userChat[]>();
  const pinnedMessageRef = useRef<userChat[]>();

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

  useEffect(() => {
    if (pinnedMessage) {
      pinnedMessageRef.current = pinnedMessage;
    }
  }, [pinnedMessage]);

  useEffect(() => {
    if (unPinnedMessage) {
      unPinnedMessageRef.current = unPinnedMessage;
    }
  }, [unPinnedMessage]);

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

  const changeSavedFriend = (friendId: number) => {
    if (unPinnedMessageRef.current == null) return;

    const changeFriendName = unPinnedMessageRef.current?.map((msg) => {
      if (msg.id == friendId && !msg.isGroup) {
        return {
          ...msg,
          userFriends: true,
        };
      }

      return msg;
    });

    setUnPinnedMessage(sortedMsg(changeFriendName));
  };

  useEffect(() => {
    if (userId == null) return;

    const client = new Client({
      brokerURL: import.meta.env.VITE_WS_URL,
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

              changeSavedFriend(userProfile.id);

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
      const response = await api.get("/friend/getFriendRequest");

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
      const response = await api.get("/friend/getFriend");

      setFriend(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getUserGroup = async () => {
    try {
      const response = await api.get("/group/userGroup");

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

  const sortedMsg = (unSortedMsg: userChat[]) => {
    const sorted = [...unSortedMsg].sort((a, b) => {
      return new Date(b.createdOn).getTime() - new Date(a.createdOn).getTime();
    });
    return sorted;
  };

  const fetchAllFriendsData = async (idUser: number) => {
    try {
      const response = await api.get(`chat/${idUser}`);
      const data = response.data.data;

      const unPinned: userChat[] = data.unPinned.map((item: userChat) => ({
        id: item.id,
        name: item.name,
        email: item.email,
        handphoneNumber: item.handphoneNumber,
        profileImage: item.profileImage,
        lastMessage: item.lastMessage,
        userFriends: item.userFriends,
        pinned: item.pinned,
        isGroup: item.isGroup,
        createdOn: item.createdOn,
        conversationId: item.conversationId,
        userGroup: item.userGroupId,
        memberGroup: item.memberGroup,
        unSeenMessage: item.unSeenMessage,
      }));
      setUnPinnedMessage(sortedMsg(unPinned));

      const pinned: userChat[] = data.pinned.map((item: userChat) => ({
        id: item.id,
        name: item.name,
        email: item.email,
        handphoneNumber: item.handphoneNumber,
        profileImage: item.profileImage,
        lastMessage: item.lastMessage,
        userFriends: item.userFriends,
        pinned: item.pinned,
        isGroup: item.isGroup,
        createdOn: item.createdOn,
        conversationId: item.conversationId,
        userGroup: item.userGroupId,
        memberGroup: item.memberGroup,
        unSeenMessage: item.unSeenMessage,
      }));
      setPinnedMessage(sortedMsg(pinned));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (profile != null) {
      fetchAllFriendsData(profile.id);
    }
  }, [profile]);

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
            pinnedMessage={pinnedMessage}
            unPinnedMessage={unPinnedMessage}
            setPinnedMessage={setPinnedMessage}
            setUnPinnedMessage={setUnPinnedMessage}
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
