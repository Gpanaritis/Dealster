import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "http://localhost:3000/";

const getPointsForUser = async (username) => {
    const response = await axios.get(API_URL + `points/user/${username}/sum`, { headers: authHeader() });
    return response.data;
}

const getPointsForUserInMonth = async (username, month) => {
    const response = await axios.get(API_URL + `points/user/${username}/month/${month}`, { headers: authHeader() });
    return response.data;
}

const getPointsForUserInDay = async (username, day) => {
    const response = await axios.get(API_URL + `points/user/${username}/day/${day}`, { headers: authHeader() });
    return response.data;
}

const getTokensForUser = async (username) => {
    const response = await axios.get(API_URL + `tokens/user/${username}/sum`, { headers: authHeader() });
    return response.data;
}

const getTokensForUserInMonth = async (username, month) => {
    const response = await axios.get(API_URL + `tokens/user/${username}/month/${month}`, { headers: authHeader() });
    return response.data;
}

const PointsService = {
    getPointsForUser,
    getPointsForUserInMonth,
    getPointsForUserInDay,
    getTokensForUser,
    getTokensForUserInMonth
};

export default PointsService;