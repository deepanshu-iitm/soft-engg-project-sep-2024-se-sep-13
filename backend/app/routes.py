from flask import Blueprint
from flask_restful import Api
from app.controllers.user_controller import UserRegister, UserLogin, UserProfile
from app.controllers.project_controller import ProjectList, ProjectDetail
from app.controllers.milestone_controller import MilestoneList, MilestoneDetail
from app.controllers.github_controller import github_bp

api_bp = Blueprint('api', __name__)
api = Api(api_bp)

api_bp.register_blueprint(github_bp)

# User routes
api.add_resource(UserRegister, '/register')
api.add_resource(UserLogin, '/login')
api.add_resource(UserProfile, '/user/profile')

# Project routes
api.add_resource(ProjectList, '/projects')
api.add_resource(ProjectDetail, '/projects/<int:project_id>')

# Milestone routes
api.add_resource(MilestoneList, '/projects/<int:project_id>/milestones')
api.add_resource(MilestoneDetail, '/projects/<int:project_id>/milestones/<int:milestone_id>')
