import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authSchema } from "@/schemas/authSchema";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Auth = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errors, setErrors] = useState<{
    email?: string[];
    password?: string[];
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
          <div className="text-3xl font-bold">
            <h1 className="">
              Welcome to the Talkify talk freely, anytime, anywhere
            </h1>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <div className="input-field">
                <Label htmlFor="email">Email</Label>
                <Input
                  type="email"
                  id="email"
                  value={email}
                  placeholder="Enter your email..."
                  className="w-full rounded-xl"
                  onChange={(e) => setEmail(e.target.value)}
                />
                {errors.email && (
                  <p className=" pl-1 text-[10px] font-semibold text-red-500">
                    {errors.email}
                  </p>
                )}
              </div>
              <div className="input-field">
                <Label htmlFor="password">Password</Label>
                <Input
                  type="password"
                  id="password"
                  value={password}
                  placeholder="Enter your password..."
                  onChange={(e) => setPassword(e.target.value)}
                />
                {Array.isArray(errors.password) &&
                errors.password?.length > 0 ? (
                  <p className=" pl-1 text-[10px] font-semibold text-red-500">
                    {errors.password?.join(", ")}
                  </p>
                ) : (
                  ""
                )}
              </div>
            </div>
            <div className="flex flex-col text-end text-[12px] ">
              <p className="hover:underline">Forget password?</p>
            </div>
          </div>

          <div className="button-field">
            <Button onClick={handleSubmit} className="px-8 py-5 " type="submit">
              Sign In
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
