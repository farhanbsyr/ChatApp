import { sendUser, userChat } from "@/types";
import React, { useEffect, useState } from "react";
import UserChat from "./UserChat";
import { ScrollArea } from "../ui/scroll-area";
import AddFriends from "../Friends/AddFriends";
import avatarUser from "@/assets/user.png";
import avatarGroup from "@/assets/group (1).png";
import Search from "../Search/Search";

interface ChatContentProps {
  onChangeConvertation: any;
  pinnedMessage?: userChat[];
  unPinnedMessage?: userChat[];
  onSeenMessage: any;
}

const ChatContent: React.FC<ChatContentProps> = ({
  onChangeConvertation,
  pinnedMessage,
  unPinnedMessage,
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
    <>
      <Search changeKeyword={setKeyword} />

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
    </>
  );
};

export default ChatContent;
