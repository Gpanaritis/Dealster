// ProductSection.js
import React, { useState } from "react";
import "../styles/AdminProducts.css";
function AdminProductManagement() {
  const [file, setFile] = useState(null);

  const handleFileUpload = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const jsonData = JSON.parse(e.target.result);
          // Process the JSON data (update product prices, etc.)
          // You can call a function to handle the data processing here.
        } catch (error) {
          console.error("Error parsing JSON file:", error);
        }
      };
      reader.readAsText(selectedFile);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (file) {
      // Process the uploaded JSON file here
      // You can call a function to handle the data processing here.
    }
  };

  return (
    <div className="centered-block">
      <h2>Διαχείριση Προϊόντων</h2>
      <form onSubmit={handleSubmit}>
        <input type="file" accept=".json" onChange={handleFileUpload} />
        <button type="submit">Ανέβασμα JSON</button>
      </form>
    </div>
  );
}

export default AdminProductManagement;