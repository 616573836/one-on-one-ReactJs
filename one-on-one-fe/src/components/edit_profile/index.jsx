import React, { useState} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const ProfileComponent = () => {
  const [profileData, setProfileData] = useState({ email: '', password: '' });
  const navigate = useNavigate();
  // Fetch user profile data on component mount
  
  const handleChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.put('/api/accounts/profile/', profileData, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        'Content-Type': 'application/json'
      }
    })
    .then(response => {
      alert('Profile updated successfully.');
      navigate('/profile');
    })
    
    .catch(error => console.error('There was an error updating the profile: ', error));
  };

  return (
    <div>
      <h2>Edit Profile</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Email:
          <input
            type="email"
            name="email"
            value={profileData.email}
            onChange={handleChange}
          />
        </label>
        <label>
          New Password: <small>(leave blank to keep current password)</small>
          <input
            type="password"
            name="password"
            value={profileData.password}
            onChange={handleChange}
          />
        </label>
        <button type="submit" >Update Profile</button>
      </form>
    </div>
  );
};

export default ProfileComponent;