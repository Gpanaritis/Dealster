import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "http://localhost:3000/";

const getProduct = async (product_id) => {

    const response = await axios.get(API_URL + `products/${product_id}`, { headers: authHeader() });
    return response.data;
}

const getStoredProductById = (product_id) => {
    const itemStr = localStorage.getItem("products");
    if (!itemStr) {
        getProducts();
    }
    const item = JSON.parse(itemStr);
    if (new Date().getTime() > item.expiry) {
        localStorage.removeItem("products");
        getProducts();
    }
    const products = item.value;
    return products.find(product => product.id == product_id);
}

const getProducts = async () => {

    const response = await axios.get(API_URL + "products", { headers: authHeader() });
    if (response.data) {
        const item = {
            value: response.data,
            expiry: new Date().getTime() + 7200000
        }
        localStorage.setItem("products", JSON.stringify(item));
    }
    return response.data;
}

const getStoredProducts = () => {
    const itemStr = localStorage.getItem("products");
    if (!itemStr) {
        return getProducts();
    }
    const item = JSON.parse(itemStr);
    if (new Date().getTime() > item.expiry) {
        localStorage.removeItem("products");
        return getProducts();
    }
    return item.value;
}

const getCategories = async () => {
    const response = await axios.get(API_URL + "categories", { headers: authHeader() });
    return response.data;
}

const getSubcategories = async (category_id) => {
    const response = await axios.get(API_URL + `categories/subcategories/${category_id}`, { headers: authHeader() });
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

const getVarianceByCategory = async (category_id) => {
    const response = await axios.get(API_URL + `offers/variance/category/${category_id}`, { headers: authHeader() });
    return response.data;
}

const getVarianceBySubcategory = async (subcategory_id) => {
    const response = await axios.get(API_URL + `offers/variance/subcategory/${subcategory_id}`, { headers: authHeader() });
    return response.data;
}

const ProductService = {
    getProduct,
    getStoredProductById,
    getProducts,
    getStoredProducts,
    getCategories,
    getSubcategories,
    removeOffer,
    getOffersGroupedByDate,
    getVarianceByCategory,
    getVarianceBySubcategory
};

export default ProductService;