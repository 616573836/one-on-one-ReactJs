import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';



const ProfileViewComponent = () => {
  const [profileData, setProfileData] = useState({});
  const [imageData, setImageData] = useState('');
  const navigate = useNavigate();


  const logout = () => {
      localStorage.removeItem('accessToken'); // Clear the access token
      localStorage.removeItem('profileImage');
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
    const storedImage = localStorage.getItem('profileImage');
    if (storedImage) {
      setImageData(storedImage);
    }
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
      <button className="logout-button" onClick={logout}>Logout</button>
    
    
    <div>
      <h1>Profile</h1>
      <p>Profile Image</p>
      {imageData && (
  <div>
    
    <img src={imageData} alt="Profile" style={{ 
      width: '100%', 
      maxWidth: '300px', 
      height: '400px', 
      display: 'block', 
      marginLeft: 'auto', 
      marginRight: 'auto'
    }} />
  </div>
)}
      <p>Username: {profileData.username}</p>
      <p>Email: {profileData.email}</p>
      <p>User ID: {profileData.id}</p>
      
      <form>
      <button onClick={() => navigate('/profile/edit')}>Edit My Profile</button>
      
      </form>
    </div>   
    </> 
  );
};

export default ProfileViewComponent;
