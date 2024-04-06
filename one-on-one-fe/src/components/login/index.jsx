import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SignInComponent = () => {
    const navigate = useNavigate();
    

  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/api/token/', formData);
      localStorage.setItem('accessToken', response.data.access);

      navigate('/profile');
      // Redirect or show success message
    } catch (error) {
      console.error(error.response.data);
      // Show error message
    }
  };
  

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

        <h1>One on One</h1>
        <section className="u-clearfix u-section-1" id="sec-9364">
          <div className="u-clearfix u-sheet u-sheet-1">
            <div className="wrap">
            <div className="container">
            <div className="welcome">
            <h1>Sign in</h1>
    
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
          type="password"
          placeholder="Password"
          name="password"
          onChange={handleChange}
          value={formData.password}
          required
        />
        <p></p>
        <button type="submit">Sign In </button>
        <p></p>
        <button onClick={() => navigate('/signup')}>Sign up</button>
        </form>
      
      </div>
      </div>
      </div>
      </div>
        

      </section>
    <footer
  className="u-align-center u-clearfix u-footer u-grey-80 u-footer"
      id="sec-6d3f"
    >
      <div className="u-clearfix u-sheet u-valign-middle u-sheet-1">
        <p
          className="u-small-text u-text u-text-variant u-text-1"
          style={{ color: "white", fontSize: "1rem", letterSpacing: 0 }}
        >
          Copyright by Chuyue Zhang, Sirui Yu, Xuhui Chen, Xingrun Jiao{" "}
        </p>
      </div>
</footer>
  </>
  );
};

export default SignInComponent;