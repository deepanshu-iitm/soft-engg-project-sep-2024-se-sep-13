import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; 
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './components/HomePage';
import AuthPage from './components/AuthPage';
import StudentDashboard from './components/StudentDashboard';
import InstructorDashboard from './components/InstructorDashboard';
import './App.css';

const App = () => {
  return (
    <Router>
      <Navbar />
      <main> 
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/signup-login" element={<AuthPage />} />
          <Route path="/Student-dashboard" element={<StudentDashboard />} />
          <Route path="/Instructor-dashboard" element={<InstructorDashboard />} />
          {/* Add additional routes */}
        </Routes>
      </main>
      <Footer />
    </Router>
  );
};

export default App;
