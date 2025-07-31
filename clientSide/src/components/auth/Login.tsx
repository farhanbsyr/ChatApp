import { useState } from "react";
import { Button } from "../ui/button";
import InputEmail from "../input/InputEmail";
import InputPassword from "../input/InputPassword";
import { useNavigate } from "react-router-dom";
import { loginSchema } from "@/schemas/auth/loginSchema";
import { toast } from "sonner";
import api from "@/api/axiosApi";

interface LoginProps {
  isRegister: any;
}

const Login: React.FC<LoginProps> = ({ isRegister }) => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errors, setErrors] = useState<{
    email?: string[];
    password?: string[];
  }>({});
  const navigate = useNavigate();

  const postLogin = async (username: string, password: string) => {
    try {
      await api.post("auth/login", { username, password });

      setEmail("");
      setPassword("");
      setErrors({});
      navigate("/");
    } catch (error: any) {
      console.log(error);

      if (error.status === 401) {
        toast.error(error.response.data.message);
        setPassword("");
      }
      console.error("Login gagal:", error.response?.data || error.message);
      throw error;
    }
  };

  const handleSubmit = () => {
    const result = loginSchema.safeParse({ email, password });

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
  };

  return (
    <>
      <div className="text-3xl font-bold">
        <h1 className="">
          Welcome to the Talkify talk freely, anytime, anywhere
        </h1>
      </div>

      <form
        action=""
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
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
            <p className="transition duration-300 ease-in-out hover:underline hover:text-blue-600">
              Forget password?
            </p>
          </div>
        </div>

        <div className="text-center button-field">
          <Button
            className="px-10 py-5 mb-1 text-white transition duration-300 ease-in-out bg-black rounded-md hover:bg-gray-800 hover:scale-105 hover:shadow-lg active:scale-95 "
            type="submit"
          >
            Sign In
          </Button>

          <p className="text-xs">
            Don't have an account?{" "}
            <span
              onClick={() => isRegister(true)}
              className="font-semibold transition duration-300 ease-in-out hover:underline hover:text-blue-600"
            >
              Register
            </span>
          </p>
        </div>
      </form>
    </>
  );
};

export default Login;
