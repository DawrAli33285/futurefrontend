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

export default function SiderealCalculator() {
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

      console.log('Request Body:', requestBody);

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
      console.log('API Response:', data);
      
    
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
    <div className="min-h-screen bg-black text-white">
    
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-light tracking-wide mb-6">
            YOUR TRUE SIDEREAL SIGNS
          </h1>
          <p className="text-lg md:text-xl text-gray-300 mb-4">
            Input your birth details below to see your true sidereal signs and mini-report.
          </p>
        </div>
      </section>

    
      <section className="py-12 px-4 bg-white text-black">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-6 text-justify leading-relaxed">
          <p>
  True sidereal astrology uses the 13 visible constellations in the sky (including Ophiuchus). The list is where the planets were visibly in the sky when you were born. This is different from mainstream tropical and sidereal astrology which do not use the visible constellations in the sky.
</p>
            <p className="font-medium">
              Noticing your signs are different from other calculators or new to true sidereal astrology?
            </p>
          </div>
          <hr className="border-gray-300 my-12" />

         
          <div className="space-y-8">
            <h2 className="text-3xl md:text-4xl font-light text-center mb-8">
              BIRTH DETAILS
            </h2>

            <div className="space-y-6">
              <div>
                <label className="block text-gray-800 font-medium mb-2">
                  Name: <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 focus:border-black focus:outline-none transition"
                  placeholder="Enter your name"
                />
              </div>

              <div>
                <label className="block text-gray-800 font-medium mb-2">
                  Date (dd-month-yyyy): <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <input
                    type="number"
                    min="1"
                    max="31"
                    value={formData.day}
                    onChange={(e) => setFormData({...formData, day: e.target.value})}
                    className="px-4 py-3 border border-gray-300 focus:border-black focus:outline-none transition"
                    placeholder="DD"
                  />
                  <select
                    value={formData.month}
                    onChange={(e) => setFormData({...formData, month: e.target.value})}
                    className="px-4 py-3 border border-gray-300 focus:border-black focus:outline-none transition"
                  >
                    {months.map((month, idx) => (
                      <option key={month} value={idx + 1}>{month}</option>
                    ))}
                  </select>
                  <input
                    type="number"
                    min="1900"
                    max="2100"
                    value={formData.year}
                    onChange={(e) => setFormData({...formData, year: e.target.value})}
                    className="px-4 py-3 border border-gray-300 focus:border-black focus:outline-none transition"
                    placeholder="YYYY"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="knowTime"
                  checked={formData.knowTime}
                  onChange={(e) => setFormData({...formData, knowTime: e.target.checked})}
                  className="w-5 h-5 border-gray-300 focus:ring-black"
                />
                <label htmlFor="knowTime" className="text-gray-800 font-medium cursor-pointer">
                  I know my birth time
                </label>
              </div>

              {formData.knowTime && (
                <div className="space-y-4 pl-8 border-l-2 border-gray-300">
                  <div>
                    <label className="block text-gray-800 font-medium mb-2">
                      Birth Time:
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="number"
                        min="0"
                        max="23"
                        value={formData.hour}
                        onChange={(e) => setFormData({...formData, hour: e.target.value})}
                        className="px-4 py-3 border border-gray-300 focus:border-black focus:outline-none transition"
                        placeholder="Hour (0-23)"
                      />
                      <input
                        type="number"
                        min="0"
                        max="59"
                        value={formData.minute}
                        onChange={(e) => setFormData({...formData, minute: e.target.value})}
                        className="px-4 py-3 border border-gray-300 focus:border-black focus:outline-none transition"
                        placeholder="Minute"
                      />
                    </div>
                  </div>
                  
                  <LocationSuggestionField
                    value={formData.location}
                    onChange={handleLocationChange}
                    name="location"
                    required={formData.knowTime}
                  />
                </div>
              )}

              <button
                onClick={handleCalculate}
                disabled={loading}
                className="w-full border-2 border-black px-8 py-4 text-lg font-medium hover:bg-black hover:text-white transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'CALCULATING...' : 'CALCULATE'}
              </button>

              {error && (
                <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
                  <p className="font-medium">Error:</p>
                  <p>{error}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

   
      {report && (
        <section className="py-16 px-4 bg-white text-black">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <p className="text-lg mb-2">
                <strong>Name:</strong> {formData.name}
              </p>
              <p className="text-lg mb-2">
                <strong>Date:</strong> {report.dateStr}
              </p>
              {report.location && formData.knowTime && (
                <p className="text-lg">
                  <strong>Location:</strong> {report.location}
                </p>
              )}
            </div>

            <h2 className="text-3xl md:text-4xl font-light mb-8">
              {formData.name}'s True Placements
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b-2 border-gray-300">
                    <th className="py-3 px-2 text-left font-medium">Planet</th>
                    <th className="py-3 px-2 text-center font-medium">Symbol</th>
                    <th className="py-3 px-2 text-left font-medium">Sign</th>
                    <th className="py-3 px-2 text-left font-medium">Position</th>
                  </tr>
                </thead>
                <tbody>
                  {report.placements.map((placement, index) => (
                    <tr key={index} className="border-b border-gray-200 hover:bg-gray-50 transition">
                      <td className="py-4 px-2 font-medium text-left">{placement.planet}</td>
                      <td className="py-4 px-2 text-3xl text-center">
                        {zodiacSymbols[placement.sign] || '—'}
                      </td>
                      <td className="py-4 px-2 text-left">{placement.sign}</td>
                      <td className="py-4 px-2 text-left text-sm text-gray-600">{placement.position}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-12 p-6 bg-gray-100 border-l-4 border-black">
  <p className="text-gray-700 leading-relaxed">
    These placements represent where the celestial bodies were actually positioned in the 13 visible constellations (including Ophiuchus) at your birth. They may differ from tropical astrology calculations which use a fixed 12-sign zodiac system.
  </p>
</div>

            {!formData.knowTime && (
              <div className="mt-6 p-4 bg-yellow-50 border-l-4 border-yellow-500">
                <p className="text-yellow-800">
                  <strong>Note:</strong> For more accurate calculations, especially for Moon and Rising signs, please provide your exact birth time and location.
                </p>
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
}