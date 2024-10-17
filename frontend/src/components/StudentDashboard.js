import React, { useEffect, useState } from 'react';
import { getProjects, getMilestones, getUserProfile, logout } from './apiService'; 
import './StudentDashboard.css';

const StudentDashboard = () => {
  const [projects, setProjects] = useState([]);
  const [milestones, setMilestones] = useState([]);
  const [githubProgress, setGithubProgress] = useState([]); 
  const [studentName, setStudentName] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const userProfile = await getUserProfile();
      if (userProfile) {
        setStudentName(userProfile.name);
      }
      const projectsData = await getProjects();
      setProjects(projectsData);
    };
    fetchData();
  }, []);

  const handleProjectClick = async (projectId) => {
    const data = await getMilestones(projectId);
    setMilestones(data);
  };

  const handleLogout = () => {
    logout();
    window.location.href = '/signup-login'; 
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Welcome, {studentName || 'Student'}</h1> 
        <p>Track your project milestones and coding progress</p>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </header>

      <div className="dashboard-content">
        <aside className="dashboard-sidebar">
          <ul>
            <li><a href="#milestones">Milestones</a></li>
            <li><a href="#github-progress">GitHub Progress</a></li>
            <li><a href="#tasks">Tasks</a></li>
          </ul>
        </aside>

        <main className="dashboard-main">
          <section id="milestones" className="milestone-section">
            <h2>Your Project Milestones</h2>
            {projects.map(project => (
              <div key={project.id} onClick={() => handleProjectClick(project.id)} className="project-card">
                <h3>{project.name}</h3>
                <p>Click to view milestones</p>
              </div>
            ))}
            {milestones.length > 0 ? (
              <ul>
                {milestones.map(milestone => (
                  <li key={milestone.id}>
                    {milestone.name} - {milestone.deadline}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No milestones available.</p>
            )}
          </section>

          <section id="github-progress" className="github-section">
            <h2>GitHub Progress</h2>
            {/* Render GitHub progress here */}
            <ul>
              {githubProgress.length > 0 ? (
                githubProgress.map(progress => (
                  <li key={progress.id}>
                    {progress.commitMessage} - {progress.date}
                  </li>
                ))
              ) : (
                <p>No GitHub progress found.</p>
              )}
            </ul>
          </section>

          <section id="tasks" className="tasks-section">
            <h2>Your Tasks</h2>
            {/* Task Summary or To-Do List */}
          </section>

          <section id="notifications" className="notifications-section">
            <h2>Notifications</h2>
            <p>No new notifications.</p>
            {/* Implement notification system */}
          </section>
        </main>
      </div>
    </div>
  );
};

export default StudentDashboard;
