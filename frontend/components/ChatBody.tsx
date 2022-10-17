import { useEffect, useRef, useState } from "react";
import { FiSend } from "react-icons/fi";
import { socket } from "socket";
import { MessageComponent, User } from "types";
import { getInputValue } from "utils";
import Message from "./Message";

const ChatBody = () => {
  const [messages, setMessages] = useState<MessageComponent[]>([]);
  const lastMessageRef = useRef<HTMLDivElement>(null);
  const inputEl = useRef<HTMLInputElement>(null);
  useEffect(() => {
    lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
    socket.on("newMessage", (user: User, msg: string, msgID: number) => {
      setMessages([
        ...messages,
        {
          avatar: user.avatar,
          msg: msg,
          sentByUser: false,
          msgID: msgID,
        },
      ]);
    });
  }, [messages]);
  const sendMessage = () => {
    let msg = getInputValue(inputEl);
    if (!msg) return;
    socket.send(msg);
    setMessages([
      ...messages,
      {
        avatar: socket.user.avatar,
        msg: msg,
        sentByUser: true,
        msgID: Math.random(),
      },
    ]);
    fetch("http://localhost:8000/message/new", {
      method: "POST",
      body: JSON.stringify({
        timestamp: Date.now(),
        content: msg,
        author: socket.user.id,
      }),
    });
  };
  return (
    <>
      <div className="col-span-6 overflow-auto row-start-[2] row-end-[12] p-3 pb-4">
        {messages.map(({ avatar, msg, sentByUser, msgID }) => {
          return (
            <Message avatar={avatar} key={msgID} sent={sentByUser}>
              {msg}
            </Message>
          );
        })}
        <div ref={lastMessageRef}></div>
      </div>
      <div className="flex flex-row col-start-5 row-start-[12] col-span-6 place-self-center">
        <input
          ref={inputEl}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          className="h-10 rounded-md w-[800px] bg-[#323949] px-5"
          placeholder="Your message..."
        />
        <button onClick={sendMessage} className="ml-[-40px]">
          <FiSend size={22} />
        </button>
      </div>{" "}
    </>
  );
};

export default ChatBody;
