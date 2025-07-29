import Login from "@/components/auth/Login";
import Register from "@/components/auth/Register";
import { useState } from "react";
import ilustrasi1 from "@/assets/Connected world-bro (1).svg";
import ilustrasi2 from "@/assets/Contact us-bro (2).svg";
const Auth = () => {
  const [isRegister, setIsRegister] = useState<boolean>(false);

  return (
    <div className="flex w-full h-full">
      {/* Left Side */}
      <div className="left-side w-[50%] bg bg-black flex  flex-col items-center justify-center">
        <div className="w-[60%]">
          <img src={ilustrasi1} alt="" className="w-full h-full" />
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
