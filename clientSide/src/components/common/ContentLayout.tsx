import React, { useEffect, useRef, useState } from "react";
import LeftContent from "./LeftContent";
import RightContent from "./RightContent";
import { userProfile, userChat, userMessage, group } from "../../types";
import { Client } from "@stomp/stompjs";
import api from "@/api/axiosApi";

interface sendUser {
  convertationId: number;
  receiverId: number;
}

interface notification {
  convertationId: number;
  senderId: number;
  receiverId: number;
  message: string;
  isSeen: boolean;
  isUnsend: boolean;
}

interface ContentLayoutProps {
  client: Client;
  menu: string;
  profileUser: userProfile;
  contactNotif: any;
  friendRequest: userProfile[];
  friend: userProfile[];
  group: group[];
  setMenu: any;
}

const ContentLayout: React.FC<ContentLayoutProps> = ({
  client,
  friendRequest,
  friend,
  group,
  contactNotif,
  menu,
  profileUser,
  setMenu,
}) => {
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

  const unPinnedMessageRef = useRef<userChat[]>();
  const pinnedMessageRef = useRef<userChat[]>();
  const messagesRef = useRef<userMessage[]>();
  const convertationIdRef = useRef<number>();

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
    // setMessages([]);
    setSendUser(sendUser);
    setIsGroup(isGroup);
    if (isGroup) {
      setProfile(profile);
    }
  };

  const sortingMessage = (incomingMessage: userMessage) => {
    const currentUnPinned = unPinnedMessageRef.current;
    console.log(currentUnPinned);

    if (!currentUnPinned) return;

    console.log("Incoming Message:", incomingMessage);
    console.log("Current Unpinned:", currentUnPinned);
    let isSaved = false;
    const upadateMessage = currentUnPinned.map((chat) => {
      if (
        chat.conversationId === incomingMessage.convertationId &&
        chat.isGroup === incomingMessage.isGroup
      ) {
        console.log("masuk sini ngga?");
        isSaved = true;
        let amountUnseenMessage = chat.unSeenMessage;
        if (convertationIdRef.current == incomingMessage.convertationId) {
          amountUnseenMessage = 0;
        } else if (
          incomingMessage.senderId != profileUser.id &&
          !incomingMessage.isSeen
        ) {
          amountUnseenMessage++;
        }
        return {
          ...chat,
          unSeenMessage: amountUnseenMessage,
          createdOn: incomingMessage.createdOn,
          lastMessage: {
            sender: incomingMessage.id,
            receiver: incomingMessage.receiverId,
            createAt: incomingMessage.createdOn,
            isImage: incomingMessage.isImage,
            isSeen: incomingMessage.isSeen,
            message: incomingMessage.message,
          },
        } as userChat;
      }
      return chat;
    });

    // buat userChat masukkan incoming message 1 per 1 lalu update ke updateMessage

    const sorted = [...upadateMessage].sort((a, b) => {
      return new Date(b.createdOn).getTime() - new Date(a.createdOn).getTime();
    });

    setUnPinnedMessage(sorted);
  };

  const addConversation = (conversation: userChat) => {
    let typeConvertation: string = "TEXT";
    let profile: string = "";
    if (conversation.isGroup) {
      typeConvertation = "GROUP";
    }

    if (!conversation.pinned) {
      if (!unPinnedMessageRef.current) return;

      const newUnPinnedMessage: userChat[] = [
        ...unPinnedMessageRef.current,
        conversation,
      ];

      setUnPinnedMessage(sortedMsg(newUnPinnedMessage));
    }

    if (conversation.profileImage != null) {
      profile = conversation.profileImage.image;
    }

    getConvertation(
      conversation.conversationId,
      typeConvertation,
      conversation.name,
      conversation.isGroup,
      conversation.memberGroup,
      profile
    );
  };

  const getConvertation = (
    convertationId: number,
    typeConvertation: string,
    name: string,
    isGroup: boolean,
    member: number,
    profile: string
  ) => {
    setConvertationId(convertationId);
    setMenu("chat");
    setTypeConvertation(typeConvertation);
    setName(name);
    setIsGroup(isGroup);
    setMember(member);
    setProfile(profile);
  };

  const sortedMsg = (unSortedMsg: userChat[]) => {
    const sorted = [...unSortedMsg].sort((a, b) => {
      return new Date(b.createdOn).getTime() - new Date(a.createdOn).getTime();
    });
    return sorted;
  };

  const seenMessageText = (conversationIdSocket: number, isPinned: boolean) => {
    if (!isPinned) {
      const currentUnPinned = unPinnedMessageRef.current;
      if (!currentUnPinned) return;

      console.log(conversationIdSocket);
      console.log(convertationIdRef);

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

    console.log(currentMessages);

    setMessages((prevMessages) => {
      return prevMessages.map((message) => {
        if (!message.isSeen) {
          return {
            ...message,
            isSeen: true,
          };
        }
        return message;
      });
    });
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
    console.log(unPinnedMessage);
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

  useEffect(() => {
    if (convertationId) {
      convertationIdRef.current = convertationId;
    }
  }, [convertationId]);

  useEffect(() => {
    console.log(convertationId + " ini adalah convernya");
  }, [convertationId]);

  useEffect(() => {
    const subscriptionUser = client.subscribe(
      `/topic/${profileUser.id}`,
      (response: any) => {
        const parsedResponse: any = JSON.parse(response.body);

        console.log(parsedResponse);

        if (parsedResponse.type === "MESSAGE") {
          const messageResponse: userMessage = parsedResponse.message;
          console.log(messageResponse);
          sortingMessage(messageResponse);
          console.log(convertationIdRef);
          console.log(convertationId);

          if (messageResponse.convertationId != convertationIdRef.current) {
            return;
          }

          // if (profileUser.id == messageResponse.receiverId) {
          //   messageResponse.isSeen = true;
          // }

          setMessages((prev) => [...prev, messageResponse]);

          if (
            !messageResponse.isGroup &&
            messageResponse.receiverId == profileUser.id &&
            convertationIdRef.current != null
          ) {
            handleSeenMessage(1, convertationIdRef.current, "TEXT");
          }
        }

        if (parsedResponse.type === "SEENMESSAGE") {
          console.log(parsedResponse);
          console.log("udah masuk seenmessage");

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

        if (parsedResponse.type === "GETCONVERSATION") {
          const messageResponse: userChat = parsedResponse.conversation;
          let profile: string = "";

          if (messageResponse.profileImage != null) {
            profile = messageResponse.profileImage.image;
          }
          if (parsedResponse.isSaved) {
            let typeConvertation = "TEXT";
            if (messageResponse.isGroup) {
              typeConvertation = "GROUP";
            }
            // jika ada fitur delete, maka perlu di check chatconvertationnya sudah didelete atau blm
            getConvertation(
              messageResponse.conversationId,
              typeConvertation,
              messageResponse.name,
              messageResponse.isGroup,
              messageResponse.memberGroup,
              profile
            );
            return;
          }
          addConversation(messageResponse);
        }
      }
    );

    const subscriptionCommon = client.subscribe(
      `/topic/common`,
      (response: any) => {
        const parsedResponse: notification = JSON.parse(response.body);
        console.log("Received:", parsedResponse);
      }
    );

    return () => {
      subscriptionUser.unsubscribe();
      subscriptionCommon.unsubscribe();
    };
  }, [client, profileUser]);

  const fetchAllFriendsData = async (idUser: number) => {
    try {
      const response = await api.get(
        `http://localhost:8080/api/chat/${idUser}`,
        {
          withCredentials: true,
        }
      );
      const data = response.data.data;

      console.log(data);

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
    if (profileUser.id != null) {
      fetchAllFriendsData(profileUser.id);
    }
    console.log(convertationId);
  }, [profile]);

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
      const message: userMessage[] = data.map((message: userMessage) => ({
        createdOn: message.createdOn,
        senderId: message.senderId,
        receiverId: message.receiverId,
        id: message.id,
        isDelete: message.isDelete,
        isSeen: message.isSeen,
        seen: message.seen,
        isUnsent: message.isUnsent,
        message: message.message,
        isGroup: message.isGroup,
        name: message.name ? message.name : "unknown",
        image: message.image,
        isImage: message.isImage,
      }));
      console.log("kesini terus nih");

      setMessages(message);
    } catch (error: any) {
      console.log(error);
    }
  };

  const sendImage = async (file: File, notification: object) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append(
        "notification",
        new Blob([JSON.stringify(notification)], {
          type: "application/json",
        })
      );

      await api.post("/chat/sendImage", formData, {
        withCredentials: true,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleSendMessage = (
    message: string,
    isSeen: boolean,
    isUnsend: boolean,
    isImage: boolean,
    file?: File
  ) => {
    if (!client) {
      console.log("Client is not yet active");
      return;
    }

    const payload = {
      convertationId: convertationId,
      senderId: profileUser.id,
      receiverId: sendUser?.receiverId,
      message: message,
      isSeen: isSeen,
      isUnsend: isUnsend,
      messageTYPE: typeConvertation,
      isImage: isImage,
    };

    if (!isImage) {
      client.publish({
        destination: "/app/sendMessage",
        body: JSON.stringify(payload),
      });
    }

    if (isImage && file) {
      sendImage(file, payload);
    }
  };

  const handleSeenMessage = (
    unSeenMessage: number,
    convertationId: number,
    messageType: string
  ) => {
    // const client = clientRef.current;
    if (!client) {
      console.log("Client is not yet active");
      return;
    }

    if (unSeenMessage == 0) {
      return;
    }

    console.log(unSeenMessage);
    console.log(convertationId + " ini covertation");

    const payload = {
      conversationId: convertationId,
      userId: profileUser.id,
      messageTYPE: messageType,
    };

    client.publish({
      destination: "/app/enterMessage",
      body: JSON.stringify(payload),
    });
  };

  return (
    <div className="flex flex-row h-full gap-4 rounded-3xl">
      <div className="w-[30%] pl-5 pt-5 h-full">
        <LeftContent
          friendRequest={friendRequest}
          friend={friend}
          group={group}
          profileUser={profileUser}
          pinnedMessage={pinnedMessage}
          unPinnedMessage={unPinnedMessage}
          onChangeConvertation={changeConvertation}
          // onSeenMessage={handleSeenMessage}
          menu={menu}
          contactNotif={contactNotif}
          client={client}
        />
      </div>
      {/* Isi chat friend or group */}
      <div className="h-full w-[70%] py-4">
        {/* from flowbite */}
        <RightContent
          profile={profile}
          sendMessage={handleSendMessage}
          messages={messages}
          userId={profileUser.id}
          name={name}
          member={member}
          isGroup={isGroup}
        />
      </div>
    </div>
  );
};

export default ContentLayout;
