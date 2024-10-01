import React, { useState } from "react";
import './Navbar.css';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false); 
  
    const toggleDropdown = () => {
      setIsOpen(!isOpen); 
    };

    return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <a href="/">ProjectTracker</a>
        </div>
        <ul className="navbar-links">
          <li><a href="#features">Features</a></li>
          <li><a href="#testimonials">Testimonials</a></li>
          <li><a href="#pricing">Pricing</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
        <div className="navbar-signup">
          <a href="/signup-login" className="signup-btn">Sign Up / Login</a>
        </div>
      </div>
    </nav>
     );
};

export default Navbar;
