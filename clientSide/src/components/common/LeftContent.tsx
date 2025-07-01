import { profile, userChat } from "../../types";
import ChatContent from "../Chat/ChatContent";
import ContactContent from "../Contact/ContactContent";

interface LeftContentProps {
  onChangeConvertation: any;
  pinnedMessage?: userChat[];
  unPinnedMessage?: userChat[];
  onSeenMessage: any;
  menu: string;
  profileUser: profile;
}

const LeftContent: React.FC<LeftContentProps> = ({
  unPinnedMessage,
  pinnedMessage,
  onChangeConvertation,
  onSeenMessage,
  profileUser,
  menu,
}) => {
  return (
    <>
      <div className="relative flex flex-col h-full">
        {menu.toLowerCase() === "chat" ? (
          <ChatContent
            unPinnedMessage={unPinnedMessage}
            pinnedMessage={pinnedMessage}
            onSeenMessage={onSeenMessage}
            onChangeConvertation={onChangeConvertation}
          />
        ) : (
          <ContactContent profileUser={profileUser} />
        )}
      </div>
    </>
  );
};

export default LeftContent;
