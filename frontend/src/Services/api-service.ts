import axios from "axios";

const axiosInstace = axios.create({
  baseURL: "https://edulearn-academy.onrender.com/api",
});

axiosInstace.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstace;
