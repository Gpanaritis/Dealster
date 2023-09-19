import React, { useState, useEffect } from 'react';
import Autosuggest from 'react-autosuggest';
import uniqueObjects from 'unique-objects';
import '../styles/SearchBar.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import ProductService from "../services/product.service";
import SupermarketService from "../services/supermarket.service";

const escapeRegexCharacters = (str) => {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

const getSuggestions = (value, languages) => {
  const escapedValue = escapeRegexCharacters(value.trim());

  if (escapedValue === '') {
    return [];
  }

  return languages
    .map(section => {
      return {
        title: section.title,
        languages: section.languages.filter(language => language.name.toLowerCase().includes(escapedValue.toLowerCase()))
      };
    })
    .filter(section => section.languages.length > 0);
};

const getSectionSuggestions = (section) => {
  return section.languages;
};

const getSuggestionValue = (suggestion) => {
  return suggestion.name;
};

const renderSuggestion = (suggestion) => {
  return (
    <span>{suggestion.name}</span>
  );
};

const renderSectionTitle = (section) => {
  return (
    <strong>{section.title}</strong>
  );
};

const SearchBar = () => {
  const [value, setValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [supermarkets, setSupermarkets] = useState([]);
  const [languages, setLanguages] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await ProductService.getCategories();
        setCategories(response);
        return response; // Return the response after it's set in state
      } catch (error) {
        console.error(`Error fetching products: ${error}`);
      }
    };
    const fetchSupermarkets = async () => {
      try {
        const response = await SupermarketService.fetchAndStoreSupermarkets();
        setSupermarkets(response);
        return response; // Return the response after it's set in state
      } catch (error) {
        console.error(`Error fetching supermarkets: ${error}`);
      }
    };
    fetchProducts();
    fetchSupermarkets();
  }, []);

  useEffect(() => {
    setLanguages([
      {
        title: 'Supermarkets',
        languages: uniqueObjects(supermarkets, ['name'])
      },
      {
        title: 'Categories',
        languages: uniqueObjects(categories, ['name'])
      }
    ]);
  }, [categories, supermarkets]);


  const onChange = (event, { newValue, method }) => {
    setValue(newValue);
  };

  const onSuggestionsFetchRequested = ({ value }) => {
    setSuggestions(getSuggestions(value, languages));
  };

  const onSuggestionsClearRequested = () => {
    setSuggestions([]);
  };

  const handleSearch = () => {
    // Perform search with value
    if (supermarkets.map(supermarket => supermarket.name).includes(value)) {
      console.log("supermarket");
      window.location.href = `/filteredSupermarkets/${value}`;
    } else if (categories.map(category => category.name).includes(value)) {
      window.location.href = `/productsMap/${value}`;
      console.log("product");
    } else {
      console.log("not found");
    }
  };

  const renderInputComponent = (inputProps) => {
    return (
      <div className="input-group">
        <input {...inputProps} />
        <div className="input-group-append">
          <button className="btn btn-outline-success search-button" type="button" onClick={handleSearch}>Search</button>
        </div>
      </div>
    );
  };

  const inputProps = {
    placeholder: "Search Map",
    value,
    onChange,
    className: "form-control"
  };

  return (
    <Autosuggest
      multiSection={true}
      suggestions={suggestions}
      onSuggestionsFetchRequested={onSuggestionsFetchRequested}
      onSuggestionsClearRequested={onSuggestionsClearRequested}
      getSuggestionValue={getSuggestionValue}
      renderSuggestion={renderSuggestion}
      renderSectionTitle={renderSectionTitle}
      getSectionSuggestions={getSectionSuggestions}
      inputProps={inputProps}
      renderInputComponent={renderInputComponent}
    />
  );
};

export default SearchBar;
