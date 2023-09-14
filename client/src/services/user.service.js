import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "http://localhost:3000/";

const getPublicContent = () => {
  return axios.get(API_URL + "auth/welcome", { headers: authHeader() });
};

const getUserBoard = () => {
  return axios.get(API_URL + "auth/welcome", { headers: authHeader() });
};

const getModeratorBoard = () => {
  return axios.get(API_URL + "auth/admin", { headers: authHeader() });
};

const getAdminBoard = () => {
  return axios.get(API_URL + "auth/admin", { headers: authHeader() });
};

const likeOffer = async (offerId) => {
  const response = await axios.put(API_URL + `reactions/like/${offerId}`, {}, { headers: authHeader() });
  return response.data;
};

const dislikeOffer = async (offerId) => {
  const response = await axios.put(API_URL + `reactions/dislike/${offerId}`, {}, { headers: authHeader() });
  return response.data;
}

const stockOffer = async (offerId) => {
  const response = await axios.put(API_URL + `offers/stock/${offerId}`, {}, { headers: authHeader() });
  return response.data;
}

const changeUsername = async (username) => {
  const response = await axios.put(API_URL + `auth/changeUsername/${username}`, {}, { headers: authHeader() });
  if (response.data.accessToken) {
    console.log(response.data);
    localStorage.setItem("user", JSON.stringify(response.data));
  }
  return response.data;
}

const changePassword = async (oldPassword, newPassword) => {
  const response = await axios.put(API_URL + "auth/changePassword", { oldPassword, newPassword }, { headers: authHeader() });
  if (response.data.accessToken) {
    localStorage.setItem("user", JSON.stringify(response.data));
  }
  return response.data;
};

const getOffersAddedByMe = async () => {
  const response = await axios.get(API_URL + `offers/user`, { headers: authHeader() });
  return response.data;
}

const getOffersAdded = async (username) => {
  const response = await axios.get(API_URL + `offers/user/${username}`, { headers: authHeader() });
  return response.data;
};

const getReactionsAdded = async (username) => {
  const response = await axios.get(API_URL + `offers/reactions/user/${username}`, { headers: authHeader() });
  return response.data;
}

const UserService = {
  getPublicContent,
  getUserBoard,
  getModeratorBoard,
  getAdminBoard,
  likeOffer,
  dislikeOffer,
  stockOffer,
  changeUsername,
  changePassword,
  getOffersAddedByMe,
  getOffersAdded,
  getReactionsAdded
};

export default UserService;
