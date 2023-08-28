import React, { useState } from 'react';

// SearchForm component that handles input and submission
const SearchForm = ({ value, onChange, onSubmit, placeholder }) => {
  const handleInputChange = (event) => {
    onChange(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center rounded p-2">
      <input
        type="text"
        name="q"
        value={value}
        onChange={handleInputChange}
        placeholder={placeholder}
        className="input-style p-2 outline-none"
      />
    </form>
  );
};

const DuckDuckGoSearchBar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchEngine, setSearchEngine] = useState('duckduckgo');

  const handleSearchSubmit = () => {
    let searchUrl = '';
    if (searchEngine === 'duckduckgo') {
      searchUrl = `https://duckduckgo.com/?q=${encodeURIComponent(searchQuery)}`;
    } else if (searchEngine === 'nostrband') {
      searchUrl = `https://nostr.band/?q=${encodeURIComponent(searchQuery)}`;
    }
    window.location.href = searchUrl;
  };

  const getPlaceholder = () => {
    return searchEngine === 'duckduckgo' ? 'Search on Web' : 'Search on Nostr';
  };

  return (
    <div className="flex items-center justify-center">
      <SearchForm
        value={searchQuery}
        onChange={setSearchQuery}
        onSubmit={handleSearchSubmit}
        placeholder={getPlaceholder()}
      />
      <div className="ml-0 mt-1.5 flex items-center">
        {/* Dark-themed toggle switch */}
        <label className="cursor-pointer">
          <div className="relative inline-block w-10 h-6 ml-0">
            <input
              type="checkbox"
              className="form-checkbox flex h-0 w-0 opacity-0"
              checked={searchEngine === 'duckduckgo'}
              onChange={() =>
                setSearchEngine(searchEngine === 'duckduckgo' ? 'nostrband' : 'duckduckgo')
              }
            />
            <div
              className={`toggle-switch w-10 h-6 rounded-full transition duration-300 ease-in-out ${
                searchEngine === 'duckduckgo' ? 'bg-blue-800' : 'bg-purple-800'
              }`}
            >
              <div
                className={`toggle-knob absolute w-6 h-6 rounded-full bg-[#2c292e] shadow inset-y-0 ${
                  searchEngine === 'duckduckgo' ? 'right-0' : 'left-0'
                }`}
              ></div>
            </div>
          </div>
        </label>
      </div>
    </div>
  );
};

export default DuckDuckGoSearchBar;
