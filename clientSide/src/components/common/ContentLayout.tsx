import { useCallback, useEffect, useState } from "react";
import LeftContent from "./LeftContent";
import RightContent from "./RightContent";
import axios from "axios";
import { LastMessage } from "../../types";
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";

interface ProfileImage {
  image: string;
  userId: number;
}

interface userChat {
  id: number;
  handphoneNumber: number;
  name: string;
  email: string;
  lastMessage: LastMessage | null;
  userFriends: boolean;
  profileImage: ProfileImage | null;
  pinned: boolean;
  isGroup: boolean;
  createdOn: string;
  userConvertationId: number;
  userGroup: number;
  memberGroup: number;
}

const ContentLayout = () => {
  const [chat, setChat] = useState<userChat[] | null>(null);
  const [stompClient, setStompClient] = useState<any>(null);
  const [convertationId, setConvertationId] = useState<number | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [typeConvertation, setTypeConvertation] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);
  const [member, setMember] = useState<number | null>(null);
  let value: number = 1;

  const changeConvertation = (
    convertation: number,
    type: string,
    name: string,
    member: number
  ) => {
    setConvertationId(convertation);
    setTypeConvertation(type);
    setName(name);
    setMember(member);
  };

  useEffect(() => {
    console.log(convertationId, typeConvertation, "Test");
  }, [convertationId, typeConvertation]);

  useEffect(() => {
    const socket = new SockJS("http://localhost:8080/ws");
    const client = Stomp.over(socket);

    client.connect({}, () => {
      const userId: string = value + "";

      client.subscribe(`/user/${userId}/chat`, (message) => {
        const newMessage = JSON.parse(message.body);
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      });
    });

    setStompClient(client);

    return () => {
      if (stompClient) {
        stompClient.disconnect();
      }
    };
  }, []);

  const fetchAllFriendsData = async (value: number) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/chat/${value}`
      );
      const data = response.data.data;
      console.log(data);

      const mappedData: userChat[] = data.map((item: any) => ({
        id: item.id,
        name: item.name,
        email: item.email,
        handphoneNumber: item.handphoneNumber,
        profileImage: item.profileImage,
        lastMessage: item.lastMessage,
        userFriends: item.userFriends,
        pinned: item.pinned,
        isGroup: item.isGroup,
        createdOn: item.createdTime,
        userConvertationId: item.userConvertationId,
        userGroup: item.userGroupId,
        memberGroup: item.memberGroup,
      }));
      console.log(mappedData);

      setChat(mappedData);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchAllFriendsData(value);
  }, []);

  const sendMessage = (
    userId: number,
    notification: any,
    messageType: string
  ) => {
    const payload = {
      userId: userId,
      message: notification,
      messageType: messageType,
    };

    fetch(`http://localhost:8080/sendMessage/${userId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((response) => {
        if (response.ok) {
          console.log("Pesan berhasil dikirim!");
        } else {
          console.error("Terjadi kesalahan saat mengirim pesan.");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };
  return (
    <div className="flex flex-row h-full gap-4 rounded-3xl">
      <div className="w-[30%] pl-5 pt-5 h-full">
        <LeftContent
          userChat={chat}
          userId={value}
          onChangeConvertation={changeConvertation}
        />
      </div>
      {/* Isi chat friend or group */}
      <div className="h-full w-[70%] py-4">
        {/* from flowbite */}
        <RightContent
          sendMessage={sendMessage}
          userId={value}
          convertation={convertationId}
          typeMessage={typeConvertation}
          name={name}
          member={member}
        />
      </div>
    </div>
  );
};

export default ContentLayout;
