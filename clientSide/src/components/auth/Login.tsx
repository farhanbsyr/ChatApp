import { useState } from "react";
import { Button } from "../ui/button";
import InputEmail from "../input/InputEmail";
import InputPassword from "../input/InputPassword";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { authSchema } from "@/schemas/authSchema";

interface LoginProps {
  isRegister: any;
}

const Login: React.FC<LoginProps> = ({ isRegister }) => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errors, setErrors] = useState<{
    email?: string[];
    password?: string[];
    number?: string[];
    username?: string[];
  }>({});
  const navigate = useNavigate();

  const postLogin = async (username: string, password: string) => {
    try {
      const response = await axios.post(
        "http://localhost:8080/api/auth/login",
        {
          username,
          password,
        },
        {
          withCredentials: true,
        }
      );
      console.log("Login sukses:", response.data);
      navigate("/");
      return response.data;
    } catch (error: any) {
      console.error("Login gagal:", error.response?.data || error.message);
      throw error;
    }
  };

  const handleSubmit = () => {
    const result = authSchema.safeParse({ email, password });

    if (!result.success) {
      const fieldErrors: any = result.error.flatten().fieldErrors;
      console.log(fieldErrors);

      setErrors({
        email: fieldErrors.email?.[0],
        password: fieldErrors.password,
      });
      console.log(errors);

      return;
    }

    postLogin(email, password);
    console.log(email + " dan " + password);

    setEmail("");
    setPassword("");
    setErrors({});
  };

  return (
    <>
      <div className="text-3xl font-bold">
        <h1 className="">
          Welcome to the Talkify talk freely, anytime, anywhere
        </h1>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <InputEmail
            value={email}
            changValueEmail={setEmail}
            errors={errors.email}
          />
          <InputPassword
            value={password}
            changeValuePassword={setPassword}
            errors={errors.password}
          />
        </div>
        <div className="flex flex-col text-end text-[12px] ">
          <p className=" hover:underline hover:text-blue-600 transition duration-300 ease-in-out">
            Forget password?
          </p>
        </div>
      </div>

      <div className="button-field text-center">
        <Button
          onClick={handleSubmit}
          className="px-10 py-5 mb-1 bg-black text-white rounded-md transition duration-300 ease-in-out hover:bg-gray-800 hover:scale-105 hover:shadow-lg active:scale-95 "
          type="submit"
        >
          Sign In
        </Button>

        <p className="text-xs">
          Don't have an account?{" "}
          <span
            onClick={() => isRegister(true)}
            className="font-semibold hover:underline hover:text-blue-600 transition duration-300 ease-in-out"
          >
            Register
          </span>
        </p>
      </div>
    </>
  );
};

export default Login;
