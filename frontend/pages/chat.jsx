import Contact from "components/Contact";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { FiSend } from "react-icons/fi";
import { createMessage, getUserName, socket } from "../socket";

function Chatroom() {
  const inputEl = useRef(null);
  const msgs = useRef(null);
  const [user, setUser] = useState(socket.username);
  const [avatars, setAvatars] = useState([]);
  useEffect(() => {
    fetch("http://localhost:8000/user/online").then(async (res) => {
      for (let userid of await res.json()) {
        let { username, id, avatar_url } = await getUserName(userid);
        setAvatars([[id, username, avatar_url]]);
      }
    });
    socket.onUserChange((user) => setUser(user));
    socket.onNewUser(({ id, username, avatar_url }) => {
      setAvatars((avatars) => [...avatars, [id, username, avatar_url]]);
    });
  }, []);
  const router = useRouter();
  const sendMessage = () => {
    let msg = inputEl.current.value;
    let li = createMessage(msg, "You");
    let msgs = document.getElementById("msgs");
    if (msgs) msgs.appendChild(li);
    li.className = "right";

    socket.send(msg);
    inputEl.current.value = "";
  };
  useEffect(() => {
    if (!socket.username) {
      router.push("/");
    }
  }, [router]);

  return (
    <>
      <Head>
        <title>Chaterbox</title>
        <meta name="chaterbox" content="chat app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="text-white p-5 grid grid-rows-[repeat(12,1fr)] grid-cols-10 h-[100vh] gap-5">
        <span className="text-[3rem] col-span-10 ">Hey there {user}!!</span>
        <div className="w-full col-span-4 row-start-2 row-end-[13] mt-10 border border-white">
          {avatars.map((data) => {
            let [id, username, url] = data;
            return <Contact name={username} avatar_url={url} key={id} />;
          })}
        </div>
        <ul ref={msgs} id="msgs" className="col-span-6"></ul>
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
