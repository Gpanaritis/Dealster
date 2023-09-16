import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "http://localhost:3000"; // Replace with your actual backend URL

// Function to upload a JSON file
const uploadJSONFile = async (file) => {
  const formData = new FormData();
  formData.append("jsonFile", file);

  try {
    const response = await axios.post(`${API_URL}/upload-json`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    throw new Error(error.message);
  }
};

// Function to update JSON data (you can customize this)
const updateJSONData = async (jsonData,typeOfData) => {
  try {
    const response = await axios.post(`${API_URL}/${typeOfData}`, jsonData, {
      headers: {
        "Content-Type": "application/json",
        ...authHeader()
      },
    });

    return response.data;
  } catch (error) {
    throw new Error(error.message);
  }
};

const JRservice = {
  uploadJSONFile,
  updateJSONData,
};

export default JRservice;