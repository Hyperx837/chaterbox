import { ReactNode } from "react";
import { socket } from "socket";

interface Props {
  children: ReactNode;
  avatar: string;
  sent: boolean;
}

const Message = ({ children, avatar, sent }: Props) => {
  let lastUser = socket.lastMessageUser?.avatar === avatar;
  return (
    <div
      className={`flex w-full ${sent ? "flex-row-reverse ml-auto" : ""} gap-2`}
    >
      {!lastUser || (
        <img
          src={avatar}
          className="w-8 h-8 rounded-full mt-5  border border-gray-400"
        />
      )}
      <div
        className={`rounded-xl mt-5 bg-gradient-to-r px-5 py-2 ${
          sent ? "from-cyan-500 to-blue-500" : "from-blue-600 to-purple-500"
        }`}
      >
        {children}
      </div>
    </div>
  );
};

export default Message;
