
import React from 'react';
import { BrowserRouter, Route, Routes, Outlet } from "react-router-dom";
import Sidebar from './components/sidebar';
import SignUp from "./components/sign_up";
import Login from "./components/login";
import Profile from "./components/profile";
import ProfileEdit from "./components/edit_profile";
import Contact from "./components/contact";
import MeetingList from "./components/meetings";
import MeetingDetail from './components/meeting_detail';
import ProfileD from "./components/contact";
import Calendar from './components/calendar_detail'
import Member from './components/member';
import EventList from "./components/events";
import EventDetail from "./components/event_detail";
// Other imports...
const SidebarLayout = () => (
  <div style={{ display: 'flex' }}>
      <Sidebar />
      <div style={{ marginLeft: '50px', width: 'calc(100% - 50px)' }}>
          <Outlet />
      </div>
  </div>
);


function App() {
  return (
    <BrowserRouter >
      <Routes>
        <Route path="signup/" element={<SignUp />} />
        <Route path="login/" element={<Login />} />
        <Route element={<SidebarLayout />}>
          <Route path="profile/" element={<Profile />} />
          <Route path="profile/edit/" element={<ProfileEdit />} />
          <Route path="contact/" element={<Contact />} />
          <Route path="meetings/" element={<MeetingList />} />
          <Route path="meetings/:meetingId/" element={<MeetingDetail />} />
          <Route path="contact/" element={<ProfileD />} />
          <Route path="meetings/:meetingId/members/:memberID" element={<Member />} />
          <Route path="meetings/:meetingID/members/:userID/calendar" element={<Calendar />} />
          <Route path="meetings/:meetingId/members/:memberId/calendar/events" element={<EventList />} />
          <Route path="meetings/:meetingId/members/:memberId/calendar/events/:eventId" element={<EventDetail />} />
          {/* Other routes */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
