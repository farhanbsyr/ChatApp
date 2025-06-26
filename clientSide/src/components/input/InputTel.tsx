import React from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

interface InputTelProps {
  value: string;
  changeValueTel: any;
  errors?: string[];
}
const InputTel: React.FC<InputTelProps> = ({
  value,
  changeValueTel,
  errors,
}) => {
  const onChangeValue = (e: string) => {
    changeValueTel(e);
  };
  return (
    <div className="input-field">
      <Label htmlFor="nomor">Nomor ponsel</Label>
      <Input
        type="tel"
        id="nomor"
        value={value}
        placeholder="087812345678"
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

export default InputTel;
