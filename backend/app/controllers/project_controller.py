from flask_restful import Resource
from flask import request
from app.models import Project, db
from flask_jwt_extended import jwt_required, get_jwt_identity

class ProjectList(Resource):
    @jwt_required()
    def get(self):
        projects = Project.query.all()
        return [
            {
                'id': project.id,
                'name': project.name,
                'instructor_id': project.instructor_id,
                'start_date': project.start_date.isoformat() if project.start_date else None,
                'end_date': project.end_date.isoformat() if project.end_date else None
            }
            for project in projects
        ], 200

    @jwt_required()
    def post(self):
        data = request.get_json()
        new_project = Project(
            name=data['name'],
            instructor_id=get_jwt_identity(),
            start_date=data.get('start_date'),
            end_date=data.get('end_date')
        )
        db.session.add(new_project)
        db.session.commit()
        return {"message": "Project created successfully!"}, 201


class ProjectDetail(Resource):
    @jwt_required()
    def get(self, project_id):
        project = Project.query.get_or_404(project_id)
        return {
            'id': project.id,
            'name': project.name,
            'instructor_id': project.instructor_id,
            'start_date': project.start_date.isoformat() if project.start_date else None,
            'end_date': project.end_date.isoformat() if project.end_date else None
        }, 200

    @jwt_required()
    def put(self, project_id):
        project = Project.query.get_or_404(project_id)
        data = request.get_json()

        project.name = data.get('name', project.name)
        project.start_date = data.get('start_date', project.start_date)
        project.end_date = data.get('end_date', project.end_date)

        db.session.commit()
        return {"message": "Project updated successfully!"}, 200

    @jwt_required()
    def delete(self, project_id):
        project = Project.query.get_or_404(project_id)
        db.session.delete(project)
        db.session.commit()
        return {"message": "Project deleted successfully!"}, 204
