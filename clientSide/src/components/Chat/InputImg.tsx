import React, { useState } from "react";
import { Input } from "../ui/input";
import { X, UploadCloud } from "lucide-react";
import { toast } from "sonner";

interface InputImgProps {
  onSendImage: (file: File) => void;
  onCancel?: () => void;
  sendMessage: any;
}

const InputImg: React.FC<InputImgProps> = ({
  sendMessage,
  onSendImage,
  onCancel,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      console.log(file);

      if (file.size > 1 * 1024 * 1024) {
        toast.error("File is too large (max 5MB)");
        return;
      }
      setSelectedFile(file);
      const preview = URL.createObjectURL(file);
      setPreviewUrl(preview);
    }
  };

  const handleSend = () => {
    if (selectedFile) {
      sendMessage("", false, false, true, selectedFile);
      onSendImage(selectedFile);
      // reset
      setSelectedFile(null);
      setPreviewUrl(null);
      onCancel?.();
    }
  };

  return (
    <div className="relative flex flex-col w-full gap-3 p-4 border border-gray-300 rounded-lg bg-gray-50 dark:bg-gray-700">
      <div className="flex items-center justify-between">
        <label
          htmlFor="picture"
          className="flex items-center gap-2 text-gray-700 cursor-pointer dark:text-gray-200 hover:text-blue-600"
        >
          <UploadCloud size={18} /> Choose Image
        </label>
        {onCancel && (
          <X
            size={20}
            className="text-red-600 cursor-pointer hover:scale-110"
            onClick={onCancel}
          />
        )}
      </div>
      <Input
        id="picture"
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleChange}
      />

      {previewUrl && (
        <div className="flex flex-col items-center gap-2">
          <img
            src={previewUrl}
            alt="preview"
            className="object-cover border border-gray-300 rounded w-52 h-52"
          />
          <p className="mt-2 text-sm text-gray-700 dark:text-gray-200">
            {selectedFile?.name}
          </p>
          <div className="flex gap-4 mt-2">
            <button
              onClick={onCancel}
              className="px-6 py-2 w-[110px] text-sm font-semibold text-gray-400 transition duration-500 ease-in-out bg-white border border-black rounded shadow-md hover:text-gray-800 border-1 hover:scale-105 active:scale-95"
            >
              Cancel
            </button>
            <button
              onClick={handleSend}
              className="px-6 py-2 w-[110px] text-sm font-semibold text-white transition duration-300 ease-in-out bg-gray-800 border border-black rounded shadow-md border-1 hover:scale-105 active:scale-95"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default InputImg;
