import { IoClose } from "react-icons/io5";
import Ali from "@/assets/muhammadAli.jpg";
const ContactProfile = () => {
  return (
    <div className="flex flex-col ">
      <div className="flex flex-row items-center gap-4 py-2 bg-white ">
        <div className="w-6 h-6">
          <IoClose className="w-full h-full" />
        </div>
        <h1 className="text-base leading-8">Info Contact</h1>
      </div>
      <div className="flex flex-col items-center justify-center gap-2 py-6 bg-white">
        {/* image profile */}
        <div className="h-[200px] w-[200px]">
          <img src={Ali} alt="" className="w-full h-full rounded-full" />
        </div>
        <div className="text-[24px] leading-7">Farhan</div>
        <div className="text-base leading-4 text-gray-500">
          +62 878 4230 2725
        </div>
      </div>
      {/* line */}
      <div className="w-full bg-gray-200 h-[12px] rounded-l-sm"></div>
      {/* perincian perincian */}
      <div className="py-2 bg-white">
        <h5 className="mb-2 text-[14px] text-gray-500">About</h5>
        <p className="leading-4 text-Base ">Busy</p>
      </div>
    </div>
  );
};

export default ContactProfile;
