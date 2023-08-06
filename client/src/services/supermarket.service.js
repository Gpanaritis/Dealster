import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "http://localhost:3000/supermarkets/";

const getAllSupermarkets = async () => {
    const response = await axios.get(API_URL, { headers: authHeader() });
    return response;
};

const SupermarketService = {
    getAllSupermarkets
};

export default SupermarketService;