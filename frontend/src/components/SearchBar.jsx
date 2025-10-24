import { useState } from "react";

export default function SearchBar({ onSearch }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    const value = e.target.search.value.trim();
    onSearch(value);
  };

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <span className="search-icon">🔍</span>
      <input
        type="text"
        name="search"
        placeholder="ค้นหาร้านอาหาร..."
        autoComplete="off"
      />
      <button type="submit" className="search-btn">
        ค้นหา
      </button>
    </form>
  );
}
