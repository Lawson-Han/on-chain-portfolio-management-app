// SearchBox.js
import React from 'react';

const SearchBox = () => {
  return (
    <div>
      <div className="search-description">Search for any Ethereum Accounts</div>
      <div className="custom-search-bar">
        <input
          type="text"
          className="custom-search-input"
          placeholder="0x..."
        />
        <button className="custom-search-button">Search</button>
      </div>
    </div>
  );
};

export default SearchBox;
