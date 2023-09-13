// ProductSection.js
import React, { useState } from 'react';
import '../styles/AdminProducts.css'; // Import the CSS file
function ProductSection() {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubcategory, setSelectedSubcategory] = useState('');

  // Fetch categories and subcategories from your data source and populate them in dropdowns

  return (
    <div className="centered-block">
      <h2>Προϊόντα</h2>
      <div  className="category-wrapper">
        <label className="category-label">Κατηγορία:</label>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          {/* Populate categories in the options */}
        </select>
      
        <label className="category-label">Υποκατηγορία:</label>
        <select
          value={selectedSubcategory}
          onChange={(e) => setSelectedSubcategory(e.target.value)}
        >
          {/* Populate subcategories based on the selected category */}
        </select>
      </div>
      {/* Add buttons or actions for managing products */}
    </div>
  );
}

export default ProductSection;
