import axios from "axios";

const API_URL = "http://localhost:8000/api/"; // Replace with your backend URL

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add an interceptor to include the auth token if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken"); // Or wherever you store your token
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`; // Adjust based on your auth type
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// --- Authentication Endpoints (Example for JWT Obtain Pair) ---
// Adjust the endpoint URL based on your backend's URL configuration
export const login = (credentials) => {
  // Assuming your backend has a /api/token/ endpoint for getting JWTs
  return api.post("token/", credentials);
};

export const refreshToken = (refreshToken) => {
  // Assuming your backend has a /api/token/refresh/ endpoint for refreshing JWTs
  return api.post("token/refresh/", { refresh: refreshToken });
};

// --- Task Endpoints ---
export const getTasks = (filters = {}) => {
  return api.get("tasks/", { params: filters });
};

export const getTask = (taskId) => {
  return api.get(`tasks/${taskId}/`);
};

export const createTask = (taskData) => {
  return api.post("tasks/", taskData);
};

export const updateTask = (taskId, taskData) => {
  return api.put(`tasks/${taskId}/`, taskData);
};

export const deleteTask = (taskId) => {
  return api.delete(`tasks/${taskId}/`);
};

// --- Category, Priority, State Endpoints ---
export const getCategories = () => {
  return api.get("categories/");
};

export const getPriorities = () => {
  return api.get("priorities/");
};

export const getTaskStates = () => {
  return api.get("states/");
};

// --- Task File Endpoints ---
export const uploadTaskFile = (taskId, formData) => {
  return api.post(`tasks/${taskId}/files/`, formData, {
    headers: {
      "Content-Type": "multipart/form-data", // Important for file uploads
    },
  });
};

export const deleteTaskFile = (fileId) => {
  return api.delete(`files/${fileId}/`);
};

// --- Authentication Endpoints (Example - Adjust based on your backend) ---
// export const login = (credentials) => {
//   return api.post('token/', credentials); // Example for JWT Obtain Pair
// };

// export const refreshToken = (refreshToken) => {
//   return api.post('token/refresh/', { refresh: refreshToken }); // Example for JWT Refresh
// };

export default api;
