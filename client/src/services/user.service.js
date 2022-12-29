import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "http://localhost:3000/auth/";

const getPublicContent = () => {
  return axios.get(API_URL + "welcome", { headers: authHeader() });
};

const getUserBoard = () => {
  return axios.get(API_URL + "welcome", { headers: authHeader() });
};

const getModeratorBoard = () => {
  return axios.get(API_URL + "admin", { headers: authHeader() });
};

const getAdminBoard = () => {
  return axios.get(API_URL + "admin", { headers: authHeader() });
};

const UserService = {
  getPublicContent,
  getUserBoard,
  getModeratorBoard,
  getAdminBoard,
};

export default UserService;
