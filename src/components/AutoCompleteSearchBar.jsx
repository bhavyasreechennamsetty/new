import { doctorData } from "../utils/doctorData";
import { useState, useEffect, useRef } from 'react';

const AutocompleteSearchBar = () => {
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
    const [isFocused, setIsFocused] = useState(false);
    const inputRef = useRef(null);
    const suggestionListRef = useRef(null);
  
    useEffect(() => {
      if (query.trim() === '') {
        setSuggestions([]);
        return;
      }
  
      const filteredSuggestions = doctorData.filter(doctor => 
        doctor.name.toLowerCase().includes(query.toLowerCase()) ||
        doctor.specialty.toLowerCase().includes(query.toLowerCase())
      );
      
      setSuggestions(filteredSuggestions);
      setSelectedSuggestionIndex(-1);
    }, [query]);
  
    const handleInputChange = (e) => {
      setQuery(e.target.value);
    };
  
    const handleSuggestionClick = (suggestion) => {
      setQuery(suggestion.name);
      setSuggestions([]);
      // console.log(`Selected doctor: ${suggestion.name}, ${suggestion.specialty}`);
    };
  
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedSuggestionIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
      } 
      else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedSuggestionIndex(prev => prev > 0 ? prev - 1 : 0);
      }
      else if (e.key === 'Enter' && selectedSuggestionIndex >= 0) {
        handleSuggestionClick(suggestions[selectedSuggestionIndex]);
      }
      else if (e.key === 'Escape') {
        setSuggestions([]);
        setSelectedSuggestionIndex(-1);
        inputRef.current.blur();
      }
    };
  
    useEffect(() => {
      if (selectedSuggestionIndex >= 0 && suggestionListRef.current) {
        const selectedElement = suggestionListRef.current.children[selectedSuggestionIndex];
        if (selectedElement) {
          selectedElement.scrollIntoView({ block: 'nearest' });
        }
      }
    }, [selectedSuggestionIndex]);
  
    return (
      <div className="w-full max-w-2xl mx-auto mt-4 relative">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
            <span>🔍</span>
          </div>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => {
              setTimeout(() => setIsFocused(false), 200);
            }}
            className="w-full p-4 pl-10 pr-12 text-lg border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
            placeholder="Search for doctors by name or specialty..."
            autoComplete="off"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-gray-700"
            >
              <label>x</label>
            </button>
          )}
        </div>
  
        {isFocused && suggestions.length > 0 && (
          <div className="absolute z-10 mt-1 w-full bg-white rounded-lg shadow-lg max-h-96 overflow-y-auto border border-gray-200">
            <ul ref={suggestionListRef} className="py-1">
              {suggestions.map((suggestion, index) => (
                <li
                  key={suggestion.id}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className={`px-4 py-3 hover:bg-gray-100 cursor-pointer ${
                    index === selectedSuggestionIndex ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="font-medium text-gray-900">
                    {suggestion.name}
                  </div>
                  <div className="text-sm text-gray-600">
                    {suggestion.specialty}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  };
  
  export default AutocompleteSearchBar;