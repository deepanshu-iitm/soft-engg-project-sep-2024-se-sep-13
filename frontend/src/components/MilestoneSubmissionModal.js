import React, { useState } from 'react';
import { FaUpload, FaComments, FaPaperPlane, FaTimes } from 'react-icons/fa';
import './MilestoneSubmissionModal.css';

function MilestoneSubmissionModal({ isOpen, onClose }) {
    const [file, setFile] = useState(null);
    const [comments, setComments] = useState("");

    const handleFileChange = (e) => setFile(e.target.files[0]);
    const handleCommentChange = (e) => setComments(e.target.value);

    return (
        isOpen && (
            <div className="modal-overlay">
                <div className="modal-content">
                    <button className="close-modal-button" onClick={onClose}><FaTimes /></button>
                    <h2 className="modal-title">Milestone Submission</h2>
                    <p className="modal-subtitle">Submit your milestone file and add any notes for the instructor.</p>
                    <div className="modal-body">
                        <div className="file-upload-section">
                            <label htmlFor="file-upload" className="upload-button">
                                <FaUpload />&nbsp; Select File
                            </label>
                            <input id="file-upload" type="file" onChange={handleFileChange} hidden />
                            {file && <span className="file-name">{file.name}</span>}
                        </div>
                        <textarea
                            placeholder="Add comments or notes..."
                            value={comments}
                            onChange={handleCommentChange}
                            className="comment-box"
                        ></textarea>
                        <button onClick={() => alert("Milestone Submitted!")} className="submit-modal-button">
                            <FaPaperPlane />&nbsp; Submit Milestone
                        </button>
                    </div>
                </div>
            </div>
        )
    );
}

export default MilestoneSubmissionModal;
