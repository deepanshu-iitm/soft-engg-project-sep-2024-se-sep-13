import pytest
from app import create_app
from app.utils.db import db

@pytest.fixture
def client():
    app = create_app("testing")  
    app_context = app.app_context()
    app_context.push()

    db.create_all()  
    yield app.test_client()

    db.session.remove()
    db.drop_all()
    app_context.pop()

@pytest.fixture
def jwt_header(client):
    client.post('/auth/register', json={
        "username": "testinstructor",
        "email": "instructor@example.com",
        "password": "password123",
        "role": "instructor"
    })

    response = client.post('/auth/login', json={
        "email": "instructor@example.com",
        "password": "password123"
    })

    token = response.json["token"]
    return {"Authorization": f"Bearer {token}"}
