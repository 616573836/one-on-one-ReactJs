import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ProfileComponent = () => {
  const [profileData, setProfileData] = useState({ email: '', password: '' });
  const [selectedImage, setSelectedImage] = useState(null); // New state for image
  const [previewUrl, setPreviewUrl] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // Store the Base64 string in localStorage
        localStorage.setItem('profileImage', reader.result);
        setPreviewUrl(reader.result); // Update the previewUrl state to show the image
      };
      reader.readAsDataURL(file); // This converts the image file to a Base64 string
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    if (profileData.email.trim()) formData.append('email', profileData.email);
    if (profileData.password.trim()) formData.append('password', profileData.password);
    if (selectedImage) formData.append('image', selectedImage); // Append the selected image
    
    // Only proceed if there's something to update
    if (formData.has('email') || formData.has('password') || formData.has('image')) {
      axios.put('/api/accounts/profile/', formData, { // Ensure the endpoint and method align with your backend's expectations
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          // 'Content-Type': 'application/json' // This is not needed when sending FormData; axios sets the correct content type for FormData
        }
      })
      .then(response => {
        alert('Profile updated successfully.');
        navigate('/profile');
      })
      .catch(error => console.error('There was an error updating the profile: ', error));
    } else {
      navigate('/profile');

    }
  };

  return (
    <div>
      <h1>Edit Profile</h1>
      <form style={styles.buttonContainer} onSubmit={handleSubmit}>
        <label>
          Email:
          <input
            style={styles.input}
            type="email"
            name="email"
            value={profileData.email}
            onChange={handleChange}
          />
        </label>
        <label>
          New Password: 
          <input
            style={styles.input}
            type="password"
            name="password"
            value={profileData.password}
            onChange={handleChange}
          />
        </label>
        <div>
          <label htmlFor="imageUpload">Profile Picture:</label>
          <input
            type="file"
            id="imageUpload"
            onChange={handleImageChange}
            accept="image/*" // Accept images only
          />
          <p></p>

        </div>
        <button style={styles.button}type="submit">Update Profile</button>
      </form>
      {previewUrl && (
  <div style={{ display: 'flex',marginLeft: '530px', marginTop: '110px' }}>
    <img src={previewUrl} alt="Preview" style={{ width: '300px', height: '400px', objectFit: 'cover' }} />
    <div style = {{marginTop: '150px', marginLeft: '80px'}}>
    <p >This is preview img</p>
    </div>
  </div>
)}
    </div>
  );
};

const styles = {
  
  container: {
      padding: '20px',
      fontFamily: 'Arial, sans-serif',
  },
  form: {
      marginBottom: '20px',
  },
  input: {
      marginRight: '10px',
      padding: '10px',
      border: '1px solid #666',
      borderRadius: '4px',
      width: '200px',
      marginBottom: '10px'
      
  },
  button: {
    marginLeft: '90px'
      
  },
  meetingList: {
      marginTop: '20px',
  },
  meetingItem: {
      borderBottom: '1px solid #eee',
      paddingBottom: '10px',
      marginBottom: '10px',
  },
  detailButton: {
      padding: '10px 20px',
      textDecoration: 'none',
      transition: 'all 0.5s',
      textAlign: 'center',
      display: 'inline-block',
      marginTop: '10px',
      marginRight: '5px',
      marginLeft: '5px',
      marginBottom: '5px',
      fontSize: '16px',
      cursor: 'pointer',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      backgroundColor: '#007bff',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '0px',
    marginTop: '150px',
    marginLeft: '500px',
    alignItems: 'flex-start',
    marginBottom: '0px'
  }
};

export default ProfileComponent;