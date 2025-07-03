interface InputMsgProps {
  message: string;
  setMessage: any;
}

const InputMsg: React.FC<InputMsgProps> = ({ message, setMessage }) => {
  return (
    <>
      <input
        type="text"
        id="input-group-1"
        className="w-full border-transparent focus:outline-none focus:border-transparent focus:ring-0"
        placeholder="Your message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
    </>
  );
};

export default InputMsg;
