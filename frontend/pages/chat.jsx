import Contact from "components/Contact";
import Message from "components/Message";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { FiSend } from "react-icons/fi";
import { getUserName, socket } from "../socket";

function Chatroom() {
  const inputEl = useRef(null);
  const [user, setUser] = useState(socket.username);
  const [messages, setMessages] = useState([]);
  const [avatars, setAvatars] = useState([]);
  const updateOnlineUsers = () => {
    fetch("http://localhost:8000/user/online").then(async (res) => {
      let onlineUsers = await res.json();

      Promise.all(
        onlineUsers.map(async (userid) => await getUserName(userid))
      ).then((res) => setAvatars(res));
    });
  };
  useEffect(() => {
    updateOnlineUsers();
    socket.on("userChange", (user) => setUser(user));
    socket.on("newUser", (_) => {
      updateOnlineUsers();
    });
  }, []);
  const router = useRouter();
  const lastMessageRef = useRef(null);
  const sendMessage = () => {
    let msg = inputEl.current.value;
    socket.send(msg);
    setMessages([...messages, [user.avatar_url, msg, true, Math.random()]]);
    inputEl.current.value = "";
  };
  useEffect(() => {
    // 👇️ scroll to bottom every time messages change
    lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
    socket.on("newMessage", (user, msg, msgID) => {
      setMessages([...messages, [user.avatar_url, msg, false, msgID]]);
    });
  }, [messages]);
  useEffect(() => {
    if (!socket.username) {
      router.push("/");
    }
  }, [router]);

  return (
    <>
      <Head>
        <title>{`Chat of ${user}`}</title>
        <meta name="chaterbox" content="chat app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="text-white p-5 grid grid-rows-[repeat(12,1fr)] grid-cols-10 h-[100vh] gap-5">
        <span className="text-[3rem] col-span-10 ">Hey there {user}!!</span>
        <div className="w-full col-span-4 row-start-2 row-end-[13] mt-10 border border-white">
          {avatars.map((data) => {
            let { id, username, avatar_url } = data;
            return <Contact name={username} avatar_url={avatar_url} key={id} />;
          })}
        </div>
        <div
          className="col-span-6 overflow-auto row-start-[2] row-end-[12] p-3 pb-4"
          // ref={lastMessageRef}
        >
          {messages.map(([avatar, msg, sent, msgID]) => (
            <Message avatar={avatar} key={msgID} sent={sent}>
              {msg}
            </Message>
          ))}
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
        </div>
        <br />
      </div>
    </>
  );
}

export default Chatroom;
