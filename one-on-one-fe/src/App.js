
import React, { Component } from 'react';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import SignUp from "./components/sign_up";
import Login from "./components/login";
import Profile from "./components/profile";
import ProfileEdit from "./components/edit_profile"
import Contact from "./components/contact"
import MeetingList from "./components/meetings";
import MeetingDetail from './components/meeting_detail';
import ProfileD from "./components/contact";
import Members from './components/members'
import Member from './components/member'
import EventList from "./components/events"
// Other imports...

function App() {
  return (
    <BrowserRouter >
        <Routes>
        <Route path="signup/" element={<SignUp />} />
        <Route path="login/" element={<Login />} />
        <Route path="profile/" element={<Profile />} />
        <Route path="profile/edit/" element={<ProfileEdit />} />
        <Route path="contact/" element={<Contact />} />
        <Route path="meetings/" element={<MeetingList />} />
        <Route path="meetings/:meetingId/" element={<MeetingDetail />} />
        <Route path="contact/" element={<ProfileD />} />
        <Route path="meetings/:meetingId/members" element={<Members />} />
        <Route path="meetings/:meetingId/members/:memberID" element={<Member />} />
        <Route path="meetings/:meetingId/members/:memberId/calendar/events" element={<EventList />} />

          {/* Other routes */}
        </Routes>
    </BrowserRouter>
  );
}

export default App;
