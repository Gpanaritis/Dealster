import React from 'react';
import Autosuggest from 'react-autosuggest';
import '../styles/SearchBar.css'
// import bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';
import { button } from 'react-validation/build/button';

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

const languages = [
  {
    title: 'Products',
    languages: products
  },
  {
    title: 'Supermarkets',
    languages: supermarkets
  }
];

// https://developer.mozilla.org/en/docs/Web/JavaScript/Guide/Regular_Expressions#Using_Special_Characters
function escapeRegexCharacters(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function getSuggestions(value) {
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
}

function getSuggestionValue(suggestion) {
  return suggestion.name;
}

function renderSuggestion(suggestion) {
  return (
    <span>{suggestion.name}</span>
  );
}

function renderSectionTitle(section) {
  return (
    <strong>{section.title}</strong>
  );
}

function getSectionSuggestions(section) {
  return section.languages;
}

class SearchBar extends React.Component {
  constructor() {
    super();

    this.state = {
      value: '',
      suggestions: []
    };
  }

  onChange = (event, { newValue, method }) => {
    this.setState({
      value: newValue
    });
  };

  onSuggestionsFetchRequested = ({ value }) => {
    this.setState({
      suggestions: getSuggestions(value)
    });
  };

  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: []
    });
  };

  handleSearch = () => {
    const { value } = this.state;
    // Perform search with value
    console.log(`Searching for "${value}"...`);
  };

  renderInputComponent = (inputProps) => {
    return (
      <div className="input-group">
        <input {...inputProps} />
        <div className="input-group-append">
          <button className="btn btn-outline-success search-button" type="button" onClick={this.handleSearch}>Search</button>
        </div>
      </div>
    );
  };

  render() {
    const { value, suggestions } = this.state;
    const inputProps = {
      placeholder: "Type 'c'",
      value,
      onChange: this.onChange,
      className: "form-control"
    };

    return (
      <Autosuggest 
        multiSection={true}
        suggestions={suggestions}
        onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
        onSuggestionsClearRequested={this.onSuggestionsClearRequested}
        getSuggestionValue={getSuggestionValue}
        renderSuggestion={renderSuggestion}
        renderSectionTitle={renderSectionTitle}
        getSectionSuggestions={getSectionSuggestions}
        inputProps={inputProps}
        renderInputComponent={this.renderInputComponent}
      />
    );
  }
}

export default SearchBar;