import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "http://localhost:3000/";

const getProduct = async (product_id) => {

    const response = await axios.get(API_URL + `products/${product_id}`, { headers: authHeader() });
    return response.data;
}

const getProducts = async () => {

    const response = await axios.get(API_URL + "products", { headers: authHeader() });
    return response.data;
}

const getCategories = async () => {
    const response = await axios.get(API_URL + "categories", { headers: authHeader() });
    return response.data;
}

const removeOffer = async (offerId) => {
    const response = await axios.delete(API_URL + `offers/${offerId}`, { headers: authHeader() });
    return response.data;
}

const getOffersGroupedByDate = async () => {
    const response = await axios.get(API_URL + "offers/count", { headers: authHeader() });
    return response.data;
}

const ProductService = {
    getProduct,
    getProducts,
    getCategories,
    removeOffer,
    getOffersGroupedByDate
};

export default ProductService;