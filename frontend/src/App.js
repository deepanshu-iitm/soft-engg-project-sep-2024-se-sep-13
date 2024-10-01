import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './components/HomePage';


const App = () => {
  return (
    <Router>
      <div>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          {/* Add additional routes for About, Features, Testimonials, Contact pages */}
        </Routes>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
