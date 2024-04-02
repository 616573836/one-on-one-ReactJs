import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';



const ProfileViewComponent = () => {
  const [profileData, setProfileData] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('/api/accounts/profile/', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}`}
    })
    .then(response => {
      setProfileData(response.data);
      localStorage.setItem("userid", response.data.id);
    })
    .catch(error => console.error('Error fetching profile data:', error));
  }, []);

  return (
    <div>
      <h2>Profile</h2>
      <div>Username: {profileData.username}</div>
      <div>Email: {profileData.email}</div>
      <div>User ID: {profileData.id}</div>
      {/* Display other profile information here */}
      <button onClick={() => navigate('/profile/edit')}>Edit My Profile</button>
      <button onClick={() => navigate('/meetings')}>Meetings</button>
      <button onClick={() => navigate('/contact')}>Contacts</button>
    </div>
  );
};

export default ProfileViewComponent;
