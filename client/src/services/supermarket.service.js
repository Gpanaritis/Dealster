import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "http://localhost:3000/";

const getAllSupermarkets = async () => {
    const response = await axios.get(API_URL + "supermarkets", { headers: authHeader() });
    return response;
};

const getSupermarketOffers = async () => {
    const response = await axios.get(API_URL + "offers", { headers: authHeader() });
    return response;
};

const SupermarketService = {
    getAllSupermarkets
};

export default SupermarketService;