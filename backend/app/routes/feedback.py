from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.milestone import Milestone
from app.models.project import Project
from app.models.feedback import Feedback
from app.utils.db import db
from app.models.submission import Submission
import os
import requests

HUGGING_FACE_API_KEY = os.getenv("HUGGING_FACE_API_KEY")

feedback_bp = Blueprint('feedback', __name__)

@feedback_bp.route('/instructor/projects/<int:project_id>/milestones/<int:milestone_id>/submission', methods=['GET'])
@jwt_required()
def get_submission(project_id, milestone_id):
    user_id = get_jwt_identity()
    milestone = Milestone.query.join(Milestone.parent_project).filter(
        Milestone.id == milestone_id,
        Milestone.project_id == project_id,
        Project.instructor_id == user_id
    ).first()

    if not milestone:
        return jsonify({"error": "Milestone not found"}), 404

    submission = milestone.submission

    if not submission:
        return jsonify({"error": "No submission found for this milestone"}), 404

    file_url = f"http://127.0.0.1:5000/submission_folder/{submission.file_url}"

    submission_data = {
        "content": submission.comments,
        "fileUrl": file_url,
    }

    return jsonify({"submission": submission_data}), 200



@feedback_bp.route('/instructor/projects/<int:project_id>/milestones/<int:milestone_id>/feedback', methods=['POST'])
@jwt_required()
def add_manual_feedback(project_id, milestone_id):
    data = request.get_json()
    feedback_content = data.get('feedback')

    if not feedback_content:
        return jsonify({"error": "Feedback content is required"}), 400

    user_id = get_jwt_identity()
    milestone = Milestone.query.join(Milestone.parent_project).filter(
        Milestone.id == milestone_id,
        Milestone.project_id == project_id,
        Project.instructor_id == user_id
    ).first()

    if not milestone:
        return jsonify({"error": "Milestone not found"}), 404

    feedback = Feedback(feedback=feedback_content, milestone_id=milestone_id, is_ai_generated=False)
    db.session.add(feedback)
    db.session.commit()

    return jsonify({"message": "Feedback successfully added", "feedback_id": feedback.id}), 201


@feedback_bp.route('/instructor/projects/<int:project_id>/milestones/<int:milestone_id>/ai-feedback', methods=['GET'])
@jwt_required()
def generate_ai_feedback(project_id, milestone_id):
    user_id = get_jwt_identity()

    # Step 1: Fetch milestone and validate
    milestone = Milestone.query.filter_by(id=milestone_id, project_id=project_id).first()
    if not milestone:
        return jsonify({"error": "Milestone not found"}), 404

    submission = milestone.submission

    if not submission:
        return jsonify({"error": "No submission found for this milestone"}), 404

    input_text = f"""
    The following is a document submission for a project milestone. Provide feedback with:
    1. Strengths.
    2. Weaknesses.
    3. Suggestions for improvement.

    Document Content:
    {submission.comments}
    """

    # Step 2: Send request to Hugging Face API
    headers = {
        "Authorization": f"Bearer {HUGGING_FACE_API_KEY}",
        "Content-Type": "application/json",
    }
    payload = {
        "inputs": input_text,
        "parameters": {"max_length": 500, "temperature": 0.7},
    }

    try:
        response = requests.post(
            "https://api-inference.huggingface.co/models/facebook/opt-350m",
            headers=headers,
            json=payload
        )
        response_data = response.json()
        ai_feedback = response_data.get("generated_text", "")

        # Step 3: Save AI feedback in the database
        feedback = Feedback(feedback=ai_feedback, milestone_id=milestone_id, is_ai_generated=True)
        db.session.add(feedback)
        db.session.commit()

        return jsonify({"message": "AI feedback generated", "feedback": ai_feedback}), 200

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": "Failed to generate AI feedback"}), 500
