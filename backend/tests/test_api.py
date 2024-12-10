import pytest
from unittest.mock import patch

@pytest.fixture
def auth_headers(client):
    """Register and log in a user to get authentication headers."""
    client.post('/auth/register', json={
        'username': 'testuser',
        'email': 'testuser@example.com',
        'password': 'password123',
        'role': 'instructor'
    })
    response = client.post('/auth/login', json={
        'email': 'testuser@example.com',
        'password': 'password123'
    })
    token = response.get_json().get('token')
    return {'Authorization': f'Bearer {token}'}


# AUTH TESTS
def test_register_user(client):
    response = client.post('/auth/register', json={
        'username': 'testuser',
        'email': 'testuser@example.com',
        'password': 'password123',
        'role': 'student'
    })
    assert response.status_code == 201
    assert response.get_json() == {"message": "User successfully registered"}


def test_login_user(client):
    client.post('/auth/register', json={
        'username': 'testuser',
        'email': 'testuser@example.com',
        'password': 'password123',
        'role': 'student'
    })
    response = client.post('/auth/login', json={
        'email': 'testuser@example.com',
        'password': 'password123'
    })
    assert response.status_code == 200
    assert 'token' in response.get_json()


@patch('app.auth.github_oauth')
def test_github_login(mock_github_oauth, client):
    mock_github_oauth.return_value = {'token': 'github-oauth-token'}
    response = client.get('/auth/github')
    assert response.status_code == 200
    assert 'token' in response.get_json()


# PROJECT TESTS
def test_create_project(client, auth_headers):
    response = client.post('/instructor/projects', json={
        'title': 'Project 1',
        'description': 'Test project'
    }, headers=auth_headers)
    assert response.status_code == 201
    assert 'project_id' in response.get_json()


def test_get_projects(client, auth_headers):
    client.post('/instructor/projects', json={
        'title': 'Project 1',
        'description': 'Test project'
    }, headers=auth_headers)
    response = client.get('/instructor/projects', headers=auth_headers)
    assert response.status_code == 200
    assert isinstance(response.get_json(), list)


def test_update_project(client, auth_headers):
    project = client.post('/instructor/projects', json={
        'title': 'Original Project',
        'description': 'Original description'
    }, headers=auth_headers).get_json()
    response = client.put(f'/instructor/projects/{project["project_id"]}', json={
        'title': 'Updated Project',
        'description': 'Updated description'
    }, headers=auth_headers)
    assert response.status_code == 200


def test_delete_project(client, auth_headers):
    project = client.post('/instructor/projects', json={
        'title': 'Delete Project',
        'description': 'Temporary'
    }, headers=auth_headers).get_json()
    response = client.delete(f'/instructor/projects/{project["project_id"]}', headers=auth_headers)
    assert response.status_code == 204


# MILESTONE TESTS
def test_create_milestone(client, auth_headers):
    project = client.post('/instructor/projects', json={
        'title': 'Project 1',
        'description': 'Test project'
    }, headers=auth_headers).get_json()
    response = client.post(f'/instructor/projects/{project["project_id"]}/milestones', json={
        'title': 'Milestone 1',
        'description': 'Description',
        'due_date': '2024-12-31'
    }, headers=auth_headers)
    assert response.status_code == 201


def test_update_milestone(client, auth_headers):
    project = client.post('/instructor/projects', json={
        'title': 'Update Milestone Project',
        'description': 'Initial'
    }, headers=auth_headers).get_json()
    milestone = client.post(f'/instructor/projects/{project["project_id"]}/milestones', json={
        'title': 'Milestone 1',
        'description': 'To update',
        'due_date': '2024-12-31'
    }, headers=auth_headers).get_json()
    response = client.put(f'/instructor/projects/{project["project_id"]}/milestones/{milestone["milestone_id"]}', json={
        'title': 'Updated Milestone',
        'description': 'Updated description',
        'due_date': '2025-01-01'
    }, headers=auth_headers)
    assert response.status_code == 200


def test_delete_milestone(client, auth_headers):
    project = client.post('/instructor/projects', json={
        'title': 'Delete Milestone Project',
        'description': 'Test deletion'
    }, headers=auth_headers).get_json()
    milestone = client.post(f'/instructor/projects/{project["project_id"]}/milestones', json={
        'title': 'Delete Milestone',
        'description': 'To delete',
        'due_date': '2024-12-31'
    }, headers=auth_headers).get_json()
    response = client.delete(f'/instructor/projects/{project["project_id"]}/milestones/{milestone["milestone_id"]}', headers=auth_headers)
    assert response.status_code == 204


# FEEDBACK TESTS
def test_add_feedback(client, auth_headers):
    response = client.post('/instructor/projects/1/milestones/1/feedback', json={
        'feedback': 'Great job on this milestone!'
    }, headers=auth_headers)
    assert response.status_code in (201, 404)


def test_generate_ai_feedback(client, auth_headers):
    response = client.get('/instructor/projects/1/milestones/1/ai-feedback', headers=auth_headers)
    assert response.status_code in (200, 404)


# GITHUB TESTS
def test_get_team_commits(client, auth_headers):
    response = client.get('/instructor/teams/1/github/commits', headers=auth_headers)
    assert response.status_code in (200, 404)


def test_get_student_commits(client, auth_headers):
    response = client.get('/student/github/commits', headers=auth_headers)
    assert response.status_code in (200, 404)


# STUDENT TESTS
def test_get_student_projects(client, auth_headers):
    response = client.get('/student/projects', headers=auth_headers)
    assert response.status_code == 200


def test_get_student_milestones(client, auth_headers):
    response = client.get('/student/milestones', headers=auth_headers)
    assert response.status_code == 200


def test_submit_milestone(client, auth_headers):
    response = client.post('/student/milestones/1/submit', json={
        'submission_url': 'http://github.com/student/repo'
    }, headers=auth_headers)
    assert response.status_code in (201, 404)


def test_get_student_feedback(client, auth_headers):
    response = client.get('/student/feedback', headers=auth_headers)
    assert response.status_code == 200
