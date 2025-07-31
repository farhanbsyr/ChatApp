import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import InputEmail from "../input/InputEmail";
import InputTel from "../input/InputTel";
import api from "@/api/axiosApi";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { toast } from "sonner";
import { typeFriend } from "@/types";

const AddFriends = () => {
  const [email, setEmail] = useState<string>("");
  const [nomor, setNomor] = useState<string>("");
  const [isEmail, setIsEmail] = useState<boolean>(true);
  const [isFriend, setIsFriend] = useState<boolean>(false);
  const [friend, setFriend] = useState<typeFriend>();
  const [clicked, setClicked] = useState<boolean>(false);
  const [search, setSearch] = useState<boolean>(true);
  const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(false);

  const [open, setOpen] = useState(false);

  const addFriends = async (identity: string) => {
    try {
      await api.post("friend/addFriend", { identity: identity });

      setOpen(false);
      toast.success("Friend added successfully!");
    } catch (error: any) {
      console.log(error);
      if (error.status == 404 || error.status == 400) {
        const response = error.response.data.message;
        toast.error("Notification", {
          description: response,
        });
      }
    }
  };

  const searchFriends = async (identity: string) => {
    try {
      const response: any = await api.post("friend/searchFriend", {
        identity: identity,
      });

      setFriend(response.data.data);
      setIsFriend(true);
      setSearch(false);
      setEmail("");
    } catch (error: any) {
      console.log(error);
      if (error.status == 404 || error.status == 400) {
        const response = error.response.data.message;
        toast.error("Notification", {
          description: response,
        });
      }
    }
  };

  const handleSubmit = (email: string) => {
    if (search) {
      searchFriends(email);
    } else {
      if (friend != null) {
        addFriends(friend?.identity);
      }
    }
  };

  useEffect(() => {
    if (search) {
      if (email.trim() === "") {
        setIsButtonDisabled(email.trim() === "");
      } else {
        setIsButtonDisabled(false);
      }
    } else {
      if (friend?.isFriend) {
        setIsButtonDisabled(true);
      } else {
        setIsButtonDisabled(!clicked);
      }
    }
  }, [search, friend, clicked, email]);

  return (
    <>
      <Dialog
        open={open}
        onOpenChange={(open) => {
          setOpen(open);
          if (open) {
            setIsFriend(false);
            setFriend(undefined);
            setEmail("");
            setNomor("");
            setClicked(false);
            setIsEmail(true);
            setSearch(true);
          }
        }}
      >
        <form>
          <div className="absolute bottom-4 right-4">
            <DialogTrigger asChild>
              <button className="p-3 transition duration-500 ease-in-out bg-black rounded-full hover:bg-gray-800 hover:scale-105 hover:shadow-lg active:scale-95">
                <Plus className="w-6 h-6 text-white" />
              </button>
            </DialogTrigger>
          </div>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add Your Friends</DialogTitle>
              <DialogDescription>
                Find your friends and start connecting. Chatting is more fun
                when you're with them!
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4">
              <div className="flex flex-row items-center justify-between">
                <p
                  onClick={() => setIsEmail(true)}
                  className={`w-full text-sm text-center transition duration-500 ease-in-out   pb-2  ${
                    isEmail
                      ? "font-semibold text-black border-b-[1px] border-black  shadow-sm"
                      : "text-gray-500"
                  }`}
                >
                  Email
                </p>
                <p
                  onClick={() => setIsEmail(false)}
                  className={`w-full text-sm text-center transition duration-500 ease-in-out  pb-2 ${
                    !isEmail
                      ? "font-semibold text-black border-b-[1px] border-black   shadow-sm "
                      : "text-gray-500"
                  }`}
                >
                  Phone number
                </p>
              </div>

              {isEmail ? (
                <div className="transition duration-500 ease-in-out ">
                  <InputEmail
                    value={email}
                    changValueEmail={setEmail}
                    onFocus={() => {
                      setSearch(true);
                      setClicked(false);
                    }}
                    onBlur={() => {
                      setSearch(false);
                    }}
                  />
                </div>
              ) : (
                <div className="transition duration-500 ease-in-out ">
                  <InputTel value={nomor} changeValueTel={setNomor} />
                </div>
              )}

              {isFriend ? (
                <div
                  onClick={() => {
                    setClicked(!clicked);
                  }}
                  className={`flex flex-row items-center w-full gap-2 p-3 border cursor-pointer rounded-xl ${
                    !clicked
                      ? "transition bg-white border-gray-300 shadow-sm  hover:shadow-md hover:border-gray-400"
                      : "border-gray-400 shadow-md"
                  }`}
                >
                  <div className="text-center">
                    <Avatar className="w-12 h-12">
                      <AvatarImage
                        width={28}
                        src={
                          friend?.profile
                            ? `data:image/jpeg;base64,${friend.profile}`
                            : ""
                        }
                      />
                      <AvatarFallback className="text-white bg-black">
                        CN
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="flex flex-col ">
                    <p className="text-sm font-semibold">{friend?.name}</p>
                    <p className="text-xs text-gray-400">{friend?.identity}</p>
                  </div>
                </div>
              ) : (
                ""
              )}
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button
                type="button"
                disabled={isButtonDisabled}
                onClick={() => {
                  handleSubmit(email);
                }}
              >
                {search
                  ? "Search"
                  : friend != null && friend.isFriend
                  ? "Added"
                  : "Add Friend"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </form>
      </Dialog>
    </>
  );
};

export default AddFriends;
