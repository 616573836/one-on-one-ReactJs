import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ProfileComponent = () => {
  const [profileData, setProfileData] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Prepare the data for submission
    const submissionData = {};
    if (profileData.email.trim()) submissionData.email = profileData.email;
    if (profileData.password.trim()) submissionData.password = profileData.password;

    // Only proceed if there's something to update
    if (Object.keys(submissionData).length > 0) {
      axios.put('/api/accounts/profile/', submissionData, {
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
    } else {
      alert('No changes detected.');
      navigate('/profile');
      
    }
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
          New Password: 
          <input
            type="password"
            name="password"
            value={profileData.password}
            onChange={handleChange}
          />
        </label>
        <button type="submit">Update Profile</button>
      </form>
    </div>
  );
};

export default ProfileComponent;