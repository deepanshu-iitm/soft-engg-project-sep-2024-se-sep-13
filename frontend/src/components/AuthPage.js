import React, { useState } from 'react';
import { FaGithub } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import './AuthPage.css';

const AuthPage = () => {
  const [isSignup, setIsSignup] = useState(false); 
  const [role, setRole] = useState('student');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRoleChange = (newRole) => {
    setRole(newRole);
  };

  const toggleAuthMode = () => {
    setIsSignup((prevMode) => !prevMode);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isSignup) {
        const response = await axios.post('http://127.0.0.1:5000/api/register', {
          name,
          email,
          password,
          role,
        });
        alert(response.data.message); 
      } else {
        const response = await axios.post('http://127.0.0.1:5000/api/login', {
          email,
          password,
        });
        const { access_token, role } = response.data;

        localStorage.setItem('token', access_token);

        if (role === 'instructor') {
          navigate('/instructor-dashboard');
        } else if (role === 'student') {
          navigate('/student-dashboard');
        }
      }
    } catch (error) {
      console.error('Authentication failed', error);
      alert('Authentication failed. Please check your credentials.');
    }
  };

  const handleGithubLogin = (e) => {
    e.preventDefault();
    console.log('GitHub login logic goes here');
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="role-selection">
          <button 
            className={`role-btn ${role === 'student' ? 'active' : ''}`}
            onClick={() => handleRoleChange('student')}
          >
            Student
          </button>
          <button 
            className={`role-btn ${role === 'instructor' ? 'active' : ''}`}
            onClick={() => handleRoleChange('instructor')}
          >
            Instructor
          </button>
        </div>

        <h2>{isSignup ? `Sign Up as ${role.charAt(0).toUpperCase() + role.slice(1)}` : `Login as ${role.charAt(0).toUpperCase() + role.slice(1)}`}</h2>

        <form className="auth-form" onSubmit={handleSubmit}>
          {isSignup && (
            <div className="form-group">
              <label>Name</label>
              <input 
                type="text" 
                placeholder="Enter your name" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                required 
              />
            </div>
          )}
          <div className="form-group">
            <label>Email</label>
            <input 
              type="email" 
              placeholder="Enter your email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input 
              type="password" 
              placeholder="Enter your password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>

          <button type="submit" className="auth-btn">
            {isSignup ? 'Sign Up' : 'Login'}
          </button>
        </form>

        <div className="divider">OR</div>

        <button className="github-btn" onClick={handleGithubLogin}>
          <FaGithub className="github-icon" />
          {isSignup ? 'Sign Up with GitHub' : 'Login with GitHub'}
        </button>

        <p className="toggle-link">
          {isSignup ? 'Already have an account?' : 'Don’t have an account?'}{' '}
          <span onClick={toggleAuthMode}>
            {isSignup ? 'Login' : 'Sign Up'}
          </span>
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
