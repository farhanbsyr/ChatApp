import React from "react";
import Chat from "./Chat";

const AllChat = () => {
  return (
    <div className="flex flex-row h-full gap-4 rounded-3xl">
      {/* List All Chat */}
      <div className="w-[30%]"></div>
      {/* Isi chat friend or group */}
      <div className="h-full w-[70%]">
        {/* from flowbite */}
        <Chat />
      </div>
    </div>
  );
};

export default AllChat;
