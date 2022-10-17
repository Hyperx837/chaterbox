import ChatBody from "components/ChatBody";
import Contact from "components/Contact";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getUserName, socket } from "socket";
import { User } from "types";

function Chatroom() {
  if (!socket.user) return <h1>403 Forbidden</h1>;

  const [user, setUser] = useState(socket.user.name);
  const [avatars, setAvatars] = useState<User[]>([]);
  const router = useRouter();

  const updateOnlineUsers = () => {
    fetch("http://localhost:8000/user/online").then(async (res) => {
      let onlineUsers: number[] = await res.json();
      setAvatars(await Promise.all(onlineUsers.map(getUserName)));
    });
  };
  useEffect(() => {
    updateOnlineUsers();
    socket.on("userChange", (user: string) => setUser(user));
    socket.on("newUser", (_: any) => {
      updateOnlineUsers();
    });
  }, []);
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
          {avatars.map((user: User) => {
            console.table(user);
            if (!user) return;
            let { id, name, avatar } = user;
            return <Contact name={name} avatar_url={avatar} key={id} />;
          })}
        </div>
        <ChatBody />
        <br />
      </div>
    </>
  );
}

export default Chatroom;
