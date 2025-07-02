import React, { useEffect, useState } from "react";
import Search from "../Search/Search";
import ProfileCard from "./ProfileCard";
import { profile } from "@/types";
import { RiArrowDropDownLine, RiArrowDropUpLine } from "react-icons/ri";
import api from "@/api/axiosApi";
import { ScrollArea } from "../ui/scroll-area";

interface ContactContentProps {
  profileUser: profile;
}

interface userProfile {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
  profileImage: string;
}

interface group {
  id: number;
  name: string;
  description: string;
  profileImage: string;
  member: number;
}

const ContactContent: React.FC<ContactContentProps> = ({ profileUser }) => {
  const [search, setSearch] = useState<string>("");
  const [friendRequest, setFriendRequest] = useState<userProfile[]>([]);
  const [friend, setFriend] = useState<userProfile[]>([]);
  const [group, setGroup] = useState<group[]>([]);
  const [friendRequestDropdown, setFriendRequestDropdown] =
    useState<boolean>(false);
  const [friendDropdown, setFriendDropdown] = useState<boolean>(true);
  const [groupDropdown, setGroupDropdown] = useState<boolean>(false);

  useEffect(() => {
    if (search.trim() != "") {
      setFriendDropdown(true);
      setGroupDropdown(true);
    }
  }, [search]);

  const getFriendRequest = async () => {
    try {
      const response = await api.get("/friend/getFriendRequest", {
        withCredentials: true,
      });

      setFriendRequest(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getFriend = async () => {
    try {
      const response = await api.get("/friend/getFriend", {
        withCredentials: true,
      });

      setFriend(response.data.data);
      console.log(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getUserGroup = async () => {
    try {
      const response = await api.get("/group/userGroup", {
        withCredentials: true,
      });

      setGroup(response.data.data);
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getFriendRequest();
    getFriend();
    getUserGroup();
  }, []);

  const filteredGroup: group[] =
    search.trim() === ""
      ? group
      : group?.filter((userGroup: group) => {
          return userGroup.name.toLowerCase().includes(search.toLowerCase());
        });

  const filteredFriend: profile[] =
    search.trim() === ""
      ? friend
      : friend?.filter((userFriend: profile) => {
          return userFriend.name.toLowerCase().includes(search.toLowerCase());
        });

  // const filteredMsg: userChat[] =
  //   keyword.trim() === ""
  //     ? chatMessage
  //     : chatMessage.filter((message: userChat) => {
  //         return message.name.toLowerCase().includes(keyword.toLowerCase());
  //       });

  return (
    <>
      <Search changeKeyword={setSearch} />

      <ScrollArea className="pr-2">
        <div className="flex flex-col w-full">
          <ProfileCard
            name={profileUser.name}
            status="Available"
            profileImage={profileUser.profileImage}
          />
        </div>

        <div className="flex flex-col gap-[2px]">
          {/* Friend Request */}
          <div className="">
            <div
              className="flex flex-row items-center justify-between cursor-pointer"
              onClick={() => setFriendRequestDropdown(!friendRequestDropdown)}
            >
              <p className="p-0 m-0 text-xs text-gray-400">Friend Request</p>
              <div className="cursor-pointer ">
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
              {friendRequest?.map((friendRequest) => {
                return (
                  <ProfileCard
                    isFriendRequest={true}
                    name={friendRequest.name}
                    status="Available"
                    profileImage={friendRequest.profileImage}
                    key={friendRequest.id}
                  />
                );
              })}
            </div>
          </div>

          {/* Group */}
          <div className="">
            <div
              className="flex flex-row items-center justify-between cursor-pointer"
              onClick={() => setGroupDropdown(!groupDropdown)}
            >
              <p className="p-0 m-0 text-xs text-gray-400">Group</p>
              <div className="cursor-pointer ">
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
              {filteredGroup?.map((usergroup) => {
                return (
                  <ProfileCard
                    key={usergroup.id}
                    name={usergroup.name}
                    status={`Member: ${usergroup.member}`}
                    profileImage={usergroup.profileImage}
                  />
                );
              })}
            </div>
          </div>

          {/* Friend */}
          <div className="">
            <div
              className="flex flex-row items-center justify-between cursor-pointer"
              onClick={() => setFriendDropdown(!friendDropdown)}
            >
              <p className="p-0 m-0 text-xs text-gray-400">Friends</p>
              <div className="cursor-pointer ">
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
              {filteredFriend?.map((userFriend) => (
                <ProfileCard
                  key={userFriend.id}
                  name={userFriend.name}
                  status="Available"
                  profileImage={userFriend.profileImage}
                />
              ))}
            </div>
          </div>
        </div>
      </ScrollArea>
    </>
  );
};

export default ContactContent;
