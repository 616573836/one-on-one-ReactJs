
import React from 'react';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import SignUp from "./components/sign_up";
import Login from "./components/login";
import Profile from "./components/profile";
import MeetingList from "./components/meetings";

// Other imports...

function App() {
  return (
    <BrowserRouter>
        <Routes>
        <Route path="signup/" element={<SignUp />} />
        <Route path="login/" element={<Login />} />
        <Route path="profile/" element={<Profile />} />
        <Route path="meetings/" element={<MeetingList />} />

          {/* Other routes */}
        </Routes>
    </BrowserRouter>
  );
}

export default App;
