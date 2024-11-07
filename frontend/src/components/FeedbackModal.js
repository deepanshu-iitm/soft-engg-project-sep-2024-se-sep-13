import React, { useState } from 'react';
import { FaRobot, FaTimesCircle, FaPaperPlane, FaUserEdit } from 'react-icons/fa';
import './FeedbackModal.css';

function FeedbackModal({ isOpen, onClose, milestone }) {
    const [instructorFeedback, setInstructorFeedback] = useState("");
    const [aiFeedback, setAiFeedback] = useState("");
    
    const generateAIFeedback = () => {
        setAiFeedback("AI Suggestion: Consider further optimization in milestone 2 for performance and readability improvements.");
    };

    const handleInstructorFeedbackSubmit = () => {
        if (instructorFeedback.trim() === "") return;
        alert("Instructor feedback has been submitted successfully!");
        setInstructorFeedback("");
    };

    if (!isOpen || !milestone) return null;

    return (
        <div className="feedback-modal-overlay">
            <div className="feedback-modal-content animated">
                <button className="modal-close-button" onClick={onClose}>
                    <FaTimesCircle />
                </button>
                <h2>Feedback for {milestone.title}</h2>

                <div className="feedback-section">
                    <h3><FaUserEdit /> Instructor Feedback</h3>
                    <textarea
                        className="feedback-input"
                        placeholder="Enter instructor feedback here..."
                        value={instructorFeedback}
                        onChange={(e) => setInstructorFeedback(e.target.value)}
                    />
                    <button className="submit-feedback-button" onClick={handleInstructorFeedbackSubmit}>
                        <FaPaperPlane /> Submit Feedback
                    </button>
                </div>

                <hr className="section-divider" />

                <div className="feedback-section">
                    <h3><FaRobot /> AI Suggestions</h3>
                    <button className="ai-feedback-button" onClick={generateAIFeedback}>
                        Generate AI Feedback
                    </button>
                    {aiFeedback && <p className="feedback-content ai-feedback">{aiFeedback}</p>}
                </div>
            </div>
        </div>
    );
}

export default FeedbackModal;
