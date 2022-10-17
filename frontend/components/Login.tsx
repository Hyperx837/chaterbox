import { useRouter } from "next/router";
import { useRef } from "react";
import { getInputValue } from "utils";
import { socket } from "../socket";

const Login = () => {
  const inputEl = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const onClick = () => {
    socket.user.name = getInputValue(inputEl);
    fetch("http://localhost:8000/user/new", {
      method: "POST",
      body: JSON.stringify({
        username: socket.user.name,
        id: socket.user.id,
      }),
    }).then(async (res) => {
      let { avatar_url } = await res.json();
      socket.user.avatar = avatar_url;
    });
    router.push("/chat");
  };

  return (
    <div className="flex mx-auto h-[100vh] justify-center items-center">
      <div className="w-10/12 max-w-[30rem] bg-[#323949] h-72 rounded-md shadow-lg  text-white flex flex-col justify-center font-[Poppins] items-center">
        <span className="text-center text-3xl mb-3">Login</span>
        <input
          ref={inputEl}
          className="w-10/12 max-w-96  h-10 rounded-lg px-6 text-black text-lg"
          placeholder="Name"
          type="text"
          onKeyDown={(e) => e.key === "Enter" && onClick()}
        />
        <button
          className="w-52 h-12 text-center text-xl bg-sky-400 rounded-lg mt-10 font-alternates"
          onClick={onClick}
        >
          Enter Chatroom
        </button>
      </div>
    </div>
  );
};
export default Login;
