from flask_restful import Resource
from flask import request
from app.models import User, db
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity

class UserRegister(Resource):
    def post(self):
        data = request.get_json()

        hashed_password = generate_password_hash(data['password'])

        new_user = User(
            name=data['name'],
            email=data['email'],
            password_hash=hashed_password,
            role=data['role'] 
        )

        db.session.add(new_user)
        db.session.commit()

        return {"message": "User registered successfully!"}, 201

class UserLogin(Resource):
    def post(self):
        data = request.get_json()  

        user = User.query.filter_by(email=data['email']).first()

        if user and check_password_hash(user.password_hash, data['password']):
            access_token = create_access_token(identity=user.id)
            return {"access_token": access_token, 'role': user.role}, 200
        else:
            return {"message": "Invalid credentials"}, 401
        
class UserProfile(Resource):
    @jwt_required()
    def get(self):
        user_id = get_jwt_identity() 
        user = User.query.get_or_404(user_id)
        return {
            'id': user.id,
            'name': user.name, 
            'role': user.role  
        }, 200
