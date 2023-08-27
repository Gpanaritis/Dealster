import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "http://localhost:3000/";

// const fetchAndStoreSupermarkets = async (latitude, longitude) => {

const fetchAndStoreSupermarkets = async () => {
    const longitude = 21.72831230;
    const latitude = 38.23601290;

    const response = await axios.get(API_URL + "supermarkets", { headers: authHeader(), params: { latitude, longitude}});
    if (response.data) {
        localStorage.setItem("supermarkets", JSON.stringify(response.data));
    }
    return response.data;
};

const getStoredSupermarkets = () => {
    return JSON.parse(localStorage.getItem("supermarkets"));
};

const getStoredSupermarketById = (supermarket_id) => {
    const supermarkets = JSON.parse(localStorage.getItem("supermarkets"));
    return supermarkets.find(supermarket => supermarket.id == supermarket_id);
};

const getProducts = async (supermarket_id) => {
    const response = await axios.get(API_URL + `supermarkets/${supermarket_id}/products`, { headers: authHeader() });
    return response.data;
};

const getOffers = async (supermarket_id) => {
  const response = await axios.get(API_URL + `offers/supermarket/${supermarket_id}`, { headers: authHeader() });
  return response.data;
};

const postOffer = async (offer) => {
    const response = await axios.post(API_URL + "offers", offer, { headers: authHeader() });
    return response.data;
};

const SupermarketService = {
    fetchAndStoreSupermarkets,
    getStoredSupermarkets,
    getStoredSupermarketById,
    getProducts,
    getOffers,
    postOffer
};

export default SupermarketService;