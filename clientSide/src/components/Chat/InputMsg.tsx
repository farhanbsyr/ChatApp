import { IoIosSend } from "react-icons/io";
import { useState } from "react";

interface InputMsgProps {
  sendMessage: any;
}

const InputMsg: React.FC<InputMsgProps> = ({ sendMessage }) => {
  const [message, setMessage] = useState<string>("");

  const sendMsg = async (
    isSeen: boolean,
    isUnsend: boolean,
    message: string,
    isImage: boolean
  ) => {
    if (message.trim() === "") return;
    sendMessage(message, isSeen, isUnsend, isImage);
    setMessage("");
  };

  return (
    <>
      <input
        type="text"
        id="input-group-1"
        className="w-full border-transparent focus:outline-none focus:border-transparent focus:ring-0"
        placeholder="Your message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <div
        onClick={() => {
          sendMsg(false, false, message, false);
        }}
      >
        <IoIosSend
          size={18}
          className="text-gray-500 transition duration-500 ease-in-out rounded-sm cursor-pointer hover:text-gray-800 hover:scale-105 hover:shadow-lg active:scale-95"
        />
      </div>
    </>
  );
};

export default InputMsg;
