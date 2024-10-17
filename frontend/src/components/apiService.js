import axios from 'axios';

const API_URL = 'http://localhost:5000/api'; 

export const getUserProfile = async () => {
  try {
    const response = await axios.get(`${API_URL}/user/profile`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`, 
      },
    });
    return response.data; 
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null; 
  }
};

export const getProjects = async () => {
  const response = await axios.get(`${API_URL}/projects`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`, 
    },
  });
  return response.data;
};

export const createProject = async (projectData) => {
  const response = await axios.post(`${API_URL}/projects`, projectData, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
  return response.data;
};

export const getMilestones = async (projectId) => {
  const response = await axios.get(`${API_URL}/projects/${projectId}/milestones`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
  return response.data;
};

export const createMilestone = async (projectId, milestoneData) => {
  const response = await axios.post(`${API_URL}/projects/${projectId}/milestones`, milestoneData, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
  return response.data;
};

export const logout = () => {
  localStorage.removeItem('token'); 
};

