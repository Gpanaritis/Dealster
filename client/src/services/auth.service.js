import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "http://localhost:3000/auth/";

const register = (username, email, password) => {
  return axios.post(API_URL + "register", {
    username,
    email,
    password,
  });
};

const login = async (email, password) => {
  const response = await axios.post(API_URL + "login", { email, password });
  if (response.data.accessToken) {
    localStorage.setItem("user", JSON.stringify(response.data));
  }
  return response.data;
};

const logout = () => {
  localStorage.removeItem("user");
};

const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem("user"));
};

const getUserSecure = async () => {
  const response = await axios.get(API_URL + `me`, { headers: authHeader() });
  return response.data;
};

const AuthService = {
  register,
  login,
  logout,
  getCurrentUser,
  getUserSecure,
};

export default AuthService;
