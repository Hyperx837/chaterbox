import { useRef, useState } from "react";
import { socket } from "../utils";

function Chatroom() {
  const inputEl = useRef(null);
  const msgs = useRef(null);
  const [user, setUser] = useState(socket.username);
  socket.onUserChange((user) => setUser(user));
  const sendMessage = () => {
    socket.send(inputEl.current.value);
    inputEl.current.value = "";
  };
  socket.onmessage((e) => {
    let li = document.createElement("li");
    let data = JSON.parse(e.data);
    let msg =
      data.username === socket.username
        ? `You: ${data.message}`
        : `${data.username}: ${data.message}`;
    li.appendChild(document.createTextNode(msg));
    msgs.current.appendChild(li);
  });
  return (
    <div className="App">
      <h1>WebSocket Chat for {user}</h1>
      <ul ref={msgs}></ul>
      <input
        ref={inputEl}
        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}

export default Chatroom;
