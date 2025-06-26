import React from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";

interface InputUsernameProps {
  value: string;
  changeValueUsername: any;
  errors?: string[];
}
const InputUsername: React.FC<InputUsernameProps> = ({
  value,
  changeValueUsername,
  errors,
}) => {
  const onChangeValue = (e: string) => {
    changeValueUsername(e);
  };
  return (
    <div className="input-field">
      <Label htmlFor="username">Username</Label>
      <Input
        type="text"
        id="username"
        value={value}
        placeholder="Enter your username..."
        className="w-full rounded-xl"
        onChange={(e) => onChangeValue(e.target.value)}
      />
      {Array.isArray(errors) && errors?.length > 0 ? (
        <p className=" pl-1 text-[10px] font-semibold text-red-500">
          {errors.join(", ")}
        </p>
      ) : (
        ""
      )}
    </div>
  );
};

export default InputUsername;
