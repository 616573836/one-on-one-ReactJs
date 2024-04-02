import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const SignUpComponent = () => {
    const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Implement validation and error handling here
    try {
      const response = await axios.post('http://localhost:8000/api/accounts/register/', formData);
      
      console.log(response.data);
      navigate('/login');

      // Redirect or show success message
    } catch (error) {
      console.error(error.response.data);
      // Show error message
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          name="username"
          onChange={handleChange}
          value={formData.username}
          required
        />
        <input
          type="email"
          placeholder="Email"
          name="email"
          onChange={handleChange}
          value={formData.email}
          required
        />
        
        <input
          type="password"
          placeholder="Password"
          name="password"
          onChange={handleChange}
          value={formData.password}
          required
        />
        
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default SignUpComponent;