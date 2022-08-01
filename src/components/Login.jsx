import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { socket } from "../utils";

const Login = () => {
  const inputEl = useRef(null);
  const navigate = useNavigate();
  const onClick = () => {
    socket.username = inputEl.current.value;
    inputEl.current.value = "";
    navigate("/chat");
  };

  return (
    <div className="flex mx-auto h-[100vh] justify-center items-center">
      <div className="w-10/12 max-w-[30rem] bg-[#323949] h-72 rounded-md shadow-lg  text-white flex flex-col justify-center font-[Poppins] items-center">
        <span className="text-center text-3xl mb-3">Enter your name</span>
        <input
          ref={inputEl}
          className="w-10/12 max-w-96  h-10 rounded-lg px-6 text-black text-lg text-center"
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
