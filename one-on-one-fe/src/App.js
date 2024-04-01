
import React from 'react';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import SignUp from "./components/sign_up";
import Login from "./components/login";
<<<<<<< HEAD
import Profile from "./components/profile";
=======
import MeetingList from "./components/meetings";
>>>>>>> b35deff2d9f4ddb389df79d6ea3662f05c0ea217

// Other imports...

function App() {
  return (
    <BrowserRouter>
        <Routes>
        <Route path="signup/" element={<SignUp />} />
        <Route path="login/" element={<Login />} />
<<<<<<< HEAD
        <Route path="profile/" element={<Profile />} />
=======
        <Route path="meetings/" element={<MeetingList />} />
>>>>>>> b35deff2d9f4ddb389df79d6ea3662f05c0ea217

          {/* Other routes */}
        </Routes>
    </BrowserRouter>
  );
}

export default App;
