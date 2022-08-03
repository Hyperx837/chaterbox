import { useEffect, useRef, useState } from "react";
import { FiSend } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { socket } from "../utils";
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
  socket.onmessage((e) => {
    console.log(e.data);
  });
  useEffect(() => {
    if (!socket.username) {
      navigate("/");
    }
  }, [navigate]);
  // let avatar_urls = {
  //   anupama: "https://avatars.dicebear.com/api/avataaars/gobbaya.svg",
  //   janadhi: "https://avatars.dicebear.com/api/avataaars/janadhi",
  //   shanya: "https://avatars.dicebear.com/api/avataaars/shanya.svg",
  //   visal: "https://avatars.dicebear.com/api/avataaars/visal.svg",
  // };

  return (
    <div className="text-white p-5">
      <span className="text-[3rem]">Hey there {user}!!</span>
      {/* {avatar_urls.keys().map((name) => (
        <Contact name={name} avatar_url={avatar_urls[name]} />
      ))} */}
      <ul ref={msgs} id="msgs"></ul>
      <div className="absolute top-[calc(100vh-70px)] right-20 h-32">
        <input
          ref={inputEl}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          className="h-10 rounded-md w-[800px] bg-[#323949] px-5"
          placeholder="Your message..."
        />
        <button onClick={sendMessage} className="m-[-30px] pt-10">
          <FiSend />
        </button>
      </div>
      <br />
    </div>
  );
}

export default Chatroom;
