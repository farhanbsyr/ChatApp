import React from "react";

interface FriendsProps {
  name: string;
  image: string;
}

const Friends: React.FC<FriendsProps> = ({ name, image }) => {
  return (
    <div className="flex flex-row items-center justify-start gap-2 p-2 bg-opacity-75 rounded-md hover:bg-blue-50">
      <div className="h-[55px]">
        <img
          src={image}
          alt=""
          width={50}
          height={50}
          className="w-[55px] h-full rounded-full"
        />
      </div>
      <div className="flex flex-col ">
        <div className=" text-[14px] mb-1 leading-4 font-semibold">{name}</div>
        <div className=" text-[11px] text-gray-500  leading-4 font-normal ">
          bUsY
        </div>
      </div>
    </div>
  );
};

export default Friends;
