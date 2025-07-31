import { FaWalkieTalkie } from "react-icons/fa6";
import { IoChatboxEllipsesOutline } from "react-icons/io5";
import { BiSolidArchiveIn } from "react-icons/bi";
import { MdContacts } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import { IoSettingsOutline } from "react-icons/io5";
import { SlLogout } from "react-icons/sl";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import { useNavigate } from "react-router-dom";
import api from "@/api/axiosApi";

interface SidebarCosProps {
  menu: any;
  contactNotif: string;
}

const listIcon = [
  {
    name: "Chat",
    icon: IoChatboxEllipsesOutline,
  },
  {
    name: "Archive",
    icon: BiSolidArchiveIn,
  },
  {
    name: "Contact",
    icon: MdContacts,
  },
  {
    name: "Profile",
    icon: CgProfile,
  },
  {
    name: "Settings",
    icon: IoSettingsOutline,
  },
];

const SidebarCos: React.FC<SidebarCosProps> = ({ menu, contactNotif }) => {
  const navigate = useNavigate();

  const onChangeMenu = (value: string) => {
    menu(value);
  };

  const logout = async () => {
    try {
      const response = await api.post("auth/logout", null);

      if (response.data.message === "logout sukses") {
        navigate("/login");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex px-2 flex-col h-full justify-between items-center mb-[10px]  bg-stone-950">
      <div className="p-4 text-white ">
        <FaWalkieTalkie size={25} />
      </div>
      <div className="flex flex-col gap-2 menu-grup">
        {listIcon.map((item, index) => {
          const Icon = item.icon;
          return (
            <div
              onClick={() => onChangeMenu(item.name)}
              key={index}
              className=" group relative flex flex-col text-[#9E9C9D]  text-[10px] p-2 leading-4 justify-center items-center  hover:bg-white hover:bg-opacity-35 hover:rounded-xl h-[61px] w-[61px]"
            >
              {item.name == contactNotif ? (
                <div className="absolute p-1 bg-red-600 rounded-full top-2 right-4"></div>
              ) : (
                ""
              )}
              <Icon
                size={25}
                className="text-[#9E9C9D] group-hover:text-white  mb-1"
              />
              <div className="group-hover:text-white">{item.name}</div>
            </div>
          );
        })}
      </div>

      <AlertDialog>
        <AlertDialogTrigger className="group flex flex-col text-[#9E9C9D]  text-[10px] p-2 leading-4 justify-center items-center  hover:bg-white hover:bg-opacity-35 hover:rounded-xl h-[61px] w-[61px]">
          <SlLogout
            size={22}
            className="text-[#9E9C9D] mb-1 group-hover:text-white"
          />
          <div className="group-hover:text-white">Logout</div>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action gonna be logout your accoun.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={logout}>Logout</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default SidebarCos;
