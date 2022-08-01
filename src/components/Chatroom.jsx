import { useEffect, useRef, useState } from "react";
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
    msgs.current.appendChild(li);
  });
  useEffect(() => {
    if (!socket.username) {
      navigate("/");
    }
  }, [navigate]);

  return (
    <div className="text-white">
      <h1>WebSocket Chat for {user}</h1>
      <ul ref={msgs}></ul>
      <input
        ref={inputEl}
        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        className="text-black"
      />
      <button onClick={sendMessage}>Send</button>
      <br />
      <button onClick={() => navigate("/")}>Back to login</button>
    </div>
  );
}

export default Chatroom;
