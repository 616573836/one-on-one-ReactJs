
import React from 'react';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import SignUp from "./components/sign_up";
import Login from "./components/login";
import Profile from "./components/profile";

// Other imports...

function App() {
  return (
    <BrowserRouter>
        <Routes>
        <Route path="signup/" element={<SignUp />} />
        <Route path="login/" element={<Login />} />
        <Route path="profile/" element={<Profile />} />

          {/* Other routes */}
        </Routes>
    </BrowserRouter>
  );
}

export default App;
