import { useState } from "react";
import InputUsername from "../input/InputUsername";
import InputEmail from "../input/InputEmail";
import InputTel from "../input/InputTel";
import InputPassword from "../input/InputPassword";
import { Button } from "../ui/button";
import api from "@/api/axiosApi";
import { registerSchema } from "@/schemas/auth/registerSchema";

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
    nomor?: string[];
    username?: string[];
  }>({});

  const postRegister = async (
    username: string,
    email: string,
    handphoneNumber: string,
    password: string
  ) => {
    try {
      await api.post("auth/register", {
        name: username,
        email,
        handphoneNumber,
        password,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = () => {
    const result = registerSchema.safeParse({
      email,
      password,
      nomor,
      username,
    });

    if (!result.success) {
      const fieldErrors: any = result.error.flatten().fieldErrors;
      console.log(fieldErrors);

      setErrors({
        email: fieldErrors.email?.[0],
        password: fieldErrors.password,
        nomor: fieldErrors.nomor,
        username: fieldErrors.username,
      });
      console.log(errors);

      return;
    }

    postRegister(username, email, nomor, password);

    setUsername("");
    setNomor("");
    setEmail("");
    setPassword("");
    setErrors({});
    isRegister(false);
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
            label="Name"
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
            errors={errors.nomor}
          />

          {/* password */}
          <InputPassword
            value={password}
            changeValuePassword={setPassword}
            errors={errors.password}
          />
        </div>
      </div>
      <div className="text-center button-field">
        <Button
          onClick={handleSubmit}
          className="px-10 py-5 mb-1 text-white transition duration-300 ease-in-out bg-black rounded-md hover:bg-gray-800 hover:scale-105 hover:shadow-lg active:scale-95 "
          type="submit"
        >
          Register
        </Button>

        <p className="text-xs">
          Already have an account?{" "}
          <span
            onClick={() => isRegister(false)}
            className="font-semibold transition duration-300 ease-in-out hover:underline hover:text-blue-600"
          >
            Login
          </span>
        </p>
      </div>
    </>
  );
};

export default Register;
