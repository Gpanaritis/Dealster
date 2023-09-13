import axios from "axios";
import authHeader from "./auth-header";


const API_URL = "http://localhost:3000/";

const postJSONtoApi = async (url, data) => { 
    const response = await axios.post(API_URL + url, data, { headers: authHeader() });
    return response;
}


export default postJSONtoApi;