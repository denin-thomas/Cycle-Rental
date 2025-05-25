import React, { useState } from 'react';
import './App.css';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';
import loginBackground from './login-bg.jpg'; // Import the image

function Login() {
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const { login } = useAuth(); // Access the login function from AuthContext
const handleSignupClick=()=>{
  navigate('/signup');
}
  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
    setErrorMessage('');
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
    setErrorMessage('');
  };

  const handleLoginSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch('http://localhost:3001/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Login successful');
        navigate(-1);
        login(); // Call the login function from AuthContext upon successful login
        // Redirect or perform other actions upon successful login
      } else {
        console.log('Login failed');
        setErrorMessage(data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Error during login:', error);
      setErrorMessage('An error occurred during login');
    }
  };

  return (
    <div className='login-div' >
      <br />
      <h1>Login</h1>
      <form onSubmit={handleLoginSubmit}>
        <input
          type="text"
          placeholder='Enter Username'
          value={username}
          className='form-control'
          onChange={handleUsernameChange}
        />

        <input
          type="password"
          className='form-control'
          placeholder='Enter Password'
          value={password}
          onChange={handlePasswordChange}
        />
        <h5 onClick={handleSignupClick}>Don't Have An Account?</h5>
        <button type="submit" className="btn btn-primary btn-block mb-4">
          Login
        </button>
        
      </form>

      {errorMessage && <p className="error-message">{errorMessage}</p>}
    </div>
  );
}

export default Login;
