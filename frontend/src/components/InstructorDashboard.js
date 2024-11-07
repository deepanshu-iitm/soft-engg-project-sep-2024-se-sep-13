import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaCalendarAlt, FaUsers, FaEdit, FaTrashAlt } from 'react-icons/fa';
import './InstructorDashboard.css';

function InstructorDashboard() {
    const navigate = useNavigate();
    const [instructorName, setInstructorName] = useState("Instructor");
    const [projects, setProjects] = useState([
        { id: 1, title: "", description: "", dueDate: "", teams: ["Team 1", "Team 2"] },
        { id: 2, title: "", description: "", dueDate: "", teams: ["Team 3"] },
        { id: 3, title: "", description: "", dueDate: "", teams: ["Team 4", "Team 5", "Team 6"] }
    ]);

    const handleProjectClick = (projectId) => {
        navigate(`/project-detail/${projectId}`);
    };

    return (
        <div className="instructor-dashboard">
            <header className="dashboard-header-instructor">
                <h1>Welcome, {instructorName}</h1>
                <a href="create-project"><button className="create-project-button">
                    <FaPlus /> New Project
                </button></a>
            </header>

            <section className="projects-section">
                <h2>Projects</h2>
                <div className="project-grid-instructor">
                    {projects.map((project) => (
                        <div className="project-card-instructor" key={project.id}>
                            <h3 onClick={() => handleProjectClick(project.id)} className="project-title-instructor">
                                {project.title || "Project Title"}
                            </h3>
                            <p className="project-description-instructor">{project.description || "Description goes here."}</p>
                            <div className="project-meta">
                                <span><FaCalendarAlt /> {project.dueDate || "Upcoming Milestone Deadline"}</span>
                            </div>
                            <div className="project-teams">
                                <FaUsers /> Teams:{" "}
                                {project.teams.map((team, index) => (
                                    <span key={index} className="team-name-instructor">{team}</span>
                                ))}
                            </div>
                            <div className="project-actions">
                                <FaEdit className="action-icon-instructor" title="Edit Project" />
                                <FaTrashAlt className="action-icon-instructor" title="Delete Project" />
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}

export default InstructorDashboard;
