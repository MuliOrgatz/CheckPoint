import React from 'react';

interface SearchBarProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className="relative w-full">
      {/* Search Icon */}
      <img
        src="/assets/search.svg"
        className="absolute left-4 bottom-1 transform -translate-y-1/2 "
      />

      {/* Search Input */}
      <input
        type="text"
        placeholder="Search"
        className="w-full bg-white pl-12 text-sm pr-4 py-2 border border-pink rounded-[2.25rem] focus:outline-none focus:ring-1 focus:ring-gray-300"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
  );
};

export default SearchBar;
