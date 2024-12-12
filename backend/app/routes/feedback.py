from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.milestone import Milestone
from app.models.project import Project
from app.models.feedback import Feedback
from app.utils.db import db
from app.models.submission import Submission
import os
import requests
import re
import time
import fitz

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

    submission = milestone.submission[0]

    if not submission:
        return jsonify({"error": "No submission found for this milestone"}), 404

    file_url = f"https://soft-engg-project-sep-2024-se-sep-13-1.onrender.com/submission_folder/{submission.file_url}"

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



def truncate_input(input_text, max_tokens=2048):
    input_tokens = input_text.split()  
    if len(input_tokens) > max_tokens:
        input_tokens = input_tokens[:max_tokens]  
    truncated_input = " ".join(input_tokens)  
    return truncated_input

def download_file(url, download_folder="temp_folder"):
    
    if not os.path.exists(download_folder):
        os.makedirs(download_folder)

    local_filename = os.path.join(download_folder, url.split("/")[-1])
    
    with requests.get(url, stream=True) as r:
        r.raise_for_status()  
        with open(local_filename, 'wb') as f:
            for chunk in r.iter_content(chunk_size=8192):
                f.write(chunk)
    
    return local_filename

def extract_text_from_pdf(file_path):
    """
    Extract text from a PDF file.
    """
    doc = fitz.open(file_path)
    text = ""
    for page in doc:
        text += page.get_text()
    return text


def generate_ai_feedback_retry(payload, retries=3, max_delay=30):
    url = "https://api-inference.huggingface.co/models/facebook/opt-350m"
    headers = {
        "Authorization": f"Bearer {HUGGING_FACE_API_KEY}",
        "Content-Type": "application/json",
    }

    for attempt in range(retries):
        try:
            response = requests.post(url, headers=headers, json=payload)
            
            if response.status_code == 503:  
                print("Service Unavailable. Retrying...")
                time.sleep(10) 
                continue
            elif response.status_code != 200:
                print(f"Unexpected response {response.status_code}: {response.text}")
                return None
            
            response_data = response.json()
            if 'error' in response_data and 'Model too busy' in response_data['error']:
                wait_time = response_data.get('estimated_time', 10)
                print(f"Model is busy, retrying in {wait_time} seconds...")
                time.sleep(wait_time)  
                continue
            else:
                return response_data
        except requests.exceptions.RequestException as e:
            print(f"Error during AI feedback generation attempt {attempt+1}: {e}")
            time.sleep(2 ** attempt)  

    return None

@feedback_bp.route('/instructor/projects/<int:project_id>/milestones/<int:milestone_id>/ai-feedback', methods=['GET'])
@jwt_required()
def generate_ai_feedback(project_id, milestone_id):
    user_id = get_jwt_identity()

    milestone = Milestone.query.filter_by(id=milestone_id, project_id=project_id).first()
    if not milestone:
        return jsonify({"error": "Milestone not found"}), 404

    submission = Submission.query.filter_by(milestone_id=milestone_id).first()
    if not submission:
        return jsonify({"error": "No submission found for this milestone"}), 404

    file_url = f"https://soft-engg-project-sep-2024-se-sep-13-1.onrender.com/submission_folder/{submission.file_url}" 
    
    try:
        local_file_path = download_file(file_url)
    except requests.exceptions.RequestException as e:
        return jsonify({"error": f"Failed to download the file: {e}"}), 500

    if local_file_path.endswith('.pdf'):
        file_content = extract_text_from_pdf(local_file_path)
    else:
        return jsonify({"error": "Unsupported file format"}), 400

    input_text = f"""
        The following is a project milestone submission by a team. Provide detailed feedback with:
        1. What are the strengths of this submission?
        2. What are the weaknesses or areas for improvement?
        3. What suggestions can you provide to make this submission better?
    
        Document Content:
        {file_content}
    """

    input_text = truncate_input(input_text)

    payload = {
        "inputs": input_text,
        "parameters": {"max_length": 500, "temperature": 0.7},
    }

    response_data = generate_ai_feedback_retry(payload)

    if response_data is None:
        return jsonify({"error": "Failed to generate AI feedback after retries"}), 500

    ai_feedback = ""
    if isinstance(response_data, list):
        ai_feedback = response_data[0].get("generated_text", "")

 
    ai_feedback = re.sub(r'<[^>]*>', '', ai_feedback)

    feedback = Feedback(feedback=ai_feedback, milestone_id=milestone_id, is_ai_generated=True)
    db.session.add(feedback)
    db.session.commit()

    return jsonify({"message": "AI feedback generated", "feedback": ai_feedback}), 200
