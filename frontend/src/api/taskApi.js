import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true
});
export const createTask = (data) => {
  const formData = new FormData();
  formData.append("prompt", data.prompt);
  if (data.file) {
    formData.append("file", data.file);
  }

  return API.post("/tasks", formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });
};


export const fetchTasks = () => API.get("/tasks");

export const fetchTaskById = (id) => API.get(`/tasks/${id}`);


