from flask_restful import Resource
from flask import request
from app.models import Milestone, db
from flask_jwt_extended import jwt_required

class MilestoneList(Resource):
    @jwt_required()
    def get(self, project_id):
        milestones = Milestone.query.filter_by(project_id=project_id).all()
        return [
            {
                'id': milestone.id,
                'name': milestone.name,
                'project_id': milestone.project_id,
                'deadline': milestone.deadline.isoformat() if milestone.deadline else None,
                'status': milestone.status
            }
            for milestone in milestones
        ], 200

    @jwt_required()
    def post(self, project_id):
        data = request.get_json()
        new_milestone = Milestone(
            name=data['name'],
            project_id=project_id,
            deadline=data.get('deadline'),
            status=data.get('status', 'pending')
        )
        db.session.add(new_milestone)
        db.session.commit()
        return {"message": "Milestone created successfully!"}, 201


class MilestoneDetail(Resource):
    @jwt_required()
    def get(self, project_id, milestone_id):
        milestone = Milestone.query.filter_by(project_id=project_id, id=milestone_id).first_or_404()
        return {
            'id': milestone.id,
            'name': milestone.name,
            'project_id': milestone.project_id,
            'deadline': milestone.deadline.isoformat() if milestone.deadline else None,
            'status': milestone.status
        }, 200

    @jwt_required()
    def put(self, project_id, milestone_id):
        milestone = Milestone.query.filter_by(project_id=project_id, id=milestone_id).first_or_404()
        data = request.get_json()

        milestone.name = data.get('name', milestone.name)
        milestone.deadline = data.get('deadline', milestone.deadline)
        milestone.status = data.get('status', milestone.status)

        db.session.commit()
        return {"message": "Milestone updated successfully!"}, 200

    @jwt_required()
    def delete(self, project_id, milestone_id):
        milestone = Milestone.query.filter_by(project_id=project_id, id=milestone_id).first_or_404()
        db.session.delete(milestone)
        db.session.commit()
        return {"message": "Milestone deleted successfully!"}, 204
