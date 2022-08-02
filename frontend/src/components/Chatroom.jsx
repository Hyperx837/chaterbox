import { useEffect, useRef, useState } from "react";
import { FiSend } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { socket } from "../utils";

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
    let li = document.createElement("li");
    console.log(e.data);
    let data = JSON.parse(e.data);
    let msg =
      data.username === socket.username
        ? `You: ${data.message}`
        : `${data.username}: ${data.message}`;
    li.appendChild(document.createTextNode(msg));
    li.className = data.username === socket.username ? "text-right" : "";
    msgs.current.appendChild(li);
  });
  useEffect(() => {
    if (!socket.username) {
      navigate("/");
    }
  }, [navigate]);

  return (
    <div className="text-white p-5">
      <span className="text-[3rem]">Hey there {user}!!</span>
      <ul ref={msgs}></ul>
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
