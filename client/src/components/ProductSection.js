// ProductSection.js

import React, { useState } from "react";
import "../styles/AdminProducts.css";
import JRservice from "../services/JRservice";

function AdminProductManagement() {
  const [file, setFile] = useState(null);

  const handleFileUpload = async (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      try {
        const response = await JRservice.uploadJSONFile(selectedFile);
        console.log("File upload response:", response);
        // Handle success or display a message to the user
        alert("Upload successful!");
      } catch (error) {
        console.error("Error uploading JSON file:", error);
        // Handle the error and display an error message
      }
    }
  };

  const handleUpdateData = async () => {
    // Prepare the JSON data you want to update
    const jsonData = { /* Your JSON data here */ };
    try {
      const response = await JRservice.updateJSONData(jsonData);
      console.log("Data update response:", response);
      // Handle success or display a message to the user
    } catch (error) {
      console.error("Error updating JSON data:", error);
      // Handle the error and display an error message
    }
  };

  return (
    <div className="centered-block">
      <h2>Διαχείριση Προϊόντων</h2>
      <form>
        <input type="file" accept=".json" onChange={handleFileUpload} />
        <button type="button" onClick={handleUpdateData}>upload JSON</button>
      </form>
    </div>
  );
}

export default AdminProductManagement;