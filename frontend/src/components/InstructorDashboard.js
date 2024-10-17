import React, { useEffect, useState } from 'react';
import { getProjects, getUserProfile, logout } from './apiService'; 
import './InstructorDashboard.css';

const InstructorDashboard = () => {
  const [projects, setProjects] = useState([]);
  const [instructorName, setInstructorName] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const userProfile = await getUserProfile();
      if (userProfile) {
        setInstructorName(userProfile.name); 
      }
      const data = await getProjects();
      setProjects(data); 
    };
    fetchData();
  }, []);

  const handleLogout = () => {
    logout(); 
    window.location.href = '/signup-login'; 
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Welcome, {instructorName || 'Instructor'}</h1> 
        <p>Manage your projects, track student progress, and set milestones</p>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </header>

      <div className="dashboard-content">
        <aside className="dashboard-sidebar">
          <ul>
            <li><a href="#projects">Projects</a></li>
            <li><a href="#milestones">Milestones</a></li>
            <li><a href="#student-progress">Student Progress</a></li>
          </ul>
        </aside>

        <main className="dashboard-main">
          <section id="projects" className="project-section">
            <h2>Your Projects</h2>
            {projects.length > 0 ? (
              <ul>
                {projects.map(project => (
                  <li key={project.id}>
                    {project.name} - {project.start_date} to {project.end_date}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No projects available.</p>
            )}
            <button className="cta-button">Create New Project</button>
          </section>

          <section id="milestones" className="milestone-section">
            <h2>Manage Milestones</h2>
            {/* Milestone management interface */}
          </section>

          <section id="student-progress" className="student-progress-section">
            <h2>Track Student Progress</h2>
            {/* Student progress list, GitHub integration, etc. */}
          </section>

          <section id="notifications" className="notifications-section">
            <h2>Notifications</h2>
            <p>No new notifications.</p>
            {/* Implement notifications system */}
          </section>
        </main>
      </div>
    </div>
  );
};

export default InstructorDashboard;
