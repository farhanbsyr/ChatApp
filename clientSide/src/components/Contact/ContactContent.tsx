import React, { useState } from "react";
import Search from "../Search/Search";
import ProfileCard from "./ProfileCard";
import { profile } from "@/types";
import { RiArrowDropDownLine, RiArrowDropUpLine } from "react-icons/ri";

interface ContactContentProps {
  profileUser: profile;
}

const ContactContent: React.FC<ContactContentProps> = ({ profileUser }) => {
  const [search, setSearch] = useState<string>("");
  const [friendRequestDropdown, setFriendRequestDropdown] =
    useState<boolean>(false);
  const [friendDropdown, setFriendDropdown] = useState<boolean>(true);
  const [groupDropdown, setGroupDropdown] = useState<boolean>(false);

  return (
    <>
      <Search changeKeyword={setSearch} />
      <div className="flex flex-col w-full">
        <ProfileCard
          name={profileUser.name}
          status="Available"
          profileImage={profileUser.profileImage}
        />
      </div>

      {/* Friend Request */}
      <div className="">
        <div className="flex flex-row items-center justify-between">
          <p className="p-0 m-0 text-xs text-gray-400">Friend Request</p>
          <div
            onClick={() => setFriendRequestDropdown(!friendRequestDropdown)}
            className="cursor-pointer "
          >
            {friendRequestDropdown ? (
              <RiArrowDropUpLine size={20} />
            ) : (
              <RiArrowDropDownLine size={20} />
            )}
          </div>
        </div>
        {/* buat list friend request */}
        <div
          className={`
                overflow-hidden
                transition-all duration-300 ease-in-out
                transform
                ${
                  friendRequestDropdown
                    ? "max-h-[999px] opacity-100 translate-y-0"
                    : "max-h-0 opacity-0 -translate-y-2"
                }
            `}
        >
          <ProfileCard
            isFriendRequest={true}
            name={profileUser.name}
            status="Available"
            profileImage={profileUser.profileImage}
          />
        </div>
      </div>

      {/* Group */}
      <div className="">
        <div className="flex flex-row items-center justify-between">
          <p className="p-0 m-0 text-xs text-gray-400">Group</p>
          <div
            onClick={() => setGroupDropdown(!groupDropdown)}
            className="cursor-pointer "
          >
            {groupDropdown ? (
              <RiArrowDropUpLine size={20} />
            ) : (
              <RiArrowDropDownLine size={20} />
            )}
          </div>
        </div>
        {/* buat list group  */}
        <div
          className={`
                overflow-hidden
                transition-all duration-300 ease-in-out
                transform
                ${
                  groupDropdown
                    ? "max-h-[999px] opacity-100 translate-y-0"
                    : "max-h-0 opacity-0 -translate-y-2"
                }
            `}
        >
          <ProfileCard
            name={profileUser.name}
            status="Available"
            profileImage={profileUser.profileImage}
          />
        </div>
      </div>

      {/* Friend */}
      <div className="">
        <div className="flex flex-row items-center justify-between">
          <p className="p-0 m-0 text-xs text-gray-400">Friends</p>
          <div
            onClick={() => setFriendDropdown(!friendDropdown)}
            className="cursor-pointer "
          >
            {friendDropdown ? (
              <RiArrowDropUpLine size={20} />
            ) : (
              <RiArrowDropDownLine size={20} />
            )}
          </div>
        </div>
        {/* buat list friend  */}
        <div
          className={`
                overflow-hidden
                transition-all duration-300 ease-in-out
                transform
                ${
                  friendDropdown
                    ? "max-h-[999px] opacity-100 translate-y-0"
                    : "max-h-0 opacity-0 -translate-y-2"
                }
            `}
        >
          <ProfileCard
            name={profileUser.name}
            status="Available"
            profileImage={profileUser.profileImage}
          />
        </div>
      </div>
    </>
  );
};

export default ContactContent;
