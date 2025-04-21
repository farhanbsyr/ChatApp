import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TbChecks } from "react-icons/tb";

interface ChatProps {
  name?: string;
  time: string;
  message: string;
  isSeen?: boolean;
  showedGrup: boolean;
  profile: any;
}

const Chat: React.FC<ChatProps> = ({
  name,
  time,
  message,
  isSeen,
  showedGrup,
  profile,
}) => {
  let isE: string = "";

  if (isSeen) {
    isE = "seen";
  } else {
    isE = "not seen";
  }

  return (
    <div className="flex flex-col items-end justify-end h-full py-4 max-w-[75%]">
      <div className="flex flex-row items-start gap-2.5">
        {showedGrup ? (
          <Avatar className="h-7 w-7">
            <AvatarImage width={28} src="https://github.com/shadcn.png" />
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
              <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
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
