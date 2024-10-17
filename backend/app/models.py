from . import db

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(512))
    role = db.Column(db.String(10))  # student/instructor

    def __repr__(self):
        return f"<User {self.name}>"

class Project(db.Model):
    __tablename__ = 'projects'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    instructor_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    start_date = db.Column(db.DateTime)
    end_date = db.Column(db.DateTime)

    instructor = db.relationship('User', backref='projects')

    def __repr__(self):
        return f"<Project {self.name}>"

class Milestone(db.Model):
    __tablename__ = 'milestones'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    project_id = db.Column(db.Integer, db.ForeignKey('projects.id'))
    deadline = db.Column(db.DateTime)
    status = db.Column(db.String(10))  # pending/completed

    project = db.relationship('Project', backref='milestones')

    def __repr__(self):
        return f"<Milestone {self.name}>"
