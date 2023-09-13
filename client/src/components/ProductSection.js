// ProductSection.js
import React, { useState } from 'react';

function ProductSection() {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubcategory, setSelectedSubcategory] = useState('');

  // Fetch categories and subcategories from your data source and populate them in dropdowns

  return (
    <div>
      <h2>Προϊόντα</h2>
      <div>
        <label>Κατηγορία:</label>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          {/* Populate categories in the options */}
        </select>
      </div>
      <div>
        <label>Υποκατηγορία:</label>
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
