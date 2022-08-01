import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Chatroom from "./Chatroom";
import Login from "./Login";

const App = () => (
  <div className="bg-[#212129] h-[100vh]">
    <Router>
      <Routes>
        <Route path="/chat" element={<Chatroom />} />
        <Route path="/" element={<Login />} />
      </Routes>
    </Router>
  </div>
);
export default App;
