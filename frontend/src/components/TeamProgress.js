import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCheckCircle, FaExclamationCircle, FaCalendarAlt, FaGithub, FaComments, FaUsers, FaCodeBranch } from 'react-icons/fa';
import FeedbackModal from './FeedbackModal'
import './TeamProgress.css';

function TeamProgress() {
    const navigate = useNavigate();
    const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
    const [selectedMilestone, setSelectedMilestone] = useState(null);
    const [teamDetails] = useState({
        teamName: "Team 13",
        members: [
            { name: "Deepanshu Pathak", email: "21f3001217@ds.study.iitm.ac.in" },
            { name: "Saarthak Saran", email: "21f3001154@ds.study.iitm.ac.in" },
            { name: "Prachi Tiwari", email: "21f2001019@ds.study.iitm.ac.in" },
            { name: "Aditya Singh", email: "22f1000873@ds.study.iitm.ac.in" },
            { name: "Abhijeet Garg", email: "21f1003267@ds.study.iitm.ac.in" },
            { name: "Himanshu Kumar", email: "21f3001746@ds.study.iitm.ac.in" }
        ],
        githubRepo: "https://github.com/team-13/project-repo",
    });

    const [milestones] = useState([
        { id: 1, title: "Milestone 1", status: "Completed", dueDate: "2024-10-01" },
        { id: 2, title: "Milestone 2", status: "Not Submitted", dueDate: "2024-11-01" },
        { id: 3, title: "Milestone 3", status: "In Progress", dueDate: "2024-12-01" }
    ]);

    const [githubActivity] = useState([
        { type: "Push", description: "2 commits pushed to main", date: "2024-11-03", branch: "main" },
        { type: "Pull Request", description: "Merged pull request #07", date: "2024-11-02", branch: "feature/new-feature" },
        { type: "Issue", description: "Created issue #07 - Update README.md", date: "2024-10-31", branch: "" }
    ]);

    const openFeedbackModal = (milestone) => {
        setSelectedMilestone(milestone);
        setIsFeedbackModalOpen(true);
    };

    const closeFeedbackModal = () => {
        setIsFeedbackModalOpen(false);
    };

    return (
        <div className="team-progress-container">
            <header className="team-progress-header">
                <h1>{teamDetails.teamName} - Project Progress</h1>
                <a href={teamDetails.githubRepo} target="_blank" rel="noopener noreferrer" className="github-link">
                    <FaGithub />&nbsp; GitHub Repository
                </a>
            </header>

            <section className="team-section">
                <h2><FaUsers /> Team Members</h2>
                <ul className="team-list">
                    {teamDetails.members.map((member, index) => (
                        <li key={index}>
                            <span className="team-member-name">{member.name}</span>
                            <span className="team-member-email">{member.email}</span>
                        </li>
                    ))}
                </ul>
            </section>

            <section className="milestone-section">
    <h2>Milestones</h2>
    <div className="milestone-grid">
        {milestones.map((milestone) => (
            <div key={milestone.id} className={`milestone-card ${milestone.status.toLowerCase().replace(" ", "-")}`}>
                <h3>{milestone.title}</h3>
                <div className="milestone-details">
                    {milestone.status === "Completed" ? (
                        <span><FaCheckCircle className="completed-icon" /> {milestone.status}</span>
                    ) : milestone.status === "Not Submitted" ? (
                        <span className="not-submitted"><FaExclamationCircle /> {milestone.status}</span>
                    ) : (
                        <div>
                            <span className="in-progress"><FaExclamationCircle className="in-progress-icon" /> {milestone.status}</span>
                        </div>
                    )}
                    {milestone.status !== "Completed" && (
                        <span><FaCalendarAlt className="due-icon" /> Due: {milestone.dueDate}</span>
                    )}
                </div>
                <button className="feedback-button" onClick={() => openFeedbackModal(milestone)}>
                    <FaComments /> Feedback
                </button>
            </div>
        ))}
    </div>
</section>

            <section className="github-activity-section">
                <h2>Recent GitHub Activity</h2>
                <ul className="github-activity-list">
                    {githubActivity.map((activity, index) => (
                        <li key={index} className="activity-item">
                            <div className="activity-details">
                                <FaCodeBranch className="activity-icon" />
                                <div>
                                    <p className="activity-description"><strong>{activity.type}:</strong> {activity.description}</p>
                                    <p className="activity-branch">Branch: {activity.branch || "N/A"}</p>
                                </div>
                            </div>
                            <span className="activity-date">{activity.date}</span>
                        </li>
                    ))}
                </ul>
            </section>

            <FeedbackModal
                isOpen={isFeedbackModalOpen}
                onClose={closeFeedbackModal}
                milestone={selectedMilestone}
            />

        </div>
    );
}

export default TeamProgress;
