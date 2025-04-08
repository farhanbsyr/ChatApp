import React from "react";
import { FaWalkieTalkie } from "react-icons/fa6";
import { IoChatboxEllipsesOutline } from "react-icons/io5";
import { BiSolidArchiveIn } from "react-icons/bi";
import { MdContacts } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import { IoSettingsOutline } from "react-icons/io5";
import { SlLogout } from "react-icons/sl";

const listIcon = [
  {
    name: "Chat",
    icon: IoChatboxEllipsesOutline,
  },
  {
    name: "Archive",
    icon: BiSolidArchiveIn,
  },
  {
    name: "Contact",
    icon: MdContacts,
  },
  {
    name: "Profile",
    icon: CgProfile,
  },
  {
    name: "Settings",
    icon: IoSettingsOutline,
  },
];

const SidebarCos = () => {
  return (
    <div className="flex px-2 flex-col h-full justify-between items-center mb-[10px]  bg-stone-950">
      <div className="p-4 text-white ">
        <FaWalkieTalkie size={25} />
      </div>
      <div className="flex flex-col gap-2 menu-grup">
        {listIcon.map((item, index) => {
          const Icon = item.icon;
          return (
            <div
              key={index}
              className=" group flex flex-col text-[#9E9C9D]  text-[10px] p-2 leading-4 justify-center items-center  hover:bg-white hover:bg-opacity-35 hover:rounded-xl h-[61px] w-[61px]"
            >
              <Icon
                size={25}
                className="text-[#9E9C9D] group-hover:text-white  mb-1"
              />
              <div className="group-hover:text-white">{item.name}</div>
            </div>
          );
        })}
      </div>

      <div className="group flex flex-col text-[#9E9C9D]  text-[10px] p-2 leading-4 justify-center items-center  hover:bg-white hover:bg-opacity-35 hover:rounded-xl h-[61px] w-[61px]">
        <SlLogout
          size={22}
          className="text-[#9E9C9D] mb-1 group-hover:text-white"
        />
        <div className="group-hover:text-white">Logout</div>
      </div>
    </div>
  );
};

export default SidebarCos;
