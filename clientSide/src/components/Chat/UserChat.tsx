import React from "react";
import { VscPinned } from "react-icons/vsc";
import { LastMessage } from "../../types";
import { Image } from "lucide-react";

interface UserChatProps {
  name: string;
  profileImage: string;
  lastMessage?: LastMessage | null;
  pinned: boolean;
  unSeenMessage: number;
  time: string;
}

const UserChat: React.FC<UserChatProps> = ({
  name,
  profileImage,
  lastMessage,
  pinned,
  unSeenMessage,
  time,
}) => {
  return (
    <div className="flex flex-row items-center justify-between p-2 bg-opacity-75 rounded-md">
      {/* image profile user/group */}
      <div className="flex flex-row gap-3 ">
        <div className="">
          <img
            src={profileImage}
            alt=""
            width={50}
            height={50}
            className="w-[55px] h-[55px] rounded-full"
          />
        </div>

        {/* name and chat */}
        <div>
          {/* name */}
          <div className="mb-1 text-base font-semibold">{name}</div>

          {/* text timbul */}
          <div className="text-sm text-gray-400">
            {lastMessage?.isImage ? (
              <Image size={16} className="text-black" />
            ) : lastMessage != null ? (
              lastMessage.message.length > 50 ? (
                lastMessage.message.substring(0, 30) + "..."
              ) : (
                lastMessage.message
              )
            ) : (
              ""
            )}
          </div>
        </div>
      </div>

      {/* pinned, passed time, bubble chat */}
      <div className="text-right ">
        {/* upper notif */}
        <div className="mb-1 text-[10px] leading-5 text-gray-400 ">{time}</div>
        {/* bottom notif */}
        <div className="flex flex-row justify-end gap-1">
          {/* notif belum dibaca */}
          {unSeenMessage > 0 ? (
            <div className="w-5 h-5 text-[12px] bg-red-500 rounded-full flex justify-center items-center font-semibold">
              {unSeenMessage}
            </div>
          ) : (
            ""
          )}
          <div>{pinned ? <VscPinned size={20} /> : <></>}</div>
        </div>
      </div>
    </div>
  );
};

export default UserChat;
