import { useState } from "react";
import InputUsername from "../input/InputUsername";
import InputEmail from "../input/InputEmail";
import InputTel from "../input/InputTel";
import InputPassword from "../input/InputPassword";
import { Button } from "../ui/button";
import { authSchema } from "@/schemas/authSchema";
import api from "@/api/axiosApi";

interface RegisterProps {
  isRegister: any;
}
const Register: React.FC<RegisterProps> = ({ isRegister }) => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [nomor, setNomor] = useState<string>("");

  const [errors, setErrors] = useState<{
    email?: string[];
    password?: string[];
    number?: string[];
    username?: string[];
  }>({});

  const postRegister = async (
    username: string,
    email: string,
    nomor: string,
    password: string
  ) => {
    try {
      const response = await api.post("", {
        withCredentials: true,
      });
      console.log(response);
    } catch (error) {
      console.log(error);
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
        number: fieldErrors.number,
        username: fieldErrors.username,
      });
      console.log(errors);

      return;
    }

    postRegister(username, email, nomor, password);
    console.log(email + " dan " + password);

    setUsername("");
    setNomor("");
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
          {/* Username */}
          <InputUsername
            value={username}
            changeValueUsername={setUsername}
            errors={errors.username}
          />
          {/* email */}
          <InputEmail
            value={email}
            changValueEmail={setEmail}
            errors={errors.email}
          />
          {/* handphone */}
          <InputTel
            value={nomor}
            changeValueTel={setNomor}
            errors={errors.number}
          />

          {/* password */}
          <InputPassword
            value={password}
            changeValuePassword={setPassword}
            errors={errors.password}
          />
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
          Already have an account?{" "}
          <span
            onClick={() => isRegister(false)}
            className="font-semibold hover:underline hover:text-blue-600 transition duration-300 ease-in-out"
          >
            Login
          </span>
        </p>
      </div>
    </>
  );
};

export default Register;
