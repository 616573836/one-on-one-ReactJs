import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';



const ProfileViewComponent = () => {
  const [profileData, setProfileData] = useState({});
  const navigate = useNavigate();


  const logout = () => {
      localStorage.removeItem('accessToken'); // Clear the access token
      navigate('/login'); // Redirect to login page
  };

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
    <>
    <meta content="width=device-width, initial-scale=1.0" name="viewport" />
      <meta charSet="utf-8" />
      <meta content="#a37fdf" name="theme-color" />
      <meta content="Sign in / Sign up" property="og:title" />
      <meta content="website" property="og:type" />
      <meta data-intl-tel-input-cdn-path="intlTelInput/" />
      <title>Sign in / Sign up</title>
      <link href="../../STYLE/SHARED/general.css" media="screen" rel="stylesheet" />
      <link
        href="../../STYLE/SHARED/visitor-pages.css"
        media="screen"
        rel="stylesheet"
      />
      <link href="../../STYLE/signin-signup.css" media="screen" rel="stylesheet" />
      <header
        className="u-align-left u-clearfix u-header u-section-row-container"
        id="sec-d402"
      ></header>
      <button className="logout-button" onClick={logout}>Logout</button>
    
    
    <div>
      <h1>Profile</h1>
      <p>Username: {profileData.username}</p>
      <p>Email: {profileData.email}</p>
      <p>User ID: {profileData.id}</p>
      <form>
      <button onClick={() => navigate('/profile/edit')}>Edit My Profile</button>
      <button onClick={() => navigate('/meetings')}>Meetings</button>
      <button onClick={() => navigate('/contact')}>Contacts</button>
      </form>
    </div>   
    </> 
  );
};

export default ProfileViewComponent;
