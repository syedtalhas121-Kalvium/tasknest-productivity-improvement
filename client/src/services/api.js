const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const parseResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || 'Request failed');
  }
  return response.status === 204 ? null : response.json();
};

export const fetchTasks = async () => {
  const response = await fetch(`${API_URL}/tasks`);
  return parseResponse(response);
};

export const createTask = async (title, important = false) => {
  const response = await fetch(`${API_URL}/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, important })
  });
  return parseResponse(response);
};

export const updateTask = async (id, changes) => {
  const response = await fetch(`${API_URL}/tasks/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(changes)
  });
  return parseResponse(response);
};

export const updateTaskStatus = async (id, completed) => updateTask(id, { completed });

export const updateTaskImportance = async (id, important) => updateTask(id, { important });

export const deleteTaskFromApi = async (id) => {
  const response = await fetch(`${API_URL}/tasks/${id}`, { method: 'DELETE' });
  return parseResponse(response);
};

export const fetchScore = async () => {
  const response = await fetch(`${API_URL}/score`);
  return parseResponse(response);
};
