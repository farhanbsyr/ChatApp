import { useEffect } from "react";
import Chat from "../Chat/Chat";
import InputMsg from "../Chat/InputMsg";
import ProfileBox from "../Chat/ProfileBox";
import { ScrollArea } from "../ui/scroll-area";

interface RightContentProps {
  userId: number;
  sendMessage: any;
  name: string | null;
  member: number | null;
  messages: userMessage[];
  isGroup: boolean;
  profile: string;
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

const RightContent: React.FC<RightContentProps> = ({
  userId,
  sendMessage,
  name,
  member,
  messages,
  isGroup,
  profile,
}) => {
  useEffect(() => {
    console.log(messages);
  }, [messages]);

  return (
    <div className="flex flex-col w-full h-full pr-4">
      {isGroup ? (
        <ProfileBox name={name} member={member} profile={profile} />
      ) : (
        <ProfileBox name={name} member={member} />
      )}

      <ScrollArea className="flex flex-col h-full gap-2">
        {messages.map((value) => {
          let positionMsg = "justify-start";

          const date = new Date(value.createdOn);

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
                showedGrup={value.isGroup}
                profile={value.image}
                member={member}
                seen={value.seen}
              />
            </div>
          );
        })}
      </ScrollArea>
      {/* <Chat /> */}
      <InputMsg sendMessage={sendMessage} />
      {/* <ContactProfile /> */}
    </div>
  );
};

export default RightContent;
