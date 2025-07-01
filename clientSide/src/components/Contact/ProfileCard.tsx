import React from "react";
import user from "@/assets/user.png";
import { Plus } from "lucide-react";

interface ProfileCardProps {
  name: string;
  profileImage?: string;
  status: string;
  isFriendRequest?: boolean;
}

const ProfileCard: React.FC<ProfileCardProps> = ({
  name,
  profileImage,
  status,
  isFriendRequest,
}) => {
  let image;
  if (profileImage != null) {
    image = `data:image/jpeg;base64,${profileImage}`;
  } else {
    image = user;
  }
  return (
    <div className="flex flex-row items-center justify-between py-2 pr-2 bg-opacity-75 rounded-md">
      {/* image profile user/group */}
      <div className="flex flex-row gap-3 ">
        <div className="">
          <img
            src={image}
            alt="avatar"
            width={50}
            height={50}
            className="w-[45px] h-[45px] bg-gray-100 rounded-full object-cover"
          />
        </div>

        {/* name and status */}
        <div className="flex flex-col justify-center ">
          {/* name */}
          <div className="mb-[2px] text-sm font-semibold">{name}</div>

          {/* text timbul */}
          <div className="text-xs text-gray-400">{status}</div>
        </div>
      </div>

      {/* Icon Add friend */}
      {isFriendRequest ? (
        <button className="p-1 transition duration-500 ease-in-out bg-black rounded-full hover:bg-gray-800 hover:scale-105 hover:shadow-lg active:scale-95">
          <Plus className="w-4 h-4 text-white" />
        </button>
      ) : (
        ""
      )}
    </div>
  );
};

export default ProfileCard;
