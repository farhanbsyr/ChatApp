import { IoIosSend } from "react-icons/io";
import { Input } from "@/components/ui/input";
import { Button } from "../ui/button";

const InputMsg = () => {
  return (
    <>
      {/* input message */}
      <div className="w-full">
        <div className="flex flex-row items-center justify-between w-full text-sm text-gray-900 border border-gray-300 rounded-lg focus:border-black bg-gray-50 focus:ring-blue-500 ps-5 pe-5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
          <div className="inset-y-0 flex items-center pointer-events-none start-0">
            <svg
              className="w-4 h-4 text-gray-500 dark:text-gray-400"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 16"
            >
              <path d="m10.036 8.278 9.258-7.79A1.979 1.979 0 0 0 18 0H2A1.987 1.987 0 0 0 .641.541l9.395 7.737Z" />
              <path d="M11.241 9.817c-.36.275-.801.425-1.255.427-.428 0-.845-.138-1.187-.395L0 2.6V14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2.5l-8.759 7.317Z" />
            </svg>
          </div>
          <input
            type="text"
            id="input-group-1"
            className="w-full border-transparent focus:outline-none focus:border-transparent focus:ring-0"
            placeholder="Your message"
          />
          <div>
            <IoIosSend size={18} className="text-gray-500" />
          </div>
        </div>
      </div>
    </>
  );
};

export default InputMsg;
