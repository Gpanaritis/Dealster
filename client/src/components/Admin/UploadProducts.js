import React, { useState } from "react";
import "../../styles/AdminProducts.css";
import JRservice from "../../services/JR.service";

const UploadProducts = ({ typeOfData }) => {
    const [jsonData, setJsonData] = useState(null);
    const [file, setFile] = useState("Choose a JSON file");
    const [status, setStatus] = useState(null);
    const [message, setMessage] = useState(null);
    const [uploadError, setUploadError] = useState(null);

    const handleFileUpload = async (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile) {
            try {
                const fileReader = new FileReader();
                fileReader.readAsText(selectedFile, "UTF-8");
                fileReader.onload = (event) => {
                    const jsonData = JSON.parse(event.target.result);
                    setJsonData(jsonData);
                    setFile(selectedFile.name);
                };
                fileReader.onerror = (event) => {
                    console.error("Error reading file:", event.target.error);
                    // Handle the error and display an error message
                    setUploadError("Error reading the selected file");
                };
            } catch (error) {
                console.error("Error uploading JSON file:", error);
                // Handle the error and display an error message
                setUploadError("Error uploading JSON file");
            }
        }
    };

    const handleUpdateData = async () => {
        // Prepare the JSON data you want to update
        try {
            console.log("Data to update:", jsonData);
            const response = await JRservice.updateJSONData(jsonData, typeOfData);
            console.log("Data update response:", response);
            // Handle success or display a message to the user
            setStatus("success");
            setMessage("JSON data uploaded successfully");
        } catch (error) {
            console.error("Error updating JSON data:", error);
            setStatus("error");
            setMessage("Error updating JSON data");
            // Handle the error and display an error message
        }
    };

    return (
        <div>
            {uploadError && (
                <div className="alert alert-danger" role="alert">
                    {uploadError}
                </div>
            )}
            <form className="file-upload-form">
                <label htmlFor="jsonFileInput" className="file-upload-label">
                    <span className="file-upload-icon">📂</span>
                    {file}
                </label>
                <input
                    type="file"
                    id="jsonFileInput"
                    accept=".json"
                    onChange={handleFileUpload}
                    className="file-upload-input"
                />
                <br />
                <button type="button" onClick={handleUpdateData} className="upload-button">
                    Upload JSON
                </button>
            </form>
            {status && (
                <div className={`alert ${status === "success" ? "alert-success" : "alert-danger"}`} role="alert">
                    {message}
                </div>
            )}
        </div>
    );
};

export default UploadProducts;