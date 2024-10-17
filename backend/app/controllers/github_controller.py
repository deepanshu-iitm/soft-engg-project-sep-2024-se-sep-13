import os
import requests
from flask import Blueprint, request, redirect, jsonify, session

github_bp = Blueprint('github', __name__)

CLIENT_ID = os.getenv('GITHUB_CLIENT_ID')
CLIENT_SECRET = os.getenv('GITHUB_CLIENT_SECRET')
REDIRECT_URI = os.getenv('GITHUB_REDIRECT_URI')

@github_bp.route('/github/login')
def github_login():
    """Redirect user to GitHub for login."""
    github_auth_url = f"https://github.com/login/oauth/authorize?client_id={CLIENT_ID}&redirect_uri={REDIRECT_URI}&scope=repo"
    return redirect(github_auth_url)

@github_bp.route('/github/callback')
def github_callback():
    """GitHub redirects back with a code, exchange it for access token."""
    code = request.args.get('code')
    token_url = "https://github.com/login/oauth/access_token"
    headers = {'Accept': 'application/json'}
    payload = {
        'client_id': CLIENT_ID,
        'client_secret': CLIENT_SECRET,
        'code': code,
        'redirect_uri': REDIRECT_URI
    }
    
    token_response = requests.post(token_url, headers=headers, data=payload)
    token_json = token_response.json()
    access_token = token_json.get('access_token')

    if access_token:
        session['github_token'] = access_token
        return jsonify({"message": "GitHub account linked!", "access_token": access_token}), 200
    else:
        return jsonify({"error": "GitHub authentication failed!"}), 400
