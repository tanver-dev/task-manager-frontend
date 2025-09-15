import axios from "axios";
const api = axios.create({
  baseURL: "https://task-manager-6d5m.onrender.com/api",
  withCredentials: true,
});
export default api;
