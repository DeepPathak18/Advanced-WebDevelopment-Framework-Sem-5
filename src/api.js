const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const TOKEN_KEY = 'token';

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function saveToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

async function request(path, options = {}) {
  const token = getToken();
  const headers = { ...(options.headers || {}) };

  if (options.useAuth !== false && token) {
    headers.Authorization = `Bearer ${token}`;
  }

  if (options.body && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  let response;
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      ...options,
      headers,
    });
  } catch {
    throw new Error(
      "Cannot reach the API server. Start it from the server folder with `npm run dev`."
    );
  }

  let data = {};
  try {
    data = await response.json();
  } catch {
    data = {};
  }

  if (!response.ok) {
    if (options.useAuth !== false && response.status === 401) {
      clearToken();
      if (window.location.pathname !== '/login') {
        window.location.assign('/login?message=session-expired');
      }
    }

    const error = new Error(data.error || 'Request failed');
    error.status = response.status;
    throw error;
  }

  return data;
}

export async function getTasks() {
  return request('/tasks');
}

export async function createTask(task) {
  return request('/tasks', {
    method: 'POST',
    body: JSON.stringify(task),
  });
}

export async function updateTask(id, updates) {
  return request(`/tasks/${id}`, {
    method: 'PUT',
    body: JSON.stringify(updates),
  });
}

export async function deleteTask(id) {
  return request(`/tasks/${id}`, {
    method: 'DELETE',
  });
}

export async function register(email, password) {
  return request('/register', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
    useAuth: false,
  });
}

export async function login(email, password) {
  const data = await request('/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
    useAuth: false,
  });

  if (data.token) {
    saveToken(data.token);
  }

  return data;
}

export async function getMe() {
  return request('/me');
}
