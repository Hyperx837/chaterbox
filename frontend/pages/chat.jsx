import Contact from "components/Contact";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { getUserName, socket } from "../socket";

function Chatroom() {
  const [user, setUser] = useState(socket.username);
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
  useEffect(() => {
    if (!socket.user.name) {
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
            if (!data) return;
            let { id, username, avatar_url } = data;
            return <Contact name={username} avatar_url={avatar_url} key={id} />;
          })}
        </div>

        <br />
      </div>
    </>
  );
}

export default Chatroom;
