import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { logout } from './apiService'; 
import './Navbar.css';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/signup-login');
  };

  const renderNavbarContent = () => {
    const path = location.pathname;

    if (path === '/signup-login') {
      return (
        <div className="navbar-container">
          <div className="navbar-logo">
            <Link to="/">ProjectTracker</Link>
          </div>
        </div>
      );
    }

    if (path.startsWith('/instructor-dashboard') || path.startsWith('/student-dashboard')) {
      return (
        <div className="navbar-container">
          <div className="navbar-logo">
            <Link to="/">ProjectTracker</Link>
          </div>
          <div className="navbar-signup">
          <button onClick={handleLogout} className="logout-btn">Logout</button>
          </div>
        </div>
      );
    }

    return (
      <div className="navbar-container">
        <div className="navbar-logo">
          <Link to="/">ProjectTracker</Link>
        </div>
        <ul className="navbar-links">
          <li><a href="#about">About</a></li>
          <li><a href="#features">Features</a></li>
          <li><a href="#testimonials">Testimonials</a></li>
        </ul>
        <div className="navbar-signup">
          <Link to="/signup-login" className="signup-btn">Sign Up / Login</Link>
        </div>
      </div>
    );
  };

  return (
    <nav className="navbar">
      {renderNavbarContent()}
    </nav>
  );
};

export default Navbar;
