import React, { useEffect, useState } from "react";
import Chat from "../Chat/Chat";
import InputMsg from "../Chat/InputMsg";
import ProfileBox from "../Chat/ProfileBox";
import axios from "axios";
import { ScrollArea } from "../ui/scroll-area";

interface RightContentProps {
  userId: number;
  sendMessage: any;
  convertation: number | null;
  typeMessage: string | null;
  name: string | null;
  member: number | null;
}

interface userMessage {
  id: number;
  receiverId?: number;
  senderId: number;
  isDelete: boolean;
  isUnsent: boolean;
  isSeen: boolean;
  message: string;
  name?: string;
  isGroup: boolean;
  createOn: string;
  image: any;
}

const RightContent: React.FC<RightContentProps> = ({
  userId,
  sendMessage,
  convertation,
  typeMessage,
  name,
  member,
}) => {
  const [messages, setMessages] = useState<userMessage[]>([]);
  // const [convertationId, setConvertationId] = useState<number | null>();
  // const [message, setMessage] = useState<userMessage>();
  // const [time, setTime] = useState<string>("");

  useEffect(() => {
    if (convertation != null) {
      fetchMessageChat(typeMessage);
    }
  }, [convertation, typeMessage]);

  const fetchMessageChat = async (messageTYPE: string | null) => {
    console.log("kocak");
    if (convertation === null) return;

    console.log("convertation:", convertation);

    try {
      const response = await axios.get(
        `http://localhost:8080/api/chat/getMessage/${convertation}?message=${messageTYPE}`
      );
      const data = response.data.data;
      console.log("fetch data:", data);

      const newMessages: userMessage[] = data.map((value: any) => ({
        createOn: value.createdOn,
        senderId: value.senderId,
        receiverId: value.receiverId,
        id: value.id,
        isDelete: value.isDelete,
        isSeen: value.isSeen,
        isUnsent: value.isUnsent,
        message: value.message,
        isGroup: value.isGroup,
        name: value.name ? value.name : "unknown",
        image: "Test",
      }));

      setMessages(newMessages);
    } catch (error) {
      console.log(error);
    }
  };

  userId = 1;

  return (
    <div className="flex flex-col w-full h-full pr-4">
      <ProfileBox name={name} member={member} />
      <ScrollArea className="flex flex-col h-full gap-2">
        {messages.map((value) => {
          let positionMsg = "justify-start";
          let showedGrup: boolean = false;

          const date = new Date(value.createOn);

          const localTime = date.toLocaleString("en-GB", {
            timeZone: "Asia/Jakarta",
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false,
          });

          const formattedTime = localTime.substring(12, 17);

          if (value.senderId == userId) {
            positionMsg = "justify-end";
          }

          if (value.isGroup && userId != value.senderId) {
            showedGrup = true;
          }

          return (
            <div
              key={`${value.id} + ${value.isGroup ? "group" : "text"}`}
              className={`flex ${positionMsg} `}
            >
              <Chat
                name={value.name}
                time={formattedTime}
                message={value.message}
                isSeen={value.isSeen}
                showedGrup={showedGrup}
                profile={value.image}
              />
            </div>
          );
        })}
      </ScrollArea>
      {/* <Chat /> */}
      <InputMsg />
      {/* <ContactProfile /> */}
    </div>
  );
};

export default RightContent;
