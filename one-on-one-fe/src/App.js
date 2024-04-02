
import React from 'react';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import SignUp from "./components/sign_up";
import Login from "./components/login";
import Profile from "./components/profile";
import ProfileEdit from "./components/edit_profile"
import MeetingList from "./components/meetings";
import MeetingDetail from './components/meeting_detail';
import ProfileD from "./components/contact";

// Other imports...

function App() {
  return (
    <BrowserRouter>
        <Routes>
        <Route path="signup/" element={<SignUp />} />
        <Route path="login/" element={<Login />} />
        <Route path="profile/" element={<Profile />} />
        <Route path="profile/edit/" element={<ProfileEdit />} />
        <Route path="meetings/" element={<MeetingList />} />
        <Route path="meetings/:meetingId/" element={<MeetingDetail />} />
        <Route path="contact/" element={<ProfileD />} />
          {/* Other routes */}
        </Routes>
    </BrowserRouter>
  );
}

export default App;
