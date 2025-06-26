import Login from "@/components/auth/Login";
import Register from "@/components/auth/Register";
import { useState } from "react";

const Auth = () => {
  const [isRegister, setIsRegister] = useState<boolean>(false);

  return (
    <div className="flex w-full h-full">
      {/* Left Side */}
      <div className="left-side w-[50%] bg bg-black ">
        <div>
          <img src="" alt="" />
        </div>
      </div>

      {/* Right Side */}
      <div className="right-side w-[50%] flex flex-col justify-center items-center">
        <div className="max-w-[500px] flex flex-col gap-8">
          {isRegister ? (
            <Register isRegister={setIsRegister} />
          ) : (
            <Login isRegister={setIsRegister} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;
