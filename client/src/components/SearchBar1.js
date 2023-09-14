import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function SearchBar(props) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const products = [
    { id: 1, name: 'Product 1' },
    { id: 2, name: 'Product 2' },
    { id: 3, name: 'Product 3' },
    { id: 4, name: 'Product 4' },
    { id: 5, name: 'Product 5' },
  ];

  const supermarkets = [
    { id: 1, name: 'Supermarket 1' },
    { id: 2, name: 'Supermarket 2' },
    { id: 3, name: 'Supermarket 3' },
    { id: 4, name: 'Supermarket 4' },
    { id: 5, name: 'Supermarket 5' },
  ];

  const items = [
    { products: products },
    { supermarkets: supermarkets }
  ];

  const handleSearch = (event) => {
    const searchTerm = event.target.value.toLowerCase();
    const filteredProducts = products.filter((product) =>
      product.name.toLowerCase().includes(searchTerm)
    );
    setSearchTerm(searchTerm);
    setFilteredProducts(filteredProducts);

    // go to product page if only one product is found
    if (filteredProducts.length === 1) {
      window.location.href = `/product/${filteredProducts[0].id}`;
    }
  };

  const handleSelect = (event) => {
    console.log(event.target.value)
    const selectedProduct = products.find(
      (product) => product.name === event.target.value
    );
    if (selectedProduct) {
      console.log(selectedProduct);
    }
  };

  return (
    <form className="form-inline my-2 my-lg-0">
      <div className="input-group">
        <input
          className="form-control"
          type="search"
          placeholder="Search"
          aria-label="Search"
          value={searchTerm}
          onChange={handleSearch}
          list="product-list"
        />
        <datalist id="product-list">
          {filteredProducts.map((product) => (
            <option key={product.id} value={product.name}> </option>
          ))}
        </datalist>
        <div className="input-group-append">
          <button className="btn btn-outline-success btn-sm" type="submit">
            Search
          </button>
        </div>
      </div>
      <style>
        {`
          input::-webkit-calendar-picker-indicator {
            display: none;
          }
          .btn-sm {
            padding: 0.25rem 0.5rem;
            font-size: 0.875rem;
          }
        `}
      </style>
    </form>
  );
}

export default SearchBar;