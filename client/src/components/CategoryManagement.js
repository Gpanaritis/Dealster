import React, { useState } from 'react';

function CategoryManagement() {
  // Initialize state to manage categories
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');

  // Function to add a new category
  const addCategory = () => {
    if (newCategory.trim() !== '') {
      setCategories([...categories, newCategory]);
      setNewCategory('');
    }
  };

  return (
    <div>
      <h1>Category Management</h1>
      <form>
        <input
          type="text"
          placeholder="New Category"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
        />
        <button type="button" onClick={addCategory}>
          Add Category
        </button>
      </form>
      <ul>
        {categories.map((category, index) => (
          <li key={index}>{category}</li>
        ))}
      </ul>
    </div>
  );
}

export default CategoryManagement;
