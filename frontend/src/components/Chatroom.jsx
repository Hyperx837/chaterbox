import { useEffect, useRef, useState } from "react";
import { FiSend } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { socket } from "../socket";
import Contact from "./Contact";

function Chatroom() {
  const inputEl = useRef(null);
  const msgs = useRef(null);
  const [user, setUser] = useState(socket.username);
  const navigate = useNavigate();
  socket.onUserChange((user) => setUser(user));
  const sendMessage = () => {
    socket.send(inputEl.current.value);
    inputEl.current.value = "";
  };
  useEffect(() => {
    if (!socket.username) {
      navigate("/");
    }
  }, [navigate]);
  let avatar_urls = [
    ["shevon", "https://avatars.dicebear.com/api/avataaars/shevon.svg"],
    ["dave", "https://avatars.dicebear.com/api/avataaars/dave.svg"],
    ["chris", "https://avatars.dicebear.com/api/avataaars/chris.svg"],
    ["emily", "https://avatars.dicebear.com/api/avataaars/emily.svg"],
  ];

  return (
    <div className="text-white p-5 grid grid-rows-[repeat(12,1fr)] grid-cols-10 h-[100vh] gap-5">
      <span className="text-[3rem] col-span-10 ">Hey there {user}!!</span>
      <div className="w-full col-span-4 row-start-2 row-end-[13] mt-10 border border-white">
        {avatar_urls.map(([name, url]) => (
          <Contact name={name} avatar_url={url} key={name} />
        ))}
      </div>
      <ul ref={msgs} id="msgs" className="col-span-6"></ul>
      <div className="col-start-5 row-start-[12] col-span-6 place-self-center">
        <input
          ref={inputEl}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          className="h-10 rounded-md w-[800px] bg-[#323949] px-5"
          placeholder="Your message..."
        />
        <button onClick={sendMessage} className="m-[-40px]">
          <FiSend size={22} />
        </button>
      </div>
      <br />
    </div>
  );
}

export default Chatroom;
