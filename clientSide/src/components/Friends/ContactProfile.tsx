import { Button } from "../ui/button";
import React from "react";
import user from "@/assets/user.png";
import { Client } from "@stomp/stompjs";

interface ContactProfileProps {
  name: string;
  phoneNumber: string | number;
  status: string;
  profileImage?: string;
  friendId: number;
  client: Client;
  userId: number;
  isGroup: boolean;
}

const ContactProfile: React.FC<ContactProfileProps> = ({
  name,
  phoneNumber,
  status,
  profileImage,
  friendId,
  client,
  userId,
  isGroup,
}) => {
  let image;
  if (profileImage != null) {
    image = `data:image/jpeg;base64,${profileImage}`;
  } else {
    image = user;
  }

  const handleGetConvertation = (
    userId: number,
    friendId: number,
    isGroup: boolean
  ) => {
    if (!client) {
      console.log("Client is not yet active");
      return;
    }

    const payload = {
      userId: userId,
      friendId: friendId,
      isGroup: isGroup,
    };

    client.publish({
      destination: "/app/getConvertation",
      body: JSON.stringify(payload),
    });
  };

  return (
    <div className="flex flex-col gap-4 ">
      <div className="flex flex-col items-center justify-center gap-2 py-2 mt-2 bg-white">
        {/* image profile */}
        <div className="h-[120px] w-[120px]">
          <img
            src={image}
            alt={`Avatar ${name}`}
            className="w-full h-full rounded-full"
          />
        </div>
        <div className="flex flex-col items-center justify-center gap-1">
          <div className="text-[24px] leading-7">{name}</div>
          <div className="text-xs leading-4 text-gray-500">
            {isGroup ? "Member: " + phoneNumber : phoneNumber}
          </div>
        </div>
      </div>
      {/* line */}
      <div className="w-full bg-gray-200 h-[5px] rounded-l-sm"></div>
      {/* perincian perincian */}
      <div className="mb-2 text-center bg-white ">
        <p className="text-base text-gray-500 ">
          {isGroup ? "Description" : "Status"}
        </p>
        <p className="text-sm leading-4 ">{status}</p>
      </div>
      <div
        className="w-full"
        onClick={() => handleGetConvertation(userId, friendId, isGroup)}
      >
        <Button className="w-full transition duration-300 ease-in-out bg-black rounded-md hover:bg-gray-800 hover:scale-105 hover:shadow-lg active:scale-95 ">
          Chat{" "}
        </Button>
      </div>
    </div>
  );
};

export default ContactProfile;
