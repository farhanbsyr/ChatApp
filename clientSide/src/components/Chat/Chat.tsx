import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TbChecks } from "react-icons/tb";

interface ChatProps {
  name?: string;
  time: string;
  message: string;
  isSeen?: boolean;
  showedGrup: boolean;
  profile: any;
  member: number | null;
  seen?: object[];
}

const Chat: React.FC<ChatProps> = ({
  name,
  time,
  message,
  isSeen,
  showedGrup,
  profile,
  member,
  seen,
}) => {
  let checkedColor: string = "gray";
  let image: any;

  if (!showedGrup && isSeen) {
    checkedColor = "blue";
  }

  if (showedGrup) {
    if (seen?.length === member) {
      checkedColor = "blue";
    }
  }

  if (profile != null) {
    image = `data:image/jpeg;base64,${profile.image}`;
  }

  if (profile == null) {
    image = "https://github.com/shadcn.png";
  }

  return (
    <div className="flex flex-col items-end justify-end h-full py-4 max-w-[75%]">
      <div className="flex flex-row items-start gap-2.5">
        {showedGrup ? (
          <Avatar className="h-7 w-7">
            <AvatarImage width={28} src={image} />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        ) : (
          <></>
        )}

        <div className="flex flex-col w-full leading-1.5 p-2.5 border-gray-200 bg-gray-100 rounded-e-xl rounded-es-xl dark:bg-gray-700">
          {showedGrup ? (
            <div className="flex space-x-2 rtl:space-x-reverse">
              <span className="text-sm font-semibold text-gray-900 dark:text-white">
                {name}
              </span>
            </div>
          ) : (
            <></>
          )}
          <div className="flex flex-row items-end justify-between gap-2">
            <p className="text-sm font-normal text-gray-900 dark:text-white">
              {message}
            </p>
            <div className="flex items-center gap-1">
              <span className="text-sm font-normal text-gray-500">{time}</span>
              <span
                className={`text-sm font-normal text-${checkedColor}-500 dark:text-${checkedColor}-400`}
              >
                <TbChecks />
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
