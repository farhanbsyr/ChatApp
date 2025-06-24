import React, { useEffect, useRef, useState } from "react";
import LeftContent from "./LeftContent";
import RightContent from "./RightContent";
import { LastMessage } from "../../types";
import { Client } from "@stomp/stompjs";
import api from "@/api/axiosApi";

interface ProfileImage {
  image: string;
  userId: number;
}

interface sendUser {
  convertationId: number;
  receiverId: number;
}

interface userMessage {
  id: number;
  receiverId?: number;
  senderId: number;
  isDelete: boolean;
  isUnsent: boolean;
  isSeen?: boolean;
  seen?: object[];
  message: string;
  name?: string;
  isGroup: boolean;
  createdOn: string;
  image?: any;
}

interface notification {
  convertationId: number;
  senderId: number;
  receiverId: number;
  message: string;
  isSeen: boolean;
  isUnsend: boolean;
}

interface userChat {
  id: number;
  handphoneNumber: number;
  name: string;
  email: string;
  lastMessage: LastMessage;
  userFriends: boolean;
  profileImage: ProfileImage | null;
  pinned: boolean;
  isGroup: boolean;
  createdOn: string;
  conversationId: number;
  userGroupId: number;
  memberGroup: number;
  unSeenMessage: number;
}

interface ContentLayoutProps {
  idUser: number;
}

const ContentLayout: React.FC<ContentLayoutProps> = ({ idUser }) => {
  const [convertationId, setConvertationId] = useState<number | null>(null);
  const [pinnedMessage, setPinnedMessage] = useState<userChat[]>();
  const [unPinnedMessage, setUnPinnedMessage] = useState<userChat[]>();
  const [sendUser, setSendUser] = useState<sendUser | null>(null);
  const [messages, setMessages] = useState<userMessage[]>([]);
  const [typeConvertation, setTypeConvertation] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);
  const [member, setMember] = useState<number | null>(null);
  const [isGroup, setIsGroup] = useState<boolean>(false);
  const [profile, setProfile] = useState<string>("");

  const hasConnected = useRef(false);
  const clientRef = useRef<Client | null>(null);
  const unPinnedMessageRef = useRef<userChat[]>();
  const pinnedMessageRef = useRef<userChat[]>();
  const messagesRef = useRef<userMessage[]>();

  const changeConvertation = (
    convertation: number,
    type: string,
    name: string,
    member: number,
    sendUser: sendUser,
    isGroup: boolean,
    profile: string
  ) => {
    if (convertation == convertationId && typeConvertation == type) {
      return;
    }
    setConvertationId(convertation);
    setTypeConvertation(type);
    setName(name);
    setMember(member);
    setMessages([]);
    setSendUser(sendUser);
    setIsGroup(isGroup);
    if (isGroup) {
      setProfile(profile);
    }
  };

  const sortingMessage = (incomingMessage: userMessage) => {
    const currentUnPinned = unPinnedMessageRef.current;

    if (!currentUnPinned) return;

    const upadateMessage = currentUnPinned.map((chat) => {
      if (
        chat.id === incomingMessage.receiverId &&
        chat.isGroup === incomingMessage.isGroup
      ) {
        return {
          ...chat,
          createdOn: incomingMessage.createdOn,
          lastMessage: {
            ...chat.lastMessage,
            message: incomingMessage.message,
          },
        };
      }
      return chat;
    });

    const sorted = [...upadateMessage].sort((a, b) => {
      return new Date(b.createdOn).getTime() - new Date(a.createdOn).getTime();
    });

    setUnPinnedMessage(sorted);
  };

  const sortedMsg = (unSortedMsg: any) => {
    const sorted = [...unSortedMsg].sort((a, b) => {
      return new Date(b.createdOn).getTime() - new Date(a.createdOn).getTime();
    });
    return sorted;
  };

  const seenMessageText = (conversationIdSocket: number, isPinned: boolean) => {
    if (!isPinned) {
      const currentUnPinned = unPinnedMessageRef.current;
      if (!currentUnPinned) return;

      const newUnPinnedMessage = currentUnPinned?.map((message) => {
        if (message.conversationId === conversationIdSocket) {
          return {
            ...message,
            unSeenMessage: 0,
          };
        }
        return message;
      });
      setUnPinnedMessage(newUnPinnedMessage);
    }

    if (isPinned) {
      const currentPinned = pinnedMessageRef.current;
      if (!currentPinned) return;

      const newPinnedMessage = currentPinned.map((message) => {
        if (message.conversationId === conversationIdSocket) {
          return {
            ...message,
            unSeenMessage: 0,
          };
        }
        return message;
      });
      setPinnedMessage(newPinnedMessage);
    }

    const currentMessages = messagesRef.current;
    if (!currentMessages) return;

    const newMessages = currentMessages.map((message) => {
      if (!message.isSeen) {
        return {
          ...message,
          isSeen: true,
        };
      }
      return message;
    });

    setMessages(newMessages);
  };

  const seenMessageGroup = (
    groupId: number,
    isPinned: boolean,
    seeMessage: string,
    seenBy: object
  ) => {
    if (!isPinned) {
      const currentUnPinned = unPinnedMessageRef.current;
      if (!currentUnPinned) return;

      const newUnPinnedMessage = currentUnPinned.map((message) => {
        if (message.id === groupId) {
          return {
            ...message,
            unSeenMessage: 0,
          };
        }
        return message;
      });
      setUnPinnedMessage(newUnPinnedMessage);
    }

    if (pinnedMessage) {
      const currentPinned = pinnedMessageRef.current;
      if (!currentPinned) return;

      const newPinnedMessage = currentPinned.map((message) => {
        if (message.id === groupId) {
          return {
            ...message,
            unSeenMessage: 0,
          };
        }
        return message;
      });

      setPinnedMessage(newPinnedMessage);
    }

    const currentMessages = messagesRef.current;
    if (!currentMessages) return;

    const newMessages = currentMessages.map((message) => {
      if (new Date(message.createdOn) >= new Date(seeMessage)) {
        return {
          ...message,
          seen: message.seen ? [...message.seen, seenBy] : [seenBy],
        };
      }
      return message;
    });

    setMessages(newMessages);
  };

  useEffect(() => {
    if (unPinnedMessage) {
      unPinnedMessageRef.current = unPinnedMessage;
    }
  }, [unPinnedMessage]);

  useEffect(() => {
    if (pinnedMessage) {
      pinnedMessageRef.current = pinnedMessage;
    }
  }, [pinnedMessage]);

  useEffect(() => {
    if (messages) {
      messagesRef.current = messages;
    }
  }, [messages]);

  const initialiseConnections = () => {
    const client = new Client({
      brokerURL: "ws://localhost:8080/ws",
      onConnect: () => {
        console.log("Connected!");
        client.subscribe(`/topic/${idUser}`, (response: any) => {
          const parsedResponse: any = JSON.parse(response.body);

          // get or send message
          if (parsedResponse.type === "MESSAGE") {
            const messageResponse: userMessage = parsedResponse.message;
            setMessages((preventMessages) => [
              ...preventMessages,
              messageResponse,
            ]);

            sortingMessage(messageResponse);
          }

          // seen message
          if (parsedResponse.type === "SEENMESSAGE") {
            if (parsedResponse.isGroup === "TEXT") {
              seenMessageText(
                parsedResponse.conversationId,
                parsedResponse.isPinned
              );
            }

            if (parsedResponse.isGroup === "GROUP") {
              seenMessageGroup(
                parsedResponse.groupId,
                parsedResponse.isPinned,
                parsedResponse.seeMessage,
                parsedResponse.seenBy
              );
            }
          }
        });

        client.subscribe(`/topic/common`, (response: any) => {
          const parsedResponse: notification = JSON.parse(response.body);
          console.log("Received : ", parsedResponse);
        });
      },
      onWebSocketError: () => {
        console.log("Error with the websocket");
      },
      onStompError: () => {
        console.log("Stomp error");
      },
      onDisconnect: () => {
        console.log("Disconnected");
      },
    });
    client.activate();

    clientRef.current = client;
  };

  useEffect(() => {
    if (!hasConnected.current) {
      initialiseConnections();
      hasConnected.current = true;
    }
  }, []);

  const fetchAllFriendsData = async (idUser: number) => {
    try {
      const response = await api.get(
        `http://localhost:8080/api/chat/${idUser}`,
        {
          withCredentials: true,
        }
      );
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
    if (idUser != null) {
      fetchAllFriendsData(idUser);
    }
  }, [idUser]);

  useEffect(() => {
    if (convertationId != null) {
      fetchMessageChat(typeConvertation);
    }
  }, [convertationId, typeConvertation]);

  const fetchMessageChat = async (messageTYPE: string | null) => {
    if (convertationId === null) return;

    try {
      const response = await api.get(
        `http://localhost:8080/api/chat/getMessage/${convertationId}?message=${messageTYPE}`,
        {
          withCredentials: true,
        }
      );

      const data = response.data.data;
      const message: userMessage[] = data.map((idUser: userMessage) => ({
        createdOn: idUser.createdOn,
        senderId: idUser.senderId,
        receiverId: idUser.receiverId,
        id: idUser.id,
        isDelete: idUser.isDelete,
        isSeen: idUser.isSeen,
        seen: idUser.seen,
        isUnsent: idUser.isUnsent,
        message: idUser.message,
        isGroup: idUser.isGroup,
        name: idUser.name ? idUser.name : "unknown",
        image: idUser.image,
      }));

      setMessages(message);
    } catch (error: any) {
      console.log(error);
    }
  };

  const handleSeenMessage = (unSeenMessage: number) => {
    const client = clientRef.current;
    if (!client) {
      console.log("Client is not yet active");
      return;
    }

    if (unSeenMessage == 0) {
      return;
    }

    const payload = {
      conversationId: convertationId,
      userId: idUser,
      messageTYPE: typeConvertation,
    };

    client.publish({
      destination: "/app/enterMessage",
      body: JSON.stringify(payload),
    });
  };

  const handleSendMessage = (
    message: string,
    isSeen: boolean,
    isUnsend: boolean
  ) => {
    const client = clientRef.current;
    if (!client) {
      console.log("Client is not yet active");
      return;
    }

    const payload = {
      convertationId: convertationId,
      senderId: idUser,
      receiverId: sendUser?.receiverId,
      message: message,
      isSeen: isSeen,
      isUnsend: isUnsend,
      messageTYPE: typeConvertation,
    };

    client.publish({
      destination: "/app/sendMessage",
      body: JSON.stringify(payload),
    });
  };

  return (
    <div className="flex flex-row h-full gap-4 rounded-3xl">
      <div className="w-[30%] pl-5 pt-5 h-full">
        <LeftContent
          pinnedMessage={pinnedMessage}
          unPinnedMessage={unPinnedMessage}
          onChangeConvertation={changeConvertation}
          onSeenMessage={handleSeenMessage}
        />
      </div>
      {/* Isi chat friend or group */}
      <div className="h-full w-[70%] py-4">
        {/* from flowbite */}
        <RightContent
          profile={profile}
          sendMessage={handleSendMessage}
          messages={messages}
          userId={idUser}
          name={name}
          member={member}
          isGroup={isGroup}
        />
      </div>
    </div>
  );
};

export default ContentLayout;
