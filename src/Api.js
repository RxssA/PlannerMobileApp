import axios from 'axios';

const API_URL = "http://localhost:5000/api";

//endpoints
export const createActivity = (data) => axios.post(`${API_URL}/activities/create`, data);
export const getActivities = () => axios.get(`${API_URL}/activities/list`);
export const updateActivity = (id, data) => axios.put(`${API_URL}/activities/${id}`, data);
export const deleteActivity = (id) => axios.delete(`${API_URL}/activities/${id}`);
export const getTodos = () => axios.get(`${API_URL}/todos/list`);
export const createTodo = (data) => axios.post(`${API_URL}/todos/create`, data);
export const updateTodo = (id, data) => axios.put(`${API_URL}/todos/${id}`, data);
export const deleteTodo = (id) => axios.delete(`${API_URL}/todos/${id}`);
export const getChatMessages = (activityId) => axios.get(`${API_URL}/chat/${activityId}/messages`);
export const sendChatMessage = (activityId, message) => axios.post(`${API_URL}/chat/${activityId}/messages`, message);
export const scheduleNotification = (data) => axios.post(`${API_URL}/notifications/schedule`, data);
export const getNotifications = () => axios.get(`${API_URL}/notifications/list`);
export const updateNotification = (id, data) => axios.put(`${API_URL}/notifications/${id}`, data);
