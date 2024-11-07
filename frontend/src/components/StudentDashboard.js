import React, { useState } from 'react';
import { FaCalendarAlt, FaGithub, FaCodeBranch } from 'react-icons/fa';
import MilestoneSubmissionModal from './MilestoneSubmissionModal';
import './StudentDashboard.css';

function StudentDashboard() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const studentName = "Student";
    const teamName = "Team 13";
    const milestones = [
        { id: 1, title: "Milestone 1", status: "Completed", dueDate: "2024-10-01", instructorFeedback: "Excellent work on the code structure and functionality. Keep up the good work!", aiFeedback: "Consider further optimization in milestone 2 for performance and readability improvements." },
        { id: 2, title: "Milestone 2", status: "Not Submitted", dueDate: "2024-11-01" },
        { id: 3, title: "Milestone 3", status: "In Progress", dueDate: "2024-12-01" },
    ];
    const githubRepo = "https://github.com/team-13/project-repo";
    const githubActivity = [
        { type: "Push", description: "2 commits pushed to main", date: "2024-11-03", branch: "main" },
        { type: "Pull Request", description: "Merged pull request #07", date: "2024-11-02", branch: "feature/new-feature" },
        { type: "Issue", description: "Created issue #07 - Update README.md", date: "2024-10-31", branch: "" }
    ];

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const currentDate = new Date();

    return (
        <div className="student-dashboard">
            <header className="student-dashboard-header">
                <h1>Welcome, <span>{studentName}</span></h1>
                <p>Team: {teamName}</p>
            </header>

            <section className="student-dashboard-project">
                <h2>Project Overview</h2>
                <p>Your project is active. Complete and submit each milestone to contribute to your final assessment..</p>
                <a href={githubRepo} target="_blank" rel="noopener noreferrer" className="github-link">
                    <FaGithub />&nbsp; GitHub Repository
                </a>
            </section>

            <section className="student-dashboard-milestones">
                <h2>Milestones</h2>
                <div className="milestone-grid">
                    {milestones.map((milestone) => {
                        const isPastDue = new Date(milestone.dueDate) < currentDate && milestone.status !== "Completed";
                        return (
                            <div key={milestone.id} className={`milestone-card ${milestone.status.toLowerCase().replace(" ", "-")}`}>
                                <h3>{milestone.title}</h3>
                                <span className={`status-tag ${milestone.status.toLowerCase().replace(" ", "-")}`}>{milestone.status}</span>
                                <p className="due-date"><FaCalendarAlt />&nbsp; Due: {milestone.dueDate}</p>
                                {milestone.status === "Completed" ? (
                                    <div className="feedback-section">
                                        <p><strong>Instructor Feedback:</strong> {milestone.instructorFeedback}</p>
                                        <p><strong>AI Feedback:</strong> {milestone.aiFeedback}</p>
                                    </div>
                                ) : (
                                    !isPastDue && (
                                        <button onClick={openModal} className="submit-button">Submit Milestone</button>
                                    )
                                )}
                                {isPastDue && <p className="due-warning">Past Due</p>}
                            </div>
                        );
                    })}
                </div>
            </section>

            <section className="student-dashboard-activity">
                <h2>GitHub Activity</h2>
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

            <MilestoneSubmissionModal isOpen={isModalOpen} onClose={closeModal} />
        </div>
    );
}

export default StudentDashboard;
