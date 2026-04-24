import axios from "axios";

const API = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api`,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to attach token
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  signup: (data) => API.post("/auth/signup", data),
  login: (data) => API.post("/auth/login", data),
  logout: () => API.post("/auth/logout"),
  getMe: () => API.get("/auth/me"),
};

// Posts API
export const postsAPI = {
  getAll: (params) => API.get("/posts", { params }),
  getOne: (id) => API.get(`/posts/${id}`),
  create: (data) => API.post("/posts", data),
  delete: (id) => API.delete(`/posts/${id}`),
  upvote: (id) => API.put(`/posts/${id}/upvote`),
  downvote: (id) => API.put(`/posts/${id}/downvote`),
  addComment: (id, data) => API.post(`/posts/${id}/comments`, data),
};

export default API;
