import React from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";

interface inputTextProps {
  value: string;
  changValueEmail: any;
  errors?: string[];
  onFocus?: any;
  onBlur?: any;
}

const InputEmail: React.FC<inputTextProps> = ({
  value,
  changValueEmail,
  errors,
  onFocus,
  onBlur,
}) => {
  const onChangeValue = (e: string) => {
    changValueEmail(e);
  };
  return (
    <div className="input-field">
      <Label htmlFor="email">Email</Label>
      <Input
        type="email"
        id="email"
        value={value}
        placeholder="Enter your email..."
        className="w-full rounded-xl"
        onChange={(e) => onChangeValue(e.target.value)}
        onFocus={onFocus}
        onBlur={onBlur}
      />
      {errors && (
        <p className=" pl-1 text-[10px] font-semibold text-red-500">{errors}</p>
      )}
    </div>
  );
};

export default InputEmail;
