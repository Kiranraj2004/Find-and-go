import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion"
import { Search } from "lucide-react"

const SearchBar = ({ onSelectLocation }) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [typingTimeout, setTypingTimeout] = useState(null);
  const API_KEY = import.meta.env.VITE_TOM_TOM_API_KEY;

  const fetchSuggestions = async (searchQuery) => {
    if (!searchQuery.trim()) return;

    // Append "hospital" if not present in the query
    const modifiedQuery = searchQuery.toLowerCase().includes("hospital")
      ? searchQuery
      : `${searchQuery} hospital`;

    try {
      const response = await axios.get(
        `https://api.tomtom.com/search/2/search/${modifiedQuery}.json?key=${API_KEY}&countrySet=IN&maxFuzzyLevel=2&typeahead=true&limit=5&language=en-US`
      );

      // console.log("search");
      // console.log(response);

      // Extract suggestions with POI name and address details
      const results = response.data.results.map((result) => {
        if (result.type === "POI" && result.poi?.name) {
          const addressParts = [
            result.address?.streetName,
            result.address?.freeformAddress,
            result.address?.countrySubdivisionName,
            result.address?.country
          ].filter(Boolean); // Remove undefined values
      
          return {
            name: result.poi.name,
            address: addressParts.join(", ") // Join available address parts with a comma
          };
        }
        return null;
      }).filter((item) => item !== null); // Remove null entries
      

      setSuggestions(results);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    }
  };

  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    setQuery(inputValue);

    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }

    // Debounce API request - wait for 500ms after user stops typing
    setTypingTimeout(setTimeout(() => fetchSuggestions(inputValue), 700));
  };

  const handleSelect = (place) => {
    setQuery(place.name); // Update input field with selected place name
    setSuggestions([]); // Hide suggestions
    onSelectLocation(place.name); // Pass selected place to parent component
  };

  return (
    <div className="flex flex-col items-center justify-center h-24 w-full px-4">
      {/* Search Bar Container */}
      <div className="relative flex items-center w-full max-w-2xl">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          placeholder="Search for hospitals..."
          className="w-full p-4 pl-12 pr-4 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-md transition-all"
        />
        <button
          onClick={() => fetchSuggestions(query)}
          className="ml-2 px-5 py-3 bg-blue-600 text-white font-semibold rounded-full shadow-md hover:bg-blue-700 transition-all"
        >
          Search
        </button>
  
        {/* Suggestion Dropdown (Positioned Absolutely) */}
        {query.trim() !== "" && suggestions.length > 0 && (
          <ul className="absolute top-full left-0 w-full bg-white bg-opacity-90 shadow-lg rounded-lg mt-1 max-h-60 overflow-y-auto z-50">
            {suggestions.map((place, index) => (
              <li
                key={index}
                onClick={() => handleSelect(place)}
                className="p-3 cursor-pointer hover:bg-gray-200 transition-all"
              >
                <strong>{place.name}</strong>
                {place.address && (
                  <span className="text-sm text-gray-600"> - {place.address}</span>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
  
  
};

export default SearchBar;
