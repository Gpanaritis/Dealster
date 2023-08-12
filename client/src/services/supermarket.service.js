import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "http://localhost:3000/";

// const fetchAndStoreSupermarkets = async (latitude, longitude) => {

const fetchAndStoreSupermarkets = async () => {
    const latitude = 21.72831230;
    const longitude = 38.23601290;

    const response = await axios.get(API_URL + "supermarkets", { headers: authHeader(), params: { latitude, longitude}});
    if (response.data) {
        localStorage.setItem("supermarkets", JSON.stringify(response.data));
    }
    return response.data;
};

const getStoredSupermarkets = () => {
    return JSON.parse(localStorage.getItem("supermarkets"));
}

const getStoredSupermarketById = (supermarket_id) => {
    const supermarkets = JSON.parse(localStorage.getItem("supermarkets"));
    return supermarkets.find(supermarket => supermarket.id == supermarket_id);
}

const getOffers = async (supermarket_id) => {
  const response = await axios.get(API_URL + `offers/supermarket/${supermarket_id}`, { headers: authHeader() });
  return response.data;
};

const getClosestSupermarkets = async (latitude, longitude) => {
    const response = await axios.get(API_URL + "supermarkets/close", { headers: authHeader(), params: { latitude, longitude } });
    return response;
}

const getSupermarketsWithOffers = async (latitude, longitude) => {
    const response = await axios.get(API_URL + "offers/supermarkets", { headers: authHeader(), params: { latitude, longitude } });
    return response;
}

const getSupermarketsWithoutOffers = async (latitude, longitude) => {
    const response = await axios.get(API_URL + "offers/supermarkets/empty", { headers: authHeader(), params: { latitude, longitude } });
    return response;
}

const SupermarketService = {
    fetchAndStoreSupermarkets,
    getStoredSupermarkets,
    getStoredSupermarketById,
    getOffers,
};

export default SupermarketService;