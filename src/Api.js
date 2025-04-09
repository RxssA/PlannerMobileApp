const API_URL = "http://192.168.0.23:5000/api";

const handleResponse = async (response) => {
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.error || `HTTP error! status: ${response.status}`;
        throw new Error(errorMessage);
    }
    const data = await response.json();
    return { data }; 
};

// Auth
export const login = (credentials) => 
    fetch(`${API_URL}/users/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
    }).then(handleResponse);

export const createUser = (data) => 
    fetch(`${API_URL}/users/create`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    }).then(handleResponse);

// Activities
export const createActivity = (data, token) => 
    fetch(`${API_URL}/activities/create`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data),
    }).then(handleResponse);

export const getActivities = (token) => 
    fetch(`${API_URL}/activities/list`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    }).then(handleResponse);

export const updateActivity = (id, data, token) => 
    fetch(`${API_URL}/activities/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data),
    }).then(handleResponse);

export const deleteActivity = (id, token) => 
    fetch(`${API_URL}/activities/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    }).then(handleResponse);

// Todos
export const getTodos = (token) => 
    fetch(`${API_URL}/todos/list`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    }).then(handleResponse);

export const createTodo = (data, token) => 
    fetch(`${API_URL}/todos/create`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data),
    }).then(handleResponse);

export const updateTodo = (id, data, token) => 
    fetch(`${API_URL}/todos/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data),
    }).then(handleResponse);

export const deleteTodo = (id, token) => 
    fetch(`${API_URL}/todos/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    }).then(handleResponse);

// Chat
export const getChatMessages = (activityId, token) => 
    fetch(`${API_URL}/chat/${activityId}/messages`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    }).then(handleResponse);

export const sendChatMessage = (activityId, message, token) => 
    fetch(`${API_URL}/chat/${activityId}/messages`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(message),
    }).then(handleResponse);

// Notifications
export const scheduleNotification = (data, token) => 
    fetch(`${API_URL}/notifications/schedule`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data),
    }).then(handleResponse);

export const getNotifications = (token) => 
    fetch(`${API_URL}/notifications/list`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    }).then(handleResponse);

export const updateNotification = (id, data, token) => 
    fetch(`${API_URL}/notifications/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data),
    }).then(handleResponse);


    //setting up all endpoints here make it easier to manage them
/*export const createActivity = (data) => axios.post(`${API_URL}/activities/create`, data);
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
export const updateNotification = (id, data) => axios.put(`${API_URL}/notifications/${id}`, data);*/