import { useState, useEffect, useRef } from 'react';

const LocationSuggestionField = ({ value, onChange, name = "location", required = false }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!value || value.length < 3) {
        setSuggestions([]);
        return;
      }

      setLoading(true);
      try {
      
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(value)}&limit=5&addressdetails=1`,
          {
            headers: {
              'User-Agent': 'LocationSuggestionApp/1.0'
            }
          }
        );
        
        const data = await response.json();
        
        const formattedSuggestions = data.map(item => ({
          name: item.display_name,
          city: item.address?.city || item.address?.town || item.address?.village || '',
          state: item.address?.state || '',
          country: item.address?.country || '',
          latitude: parseFloat(item.lat),
          longitude: parseFloat(item.lon)
        }));
        
        setSuggestions(formattedSuggestions);
        setShowSuggestions(true);
      } catch (error) {
        console.error('Error fetching location suggestions:', error);
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounceTimer);
  }, [value]);

  const handleInputChange = (e) => {
  
    onChange(e.target.value);
    setShowSuggestions(true);
  };

  const handleSelectSuggestion = (suggestion) => {
    
    onChange({
      name: suggestion.name,
      latitude: suggestion.latitude,
      longitude: suggestion.longitude
    });
    setShowSuggestions(false);
    setSuggestions([]);
  };

  return (
    <div ref={wrapperRef} className="relative">
      <label className="block text-gray-700 mb-2">Location:</label>
      <input
        type="text"
        name={name}
        value={value}
        onChange={handleInputChange}
        onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        placeholder="New York, NY, USA"
        required={required}
        autoComplete="off"
      />
      
      {loading && (
        <div className="absolute right-3 top-11 text-gray-400">
          <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      )}

      {showSuggestions && suggestions.length > 0 && (
        <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-b shadow-lg max-h-60 overflow-y-auto mt-1">
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              onClick={() => handleSelectSuggestion(suggestion)}
              className="px-3 py-2 hover:bg-indigo-50 cursor-pointer border-b border-gray-100 last:border-b-0"
            >
              <div className="text-sm text-gray-900">{suggestion.name}</div>
            </li>
          ))}
        </ul>
      )}

      {showSuggestions && !loading && value.length >= 3 && suggestions.length === 0 && (
        <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-b shadow-lg mt-1 px-3 py-2 text-sm text-gray-500">
          No locations found
        </div>
      )}
    </div>
  );
};

export default LocationSuggestionField