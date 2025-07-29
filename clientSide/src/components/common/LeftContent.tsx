import { Client } from "@stomp/stompjs";
import { userProfile, userChat, group } from "../../types";
import ChatContent from "../Chat/ChatContent";
import ContactContent from "../Contact/ContactContent";

interface LeftContentProps {
  client: Client;
  onChangeConvertation: any;
  pinnedMessage?: userChat[];
  unPinnedMessage?: userChat[];
  // onSeenMessage: any;
  menu: string;
  profileUser: userProfile;
  contactNotif: any;
  friendRequest: userProfile[];
  friend: userProfile[];
  group: group[];
}

const LeftContent: React.FC<LeftContentProps> = ({
  unPinnedMessage,
  contactNotif,
  pinnedMessage,
  onChangeConvertation,
  profileUser,
  friend,
  friendRequest,
  group,
  menu,
  client,
}) => {
  return (
    <>
      <div className="relative flex flex-col h-full">
        {menu.toLowerCase() === "chat" ? (
          <ChatContent
            userId={profileUser.id}
            client={client}
            unPinnedMessage={unPinnedMessage}
            pinnedMessage={pinnedMessage}
            // onSeenMessage={onSeenMessage}
            onChangeConvertation={onChangeConvertation}
          />
        ) : (
          <ContactContent
            client={client}
            friendRequest={friendRequest}
            friend={friend}
            group={group}
            profileUser={profileUser}
            contactNotif={contactNotif}
          />
        )}
      </div>
    </>
  );
};

export default LeftContent;
