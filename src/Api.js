const API_URL = "http://10.12.21.3:5000/api";

const handleResponse = async (response) => {
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return { data }; 
};

// Activities
export const createActivity = (data) => 
    fetch(`${API_URL}/activities/create`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    }).then(handleResponse);

export const getActivities = () => 
    fetch(`${API_URL}/activities/list`).then(handleResponse);

export const updateActivity = (id, data) => 
    fetch(`${API_URL}/activities/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    }).then(handleResponse);

export const deleteActivity = (id) => 
    fetch(`${API_URL}/activities/${id}`, {
        method: 'DELETE',
    }).then(handleResponse);

// Todos
export const getTodos = () => 
    fetch(`${API_URL}/todos/list`).then(handleResponse);

export const createTodo = (data) => 
    fetch(`${API_URL}/todos/create`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    }).then(handleResponse);

export const updateTodo = (id, data) => 
    fetch(`${API_URL}/todos/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    }).then(handleResponse);

export const deleteTodo = (id) => 
    fetch(`${API_URL}/todos/${id}`, {
        method: 'DELETE',
    }).then(handleResponse);

// Chat
export const getChatMessages = (activityId) => 
    fetch(`${API_URL}/chat/${activityId}/messages`).then(handleResponse);

export const sendChatMessage = (activityId, message) => 
    fetch(`${API_URL}/chat/${activityId}/messages`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
    }).then(handleResponse);

// Notifications
export const scheduleNotification = (data) => 
    fetch(`${API_URL}/notifications/schedule`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    }).then(handleResponse);

export const getNotifications = () => 
    fetch(`${API_URL}/notifications/list`).then(handleResponse);

export const updateNotification = (id, data) => 
    fetch(`${API_URL}/notifications/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
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