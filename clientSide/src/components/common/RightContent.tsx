import { useEffect, useState } from "react";
import Chat from "../Chat/Chat";
import InputMsg from "../Chat/InputMsg";
import ProfileBox from "../Chat/ProfileBox";
import { ScrollArea } from "../ui/scroll-area";
import { Plus } from "lucide-react";
import InputImg from "../Chat/InputImg";
import { userMessage } from "@/types";
import EmojiPicker from "emoji-picker-react";
import { VscSmiley } from "react-icons/vsc";
import { IoIosSend } from "react-icons/io";

interface RightContentProps {
  userId: number;
  sendMessage: any;
  name: string | null;
  member: number | null;
  messages: userMessage[];
  isGroup: boolean;
  profile: string;
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
  const [isSentImage, setIsSentImage] = useState<boolean>(false);
  const [showEmoji, setShowEmoji] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");

  const sendMsg = async (
    isSeen: boolean,
    isUnsend: boolean,
    message: string,
    isImage: boolean
  ) => {
    if (message.trim() === "") return;
    sendMessage(message, isSeen, isUnsend, isImage);
    setMessage("");
    setShowEmoji(false);
  };

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
                isImage={value.isImage}
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
      <form
        action=""
        onSubmit={(e) => {
          e.preventDefault();
          sendMsg(false, false, message, false);
        }}
      >
        <div
          className={`flex flex-row items-center justify-between w-full text-sm text-gray-900 border border-gray-300 rounded-lg focus:border-black bg-gray-50 focus:ring-blue-500 ${
            isSentImage ? "" : "ps-5 pe-5"
          } dark:bg-gray-700 relative dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
        >
          {showEmoji ? (
            <div className="absolute left-0 right-0 z-50 w-full m-0 mb-2 bottom-full">
              <EmojiPicker
                width="100%"
                height={250}
                onEmojiClick={(emojiData) => {
                  setMessage((prev) => prev + emojiData.emoji);
                }}
              />
            </div>
          ) : (
            <></>
          )}

          {isSentImage ? (
            ""
          ) : (
            <>
              <button
                type="button"
                onClick={() => {
                  setIsSentImage(true);
                  setShowEmoji(false);
                }}
                className="p-1 transition duration-500 ease-in-out bg-gray-400 rounded-sm hover:bg-gray-800 hover:scale-105 hover:shadow-lg active:scale-95"
              >
                <Plus className="w-3 h-3 text-white" />
              </button>
              <button
                type="button"
                onClick={() => setShowEmoji(!showEmoji)}
                className="ml-2"
              >
                <VscSmiley
                  size={24}
                  className="text-gray-400 transition duration-500 ease-in-out hover:text-gray-800 hover:scale-105 hover:shadow-lg active:scale-95"
                />
              </button>
            </>
          )}
          {isSentImage ? (
            <InputImg
              sendMessage={sendMessage}
              onSendImage={(file) => {
                // panggil API-mu untuk upload image
                console.log("Selected file:", file);
              }}
              onCancel={() => setIsSentImage(false)}
            />
          ) : (
            <>
              <InputMsg message={message} setMessage={setMessage} />
              <button type="submit">
                <IoIosSend
                  size={18}
                  className="text-gray-500 transition duration-500 ease-in-out rounded-sm cursor-pointer hover:text-gray-800 hover:scale-105 hover:shadow-lg active:scale-95"
                />
              </button>
            </>
          )}
        </div>
      </form>
    </div>
  );
};

export default RightContent;
