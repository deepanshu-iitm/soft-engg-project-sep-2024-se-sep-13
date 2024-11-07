import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaCalendarAlt, FaCheckCircle, FaEdit, FaTrashAlt } from 'react-icons/fa';
import './ProjectDetail.css';

function ProjectDetail() {
    const { projectId } = useParams();
    const [projectDetails, setProjectDetails] = useState({
        title: "Project Title",
        description: "An in-depth description of the project, highlighting its goals and importance.",
        milestones: [
            { id: 1, title: "Milestone 1", description: "Description of the milestone.", dueDate: "2024-10-01" },
            { id: 2, title: "Milestone 2", description: "Description of the milestone.", dueDate: "2024-11-01" },
            { id: 3, title: "Milestone 3", description: "Description of the milestone.", dueDate: "2024-12-01" }
        ],
        assignedTeams: ["Team 1", "Team 2"]
    });
    const [availableTeams, setAvailableTeams] = useState(["Team 3", "Team 4", "Team 5", "Team 6", "Team 7", "Team 8"]);

    const handleAssignTeam = (team) => {
        setProjectDetails((prevDetails) => ({
            ...prevDetails,
            assignedTeams: [...prevDetails.assignedTeams, team]
        }));
    };

    return (
        <div className="project-detail">
            <header className="dashboard-header">
                <h1 className="project-title">{projectDetails.title}</h1>
                <p className="project-description">{projectDetails.description}</p>
            </header>

            <section className="milestones-section">
                <h2>Milestones</h2>
                <div className="project-grid">
                    {projectDetails.milestones.map((milestone) => (
                        <div key={milestone.id} className="project-card">
                            <div className="project-card-header">
                                <h3>{milestone.title}</h3>
                                <div className="project-card-actions">
                                    <FaEdit className="action-icon" title="Edit Milestone" />
                                    <FaTrashAlt className="action-icon" title="Delete Milestone" />
                                </div>
                            </div>
                            <p className="project-card-description">{milestone.description}</p>
                            <p className="project-card-meta"><FaCalendarAlt /> &nbsp; Due: {milestone.dueDate}</p>
                        </div>
                    ))}
                </div>
            </section>

            <section className="teams-section">
                <h2>Assigned Teams</h2>
                <div className="teams-list assigned-teams">
                    {projectDetails.assignedTeams.map((team, index) => (
                        <Link key={index} to={`/team-progress/${team}`} className="team-name">
                            <FaCheckCircle className="assigned-icon" /> {team}
                        </Link>
                    ))}
                </div>
                <br/>
                <h2>Available Teams</h2>
                <div className="teams-list available-teams">
                    {availableTeams.map((team, index) => (
                        <div
                            key={index}
                            className={`team-item ${projectDetails.assignedTeams.includes(team) ? "assigned" : ""}`}
                            onClick={() => !projectDetails.assignedTeams.includes(team) && handleAssignTeam(team)}
                        >
                            {team}
                            {projectDetails.assignedTeams.includes(team) && <FaCheckCircle className="assigned-icon" />}
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}

export default ProjectDetail;
