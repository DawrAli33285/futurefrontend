import React, { useState, useEffect, useRef } from 'react';
import { BASE_URL } from './baseurl';


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
      const searchValue = typeof value === 'string' ? value : value?.name || '';
      
      if (!searchValue || searchValue.length < 3) {
        setSuggestions([]);
        return;
      }

      setLoading(true);
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchValue)}&limit=5&addressdetails=1`,
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

  const displayValue = typeof value === 'string' ? value : value?.name || '';

  return (
    <div ref={wrapperRef} className="relative">
      <label className="block text-gray-800 font-medium mb-2">
        Birth Location: {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type="text"
        name={name}
        value={displayValue}
        onChange={handleInputChange}
        onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
        className="w-full px-4 py-3 border border-gray-300 focus:border-black focus:outline-none transition"
        placeholder="e.g., New York, USA or London, UK"
        required={required}
        autoComplete="off"
      />
      
      {loading && (
        <div className="absolute right-3 top-12 text-gray-400">
          <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      )}

      {showSuggestions && suggestions.length > 0 && (
        <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded shadow-lg max-h-60 overflow-y-auto mt-1">
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              onClick={() => handleSelectSuggestion(suggestion)}
              className="px-4 py-3 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
            >
              <div className="text-sm text-gray-900">{suggestion.name}</div>
            </li>
          ))}
        </ul>
      )}

      {showSuggestions && !loading && displayValue.length >= 3 && suggestions.length === 0 && (
        <div className="absolute z-10 w-full bg-white border border-gray-300 rounded shadow-lg mt-1 px-4 py-3 text-sm text-gray-500">
          No locations found
        </div>
      )}
      
      <p className="text-sm text-gray-500 mt-2">
        Enter city and country for accurate calculations
      </p>
    </div>
  );
};

export default function OphiuchusInAstrology() {
    const [formData, setFormData] = useState({
      name: '',
      day: '',
      month: '1',
      year: '',
      knowTime: false,
      hour: '12',
      minute: '0',
      location: ''
    });
    
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
  
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
  
    const zodiacSymbols = {
      'Aries': '♈',
      'Taurus': '♉',
      'Gemini': '♊',
      'Cancer': '♋',
      'Leo': '♌',
      'Virgo': '♍',
      'Libra': '♎',
      'Scorpius': '♏',      
      'Ophiuchus': '⛎',
      'Sagittarius': '♐',
      'Capricornus': '♑',     
      'Aquarius': '♒',
      'Pisces': '♓'
    };
  
    const getTimezoneOffset = (longitude) => {
      const offset = Math.round(longitude / 15);
      const sign = offset >= 0 ? '+' : '';
      const hours = Math.abs(offset).toString().padStart(2, '0');
      return `${sign}${hours}:00`;
    };
  
    const calculateSiderealSigns = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const birthDate = `${formData.year}-${formData.month.padStart(2, '0')}-${formData.day.padStart(2, '0')}`;
        const birthTime = formData.knowTime ? `${formData.hour.padStart(2, '0')}:${formData.minute.padStart(2, '0')}` : '12:00';
        
        let coordinates = { latitude: 0, longitude: 0, display_name: 'Unknown' };
        
        if (formData.knowTime && formData.location) {
          if (typeof formData.location === 'object' && formData.location.latitude) {
            coordinates = {
              latitude: formData.location.latitude,
              longitude: formData.location.longitude,
              display_name: formData.location.name
            };
          } else {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(formData.location)}&format=json&limit=1`
            );
            const data = await response.json();
            
            if (data && data.length > 0) {
              coordinates = {
                latitude: parseFloat(data[0].lat),
                longitude: parseFloat(data[0].lon),
                display_name: data[0].display_name
              };
            }
          }
        }
        
        const timezone = getTimezoneOffset(coordinates.longitude);
        
        const requestBody = {
          name: formData.name,
          birth_date: birthDate,
          birth_time: birthTime,
          latitude: coordinates.latitude.toString(),
          longitude: coordinates.longitude.toString(),
          timezone: timezone,
          location: coordinates.display_name
        };
  
  
        const response = await fetch(`${BASE_URL}/chart/natal`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody)
        });
  
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || 'Failed to calculate chart');
        }
  
        const data = await response.json();
        
        
        const planetsData = data.data?.planets || data.planets || {};
        
        const placements = [
          { planet: 'Sun', sign: planetsData.Sun?.sign || 'N/A', position: planetsData.Sun?.position || '' },
          { planet: 'Moon', sign: planetsData.Moon?.sign || 'N/A', position: planetsData.Moon?.position || '' },
          { planet: 'Mercury', sign: planetsData.Mercury?.sign || 'N/A', position: planetsData.Mercury?.position || '' },
          { planet: 'Venus', sign: planetsData.Venus?.sign || 'N/A', position: planetsData.Venus?.position || '' },
          { planet: 'Mars', sign: planetsData.Mars?.sign || 'N/A', position: planetsData.Mars?.position || '' },
          { planet: 'Jupiter', sign: planetsData.Jupiter?.sign || 'N/A', position: planetsData.Jupiter?.position || '' },
          { planet: 'Saturn', sign: planetsData.Saturn?.sign || 'N/A', position: planetsData.Saturn?.position || '' },
          { planet: 'Uranus', sign: planetsData.Uranus?.sign || 'N/A', position: planetsData.Uranus?.position || '' },
          { planet: 'Neptune', sign: planetsData.Neptune?.sign || 'N/A', position: planetsData.Neptune?.position || '' },
          { planet: 'Pluto', sign: planetsData.Pluto?.sign || 'N/A', position: planetsData.Pluto?.position || '' }
        ];
        
        const monthName = months[parseInt(formData.month) - 1];
        
        setReport({
          placements,
          dateStr: `${formData.day} ${monthName} ${formData.year} ${birthTime} (${timezone})`,
          location: coordinates.display_name,
          rawData: data
        });
        
      } catch (err) {
        setError(err.message || 'An error occurred while calculating the chart');
        console.error('Error calculating chart:', err);
      } finally {
        setLoading(false);
      }
    };
  
    const handleCalculate = () => {
      if (!formData.name || !formData.day || !formData.year) {
        setError('Please fill in all required fields (Name, Day, Year)');
        return;
      }
      
      if (formData.knowTime && !formData.location) {
        setError('Please enter your birth location when using birth time');
        return;
      }
      
      setError(null);
      calculateSiderealSigns();
    };
  
    const handleLocationChange = (newLocation) => {
      setFormData({...formData, location: newLocation});
    };
  
    return (
    <>
    <iframe src="https://gamma.app/embed/plcrmgq48vjd16r" style={{ width: '100%', height: '100vh', border: 'none', display: 'block' }} allow="fullscreen" title="Ophiuchus in Astrology"></iframe>

    </>
    );
  }