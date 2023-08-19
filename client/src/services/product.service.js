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

const ProductService = {
    getProduct,
    getProducts,
};

export default ProductService;