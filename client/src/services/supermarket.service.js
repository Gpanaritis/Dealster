import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "http://localhost:3000/";

// const fetchAndStoreSupermarkets = async (latitude, longitude) => {

const fetchAndStoreSupermarkets = async () => {
    const longitude = 21.743435;
    const latitude = 38.263539;

    const response = await axios.get(API_URL + "supermarkets", { headers: authHeader(), params: { latitude, longitude}});
    if (response.data) {
        const item = {
            value: response.data,
            expiry: new Date().getTime() + 60000
        }
        localStorage.setItem("supermarkets", JSON.stringify(item));
    }
    return response.data;
};

const getStoredSupermarkets = () => {
    const itemStr = localStorage.getItem("supermarkets");
    if (!itemStr) {
        return fetchAndStoreSupermarkets();
    }
    const item = JSON.parse(itemStr);
    if (new Date().getTime() > item.expiry) {
        localStorage.removeItem("supermarkets");
        return fetchAndStoreSupermarkets();
    }
    return item.value;
};

const getStoredSupermarketById = (supermarket_id) => {
    const itemStr = localStorage.getItem("supermarkets");
    if (!itemStr) {
        return fetchAndStoreSupermarkets();
    }
    const item = JSON.parse(itemStr);
    if (new Date().getTime() > item.expiry) {
        localStorage.removeItem("supermarkets");
        return fetchAndStoreSupermarkets();
    }
    const supermarkets = item.value;
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

const getCategories = async (supermarket_id) => {
    const response = await axios.get(API_URL + `supermarkets/${supermarket_id}/categories`, { headers: authHeader() });
    return response.data;
};

const getSupermarketsByProductName = async (product_name) => {
    const response = await axios.get(API_URL + `supermarkets/product_name/${product_name}`, { headers: authHeader() });
    return response.data;
};

const getSupermarketsByCategoryName = async (category_name) => {
    console.log(category_name);
    const response = await axios.get(API_URL + `supermarkets/category_name/${category_name}`, { headers: authHeader() });
    return response.data;
};

const SupermarketService = {
    fetchAndStoreSupermarkets,
    getStoredSupermarkets,
    getStoredSupermarketById,
    getProducts,
    getOffers,
    postOffer,
    getCategories,
    getSupermarketsByProductName,
    getSupermarketsByCategoryName
};

export default SupermarketService;