import React from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

interface InputPasswordProps {
  value: string;
  changeValuePassword: any;
  errors?: string[];
}

const InputPassword: React.FC<InputPasswordProps> = ({
  value,
  changeValuePassword,
  errors,
}) => {
  const onChangeValue = (e: string) => {
    changeValuePassword(e);
  };
  return (
    <div className="input-field">
      <Label htmlFor="password">Password</Label>
      <Input
        type="password"
        id="password"
        value={value}
        placeholder="Enter your password..."
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

export default InputPassword;
