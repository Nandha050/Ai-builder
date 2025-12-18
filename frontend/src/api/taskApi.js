import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true
});

export const fetchTasks = () => API.get("/tasks");

export const fetchTaskById = (id) => API.get(`/tasks/${id}`);

export const createTask = (prompt, files = []) => {
  const formData = new FormData();
  formData.append("prompt", prompt);

  files.forEach((file) => {
    formData.append("files", file);
  });

  return API.post("/tasks", formData);
};