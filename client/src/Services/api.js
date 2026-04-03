import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

API.interceptors.request.use((config) => {
  const userInfo = localStorage.getItem("pitchtalk_user");

  if (userInfo) {
    const parsedUser = JSON.parse(userInfo);

    if (parsedUser?.token) {
      config.headers.Authorization = `Bearer ${parsedUser.token}`;
    }
  }

  return config;
});

export default API;