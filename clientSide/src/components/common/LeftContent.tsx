import { useEffect, useState } from "react";
import { LastMessage } from "../../types";
import UserChat from "../Chat/UserChat";
import profile from "@/assets/muhammadAli.jpg";
import { ScrollArea } from "../ui/scroll-area";
import avatarUser from "@/assets/user.png";
import avatarGroup from "@/assets/group (1).png";
import AddFriends from "../Friends/AddFriends";

interface ProfileImage {
  image: string;
  userId: number;
}

interface LeftContentProps {
  onChangeConvertation: any;
  pinnedMessage?: userChat[];
  unPinnedMessage?: userChat[];
  onSeenMessage: any;
}

interface sendUser {
  convertationId: number;
  receiverId: number;
}

interface userChat {
  id: number;
  handphoneNumber: number;
  name: string;
  email: string;
  lastMessage: LastMessage;
  userFriends: boolean;
  profileImage: ProfileImage | null;
  pinned: boolean;
  isGroup: boolean;
  createdOn: string;
  conversationId: number;
  userGroupId: number;
  memberGroup: number;
  unSeenMessage: number;
}

const LeftContent: React.FC<LeftContentProps> = ({
  unPinnedMessage,
  pinnedMessage,
  onChangeConvertation,
  onSeenMessage,
}) => {
  const [selected, setSelected] = useState<string>("");
  const [keyword, setKeyword] = useState<string>("");
  const now = new Date();
  const nowToday = now.getDate();
  const nowDay = now.getDay();
  const nowMonth = now.getMonth() + 1;
  const nowYear = now.getFullYear();

  const days = ["minggu", "senin", "selasa", "rabu", "kamis", "jumat", "sabtu"];

  function getTime(today: number, month: number, year: number, date: string) {
    if (today == nowToday && month == nowMonth && nowYear == year) {
      return date;
    }

    if (
      today != nowToday &&
      month == nowMonth &&
      nowYear == year &&
      nowToday - today == 1
    ) {
      return "yesterday";
    }

    if (
      today != nowToday &&
      month == nowMonth &&
      nowYear == year &&
      nowToday - today < 7 &&
      nowToday - today > 1
    ) {
      let count = nowDay;
      for (let i = 0; i < nowToday - today; i++) {
        if (count > 0) {
          count--;
          continue;
        }
        count == 6;
      }
      return days[count];
    }

    return today + "/" + month + "/" + year;
  }

  const changeConvertation = (
    id: number,
    type: string,
    name: string,
    member: number,
    sendUser: sendUser,
    unSeenMessage: number,
    isGroup: boolean,
    profile: string
  ) => {
    onChangeConvertation(id, type, name, member, sendUser, isGroup, profile);
    onSeenMessage(unSeenMessage);
  };

  const chatMessage: userChat[] = [
    ...(pinnedMessage || []),
    ...(unPinnedMessage || []),
  ];

  useEffect(() => {
    console.log(chatMessage);
  }, [chatMessage]);

  // search by name
  const filteredMsg: userChat[] =
    keyword.trim() === ""
      ? chatMessage
      : chatMessage.filter((message: userChat) => {
          return message.name.toLowerCase().includes(keyword.toLowerCase());
        });

  return (
    // List All chat
    <div className="relative flex flex-col h-full">
      {/* Search  */}
      <div className="pr-2 mb-4">
        <form className="mx-auto ">
          <div className="relative">
            <div className="absolute inset-y-0 flex items-center pointer-events-none start-0 ps-3">
              <svg
                className="w-3 h-3 text-gray-500 dark:text-gray-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                />
              </svg>
            </div>
            <input
              type="search"
              id="default-search"
              onChange={(e) => setKeyword(e.target.value)}
              className="block w-full p-2 text-[12px] leading-5  text-gray-900 border border-gray-300 rounded-[10px] ps-10 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Search Mockups, Logos..."
              required
            />
          </div>
        </form>
      </div>

      <ScrollArea className="pr-2">
        <div className="flex flex-col gap-2">
          {filteredMsg != null ? (
            filteredMsg.map((item) => {
              const userProfile = item.profileImage?.image
                ? `data:image/jpg;base64,${item.profileImage.image}`
                : item.isGroup
                ? avatarGroup
                : avatarUser;
              let isGroup: string = "GROUP";

              const date = new Date(item.createdOn);

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

              let year = Number(localTime.substring(6, 10));
              let month = Number(localTime.substring(3, 5));
              let today = Number(localTime.substring(0, 2));
              let dates = localTime.substring(12, 17);

              const formattedTime = getTime(today, month, year, dates);

              if (!item.isGroup) {
                isGroup = "TEXT";
              }

              let key = item.isGroup ? item.id + isGroup + "" : item.id + "";

              let sendUser: sendUser = {
                convertationId: item.conversationId,
                receiverId: item.id,
              };

              let userImage =
                item.profileImage != null
                  ? `data:image/jpeg;base64,${item.profileImage.image}`
                  : item.isGroup
                  ? avatarGroup
                  : avatarUser;

              return (
                <div
                  key={item.isGroup ? item.id + isGroup : item.id}
                  onClick={() => {
                    changeConvertation(
                      item.conversationId,
                      isGroup,
                      item.name,
                      item.memberGroup,
                      sendUser,
                      item.unSeenMessage,
                      item.isGroup,
                      userImage
                    );
                    setSelected(
                      item.isGroup ? item.id + isGroup + "" : item.id + ""
                    );
                  }}
                  className={selected == key ? "bg-blue-50" : ""}
                >
                  <UserChat
                    name={item.name}
                    profileImage={userProfile}
                    lastMessage={item.lastMessage}
                    unSeenMessage={item.unSeenMessage}
                    pinned={item.pinned}
                    time={formattedTime}
                  />
                </div>
              );
            })
          ) : (
            <div>aneh</div>
          )}
        </div>
      </ScrollArea>

      <AddFriends />
    </div>
  );
};

export default LeftContent;
