import React, { useState } from 'react';
import axios from 'axios';
import AstrologyChart from './components/astrologychart';
import AstrologyPlacements from './components/astrologyplacement';
import { Link } from 'react-router-dom';
import LocationSuggestionField from './components/locationsuggestionfield';
import { BASE_URL } from './baseurl';

const ChartCalculator = () => {
    const [formData, setFormData] = useState({
        name: '',
        day: '',
        month: '',
        year: '',
        hour: '',
        minute: '',
        location: '',
        latitude: null,
        longitude: null,
        unknownTime: false
    });

    const [loading, setLoading] = useState(false);
    const [chartData, setChartData] = useState(null);
    const [error, setError] = useState(null);
    const [activeView, setActiveView] = useState('charts');
    const [selectedPlanet, setSelectedPlanet] = useState(null);
    
    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const planetConfig = {
        Sun: { symbol: '☉', color: '#000000', displayColor: '#FFD700', size: 24 },
        Moon: { symbol: '☽', color: '#000000', displayColor: '#E8E8E8', size: 20 },
        Mercury: { symbol: '☿', color: '#000000', displayColor: '#B0B0B0', size: 16 },
        Venus: { symbol: '♀', color: '#000000', displayColor: '#FFB6C1', size: 18 },
        Mars: { symbol: '♂', color: '#000000', displayColor: '#FF4500', size: 18 },
        Jupiter: { symbol: '♃', color: '#000000', displayColor: '#FFA500', size: 22 },
        Saturn: { symbol: '♄', color: '#000000', displayColor: '#DAA520', size: 20 },
        Uranus: { symbol: '♅', color: '#000000', displayColor: '#40E0D0', size: 18 },
        Neptune: { symbol: '♆', color: '#000000', displayColor: '#4169E1', size: 18 },
        Pluto: { symbol: '♇', color: '#000000', displayColor: '#9370DB', size: 14 }
    };

    const aspectConfig = {
        'Conjunction': { angle: 0, color: '#FF0000', strokeWidth: 3, tolerance: 10 },
        'Sextile': { angle: 60, color: '#00FF00', strokeWidth: 2, tolerance: 8 },
        'Square': { angle: 90, color: '#FF8C00', strokeWidth: 2.5, tolerance: 8 },
        'Trine': { angle: 120, color: '#0066FF', strokeWidth: 2, tolerance: 8 },
        'Opposition': { angle: 180, color: '#FF00FF', strokeWidth: 3, tolerance: 10 }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleLocationChange = (valueOrObject) => {
        if (typeof valueOrObject === 'string') {
            setFormData(prev => ({
                ...prev,
                location: valueOrObject
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                location: valueOrObject.name,
                latitude: valueOrObject.latitude,
                longitude: valueOrObject.longitude
            }));
        }
    };

   
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
    
        try {
            if (!formData.day || !formData.month || !formData.year) {
                throw new Error('Please fill in all date fields');
            }
            if (!formData.location || formData.latitude === null || formData.longitude === null) {
                throw new Error('Please select a valid location');
            }
    
            const formattedDate = `${formData.year}-${String(parseInt(formData.month) + 1).padStart(2, '0')}-${String(formData.day).padStart(2, '0')}`;
            const formattedTime = formData.unknownTime 
                ? '12:00' 
                : `${String(formData.hour || 12).padStart(2, '0')}:${String(formData.minute || 0).padStart(2, '0')}`;
    
            const payload = {
                birth_date: formattedDate,
                birth_time: formattedTime,
                latitude: formData.latitude,
                longitude: formData.longitude,
                timezone: '+00:00'
            };
    
            const response = await axios.post(`${BASE_URL}/chart/natal`, payload);
    
        
            const apiData = response.data.data || response.data;
            
         
            
            const enhancedChartData = {
                ...apiData,
                birthInfo: {
                    date: formattedDate,
                    time: formattedTime,
                    location: {
                        latitude: formData.latitude,
                        longitude: formData.longitude,
                        name: formData.location
                    },
                    timezone: '+00:00'
                },
                personName: formData.name
            };
           
            setChartData(enhancedChartData);
        } catch (err) {
            console.error('Error:', err);
            setError(err.response?.data?.message || err.message || 'An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };



    const zodiacConstellations = [
        { name: 'Aries', symbol: '♈', start: 28.687, end: 53.417, color: '#FF6B6B' },
        { name: 'Taurus', symbol: '♉', start: 53.417, end: 90.140, color: '#FFA07A' },
        { name: 'Gemini', symbol: '♊', start: 90.140, end: 117.988, color: '#FFD93D' },
        { name: 'Cancer', symbol: '♋', start: 117.988, end: 138.038, color: '#A8E6CF' },
        { name: 'Leo', symbol: '♌', start: 138.038, end: 173.851, color: '#95E1D3' },
        { name: 'Virgo', symbol: '♍', start: 173.851, end: 217.810, color: '#6BCB77' },
        { name: 'Libra', symbol: '♎', start: 217.810, end: 241.057, color: '#4D96FF' },
        { name: 'Scorpius', symbol: '♏', start: 241.057, end: 247.920, color: '#6A5ACD' },  // Changed name & boundaries
        { name: 'Ophiuchus', symbol: '⛎', start: 247.920, end: 266.560, color: '#8B4789' }, // Added 13th sign
        { name: 'Sagittarius', symbol: '♐', start: 266.560, end: 299.710, color: '#9B59B6' },
        { name: 'Capricornus', symbol: '♑', start: 299.710, end: 327.780, color: '#B565A7' }, // Changed name & boundaries
        { name: 'Aquarius', symbol: '♒', start: 327.780, end: 351.520, color: '#E56B6F' },
        { name: 'Pisces', symbol: '♓', start: 351.520, end: 388.687, color: '#FF6B9D' }  // Extends past 360° to wrap around
    ];

    const generateStars = (count) => {
        const stars = [];
        for (let i = 0; i < count; i++) {
            stars.push({
                x: Math.random() * 800,
                y: Math.random() * 800,
                size: Math.random() * 2 + 0.5,
                opacity: Math.random() * 0.5 + 0.3
            });
        }
        return stars;
    };

    const [stars] = useState(generateStars(200));

    const getEclipticPosition = (longitude, distance = 280) => {
        const angle = (longitude - 90) * (Math.PI / 180);
        return {
            x: distance * Math.cos(angle),
            y: distance * Math.sin(angle)
        };
    };

    const getConstellationArc = (start, end, radius) => {
        const startAngle = (start - 90) * (Math.PI / 180);
        const endAngle = (end - 90) * (Math.PI / 180);
        const startX = radius * Math.cos(startAngle);
        const startY = radius * Math.sin(startAngle);
        const endX = radius * Math.cos(endAngle);
        const endY = radius * Math.sin(endAngle);
        const largeArc = (end - start) > 180 ? 1 : 0;
        return `M ${startX} ${startY} A ${radius} ${radius} 0 ${largeArc} 1 ${endX} ${endY}`;
    };

    const renderAspectLines = () => {
        if (!chartData || !chartData.aspects) return null;

       
        const uniqueAspects = [];
        const seenAspects = new Set();

        chartData.aspects.forEach(aspect => {
            const key = [aspect.planet1, aspect.planet2].sort().join('-') + aspect.aspect;
            if (!seenAspects.has(key)) {
                seenAspects.add(key);
                uniqueAspects.push(aspect);
            }
        });

        return uniqueAspects.map((aspect, idx) => {
            const planet1 = chartData.planets?.[aspect.planet1];
            const planet2 = chartData.planets?.[aspect.planet2];

            if (!planet1 || !planet2) return null;

            const pos1 = getEclipticPosition(parseFloat(planet1.longitude), 280);
            const pos2 = getEclipticPosition(parseFloat(planet2.longitude), 280);
            
            const config = aspectConfig[aspect.aspect] || { color: '#CCCCCC', strokeWidth: 1 };

            return (
                <line
                    key={`aspect-${idx}`}
                    x1={pos1.x}
                    y1={pos1.y}
                    x2={pos2.x}
                    y2={pos2.y}
                    stroke={config.color}
                    strokeWidth={config.strokeWidth}
                    opacity="0.3"
                    strokeDasharray="5,3"
                />
            );
        });
    };

    const encodeChartData = (data) => {
        try {
            const jsonString = JSON.stringify(data);
       
            const encoded = btoa(encodeURIComponent(jsonString));
            return encoded;
        } catch (error) {
            console.error('Error encoding data:', error);
            return null;
        }
    };

    const renderSkyView = () => {
        if (!chartData) return null;
    
        const size = 800;
        const center = 0;
        const skyRadius = 360;
    
      
        const ascendantLongitude = parseFloat(chartData.ascendant?.longitude || 0);
        const horizonStart = getEclipticPosition(ascendantLongitude, 380);
        const horizonEnd = getEclipticPosition((ascendantLongitude + 180) % 360, 380);
        const mcLongitude = parseFloat(chartData.midheaven?.longitude || (ascendantLongitude + 90) % 360);
        const meridianTop = getEclipticPosition(mcLongitude, 380);
        const meridianBottom = getEclipticPosition((mcLongitude + 180) % 360, 380);
    
        return (
            <svg viewBox={`${-size / 2} ${-size / 2} ${size} ${size}`} className="w-full max-w-3xl mx-auto">
                <defs>
                    <radialGradient id="skyGradient" cx="50%" cy="50%">
                        <stop offset="0%" stopColor="#1a1a2e" stopOpacity="1" />
                        <stop offset="70%" stopColor="#16213e" stopOpacity="1" />
                        <stop offset="100%" stopColor="#0f3460" stopOpacity="1" />
                    </radialGradient>
                    <filter id="glow">
                        <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                        <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
                    </filter>
                    <filter id="planetGlow">
                        <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                        <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
                    </filter>
                </defs>
    
                <circle cx={center} cy={center} r={skyRadius} fill="url(#skyGradient)" />
    
                {stars.map((star, i) => (
                    <circle key={i} cx={star.x - 400} cy={star.y - 400} r={star.size} fill="white" opacity={star.opacity}>
                        <animate attributeName="opacity" values={`${star.opacity};${star.opacity * 0.3};${star.opacity}`}
                            dur={`${2 + Math.random() * 3}s`} repeatCount="indefinite" />
                    </circle>
                ))}
    
                <circle cx={center} cy={center} r={280} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="2" strokeDasharray="10,5" />
    
          
                {renderAspectLines()}
    
                {zodiacConstellations.map((constellation) => {
                    const midPoint = constellation.start + (constellation.end - constellation.start) / 2;
                    const labelPos = getEclipticPosition(midPoint, 320);
                    const arcEnd = constellation.name === 'Pisces' ? constellation.end - 360 : constellation.end;
    
                    return (
                        <g key={constellation.name}>
                            <path d={getConstellationArc(constellation.start, arcEnd > 360 ? 360 : constellation.end, 280)}
                                fill="none" stroke={constellation.color} strokeWidth="3" opacity="0.4" filter="url(#glow)" />
                            <text x={labelPos.x} y={labelPos.y} fontSize="32" fontWeight="bold" fill={constellation.color}
                                textAnchor="middle" dominantBaseline="middle" opacity="0.7" filter="url(#glow)">
                                {constellation.symbol}
                            </text>
                            <text x={getEclipticPosition(midPoint, 355).x} y={getEclipticPosition(midPoint, 355).y} fontSize="12"
                                fill={constellation.color} textAnchor="middle" dominantBaseline="middle" opacity="0.8" fontWeight="600">
                                {constellation.name}
                            </text>
                        </g>
                    );
                })}
    
                <line x1={horizonStart.x} y1={horizonStart.y} x2={horizonEnd.x} y2={horizonEnd.y} stroke="#FF6B6B"
                    strokeWidth="3" opacity="0.8" strokeDasharray="15,5" filter="url(#glow)" />
                <line x1={meridianTop.x} y1={meridianTop.y} x2={meridianBottom.x} y2={meridianBottom.y} stroke="#4169E1"
                    strokeWidth="3" opacity="0.8" strokeDasharray="15,5" filter="url(#glow)" />
    
                <g>
                    <circle cx={horizonStart.x} cy={horizonStart.y} r="8" fill="#FF6B6B" filter="url(#planetGlow)" />
                    <text x={horizonStart.x} y={horizonStart.y - 20} fontSize="14" fontWeight="bold" fill="#FF6B6B" textAnchor="middle">ASC</text>
                </g>
                <g>
                    <circle cx={meridianTop.x} cy={meridianTop.y} r="8" fill="#4169E1" filter="url(#planetGlow)" />
                    <text x={meridianTop.x + 25} y={meridianTop.y} fontSize="14" fontWeight="bold" fill="#4169E1" textAnchor="middle">MC</text>
                </g>
    
                {chartData.planets && Object.entries(chartData.planets).map(([planetName, planetData]) => {
                    const longitude = parseFloat(planetData.longitude);
                    const pos = getEclipticPosition(longitude, 280);
                    const config = planetConfig[planetName];
                    
                    if (!config) return null;  
                    
                    const labelOffset = 35;
                    const angle = (longitude - 90) * (Math.PI / 180);
                    const labelX = pos.x + Math.cos(angle) * labelOffset;
                    const labelY = pos.y + Math.sin(angle) * labelOffset;
    
                    return (
                        <g key={planetName}>
                            <circle cx={pos.x} cy={pos.y} r={config.size / 2 + 8} fill={config.displayColor} opacity="0.2" filter="url(#planetGlow)" />
                            <circle cx={pos.x} cy={pos.y} r={config.size / 2 + 4} fill="rgba(0,0,0,0.6)" stroke={config.displayColor} strokeWidth="2" />
                            <text x={pos.x} y={pos.y} fontSize={config.size} fill={config.displayColor} textAnchor="middle"
                                dominantBaseline="middle" fontWeight="bold" filter="url(#glow)">
                                {config.symbol}
                            </text>
                            <g>
                                <rect x={labelX - 35} y={labelY - 20} width="70" height="38" fill="rgba(0,0,0,0.8)"
                                    stroke={config.displayColor} strokeWidth="1" rx="5" opacity="0.9" />
                                <text x={labelX} y={labelY - 8} fontSize="11" fill="white" textAnchor="middle" fontWeight="bold">{planetName}</text>
                                <text x={labelX} y={labelY + 5} fontSize="9" fill={config.displayColor} textAnchor="middle" fontWeight="600">{planetData.sign}</text>
                                <text x={labelX} y={labelY + 15} fontSize="8" fill="#AAA" textAnchor="middle">{planetData.position}</text>
                            </g>
                        </g>
                    );
                })}
    
                <circle cx={center} cy={center} r="4" fill="white" opacity="0.5" />
            </svg>
        );
    };
    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-[26px] md:text-[30px] font-light text-center mb-4">
                    TRUE SIDEREAL CHART CALCULATOR
                </h1>
                <hr className="border-gray-300 mb-8" />

                <div className="text-center mb-8 space-y-4">
                <p className="font-semibold">
    This calculator uses the 13 visible constellations in the sky (including Ophiuchus).
</p>
                    <p className="text-gray-700 max-w-3xl mx-auto text-sm">
    It uses the midpoint between constellations as the sign boundaries, including <strong>Ophiuchus as the 13th sign</strong>. This calculator is essentially a <strong>planetarium in astrology chart form</strong>.
</p>
                </div>

                {!chartData ? (
                    <div className="bg-white rounded-lg shadow-lg p-8 max-w-xl mx-auto border border-gray-200">
                        <h2 className="text-2xl font-semibold mb-6 text-center">BIRTH DETAILS</h2>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-gray-700 mb-2">Name:</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-gray-700 mb-2">Date (dd-month-yyyy):</label>
                                <div className="flex md:flex-row flex-col gap-2">
                                    <input
                                        type="number"
                                        name="day"
                                        placeholder="DD"
                                        min="1"
                                        max="31"
                                        value={formData.day}
                                        onChange={handleChange}
                                        className="w-20 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        required
                                    />
                                    <select
                                        name="month"
                                        value={formData.month}
                                        onChange={handleChange}
                                        className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        required
                                    >
                                        <option value="">Select Month</option>
                                        {months.map((month, index) => (
                                            <option key={month} value={index}>{month}</option>
                                        ))}
                                    </select>
                                    <input
                                        type="number"
                                        name="year"
                                        placeholder="YYYY"
                                        min="1900"
                                        max="2100"
                                        value={formData.year}
                                        onChange={handleChange}
                                        className="w-24 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-gray-700 mb-2">Time (hh-mm):</label>
                                <div className="flex gap-2 items-center">
                                    <input
                                        type="number"
                                        name="hour"
                                        placeholder="HH"
                                        min="0"
                                        max="23"
                                        value={formData.hour}
                                        onChange={handleChange}
                                        disabled={formData.unknownTime}
                                        className="w-20 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100"
                                    />
                                    <span>:</span>
                                    <input
                                        type="number"
                                        name="minute"
                                        placeholder="MM"
                                        min="0"
                                        max="59"
                                        value={formData.minute}
                                        onChange={handleChange}
                                        disabled={formData.unknownTime}
                                        className="w-20 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100"
                                    />
                                    <span className="text-sm text-gray-600">(24-hour)</span>
                                </div>
                                <label className="flex items-center mt-2">
                                    <input
                                        type="checkbox"
                                        name="unknownTime"
                                        checked={formData.unknownTime}
                                        onChange={handleChange}
                                        className="mr-2"
                                    />
                                    <span className="text-sm text-gray-700">unknown time</span>
                                </label>
                            </div>

                            <LocationSuggestionField
                                value={formData.location}
                                onChange={handleLocationChange}
                                name="location"
                                required={true}
                            />

                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                                    {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded transition-colors disabled:bg-gray-400"
                            >
                                {loading ? 'Calculating...' : 'Calculate'}
                            </button>
                        </form>
                    </div>
                ) : (
                    <div className="bg-white rounded-lg shadow-lg p-8">
                        {loading ? (
                            <div className="text-center py-12">
                                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                                <p className="mt-4 text-gray-600">Calculating planetary positions...</p>
                            </div>
                        ) : (
                            <div>
                                <div className="mb-6 md:mb-8">
                                    <p className="text-center text-sm md:text-base"><strong>Name:</strong> {formData.name}</p>
                                    <p className="text-center text-sm md:text-base"><strong>Date:</strong> {chartData.birthInfo.date} at {chartData.birthInfo.time}</p>
                                    <p className="text-center text-sm md:text-base"><strong>Location:</strong> {chartData.birthInfo.location.name}</p>
                                </div>
                                <div className="mb-6">
                                    {activeView === 'charts' && <AstrologyChart data={chartData} />}
                                    {activeView === 'skyview' && renderSkyView()}
                                    {activeView === 'placements' && <AstrologyPlacements data={chartData} />}
                                </div>
                                <div className="flex justify-center gap-2 md:gap-8 mb-6 md:mb-8 border-b border-gray-200 overflow-x-auto">
                                    <button
                                        onClick={() => setActiveView('charts')}
                                        className={`px-3 md:px-6 py-2 md:py-3 text-sm md:text-base font-semibold transition-colors whitespace-nowrap ${activeView === 'charts'
                                            ? 'text-indigo-600 border-b-2 border-indigo-600'
                                            : 'text-gray-500 hover:text-gray-700'
                                        }`}
                                    >
                                        Charts
                                    </button>
                                    <button
                                        onClick={() => setActiveView('placements')}
                                        className={`px-3 md:px-6 py-2 md:py-3 text-sm md:text-base font-semibold transition-colors whitespace-nowrap ${activeView === 'placements'
                                            ? 'text-indigo-600 border-b-2 border-indigo-600'
                                            : 'text-gray-500 hover:text-gray-700'
                                        }`}
                                    >
                                        Placements
                                    </button>
                                    <button
                                        onClick={() => setActiveView('skyview')}
                                        className={`px-3 md:px-6 py-2 md:py-3 text-sm md:text-base font-semibold transition-colors whitespace-nowrap ${activeView === 'skyview'
                                            ? 'text-indigo-600 border-b-2 border-indigo-600'
                                            : 'text-gray-500 hover:text-gray-700'
                                        }`}
                                    >
                                        SKY VIEW
                                    </button>
                                </div>
                                {activeView === 'charts' && (
                                    <div>
                                        {selectedPlanet && (
                                            <div className="mb-4 md:mb-6 p-3 md:p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
                                                <h3 className="font-bold text-indigo-900 mb-2 flex items-center justify-center gap-2 text-base md:text-lg">
                                                    <span className="text-xl md:text-2xl">{planetConfig[selectedPlanet].symbol}</span>
                                                    {selectedPlanet}
                                                </h3>
                                                <div className="text-xs md:text-sm text-gray-700 space-y-1">
                                                    <p><span className="font-semibold">Sign:</span> {chartData.planets?.[selectedPlanet]?.sign || 'N/A'}</p>
                                                    <p><span className="font-semibold">Position:</span> {chartData.planets?.[selectedPlanet]?.position || 'N/A'}</p>
                                                    <p><span className="font-semibold">Degree:</span> {chartData.planets?.[selectedPlanet]?.degree || 'N/A'}°</p>
                                                </div>
                                                <button
                                                    onClick={() => setSelectedPlanet(null)}
                                                    className="mt-3 w-full px-4 py-2 bg-indigo-600 text-white rounded-md text-xs md:text-sm hover:bg-indigo-700 transition-colors"
                                                >
                                                    Close
                                                </button>
                                            </div>
                                        )}

                                        <div className="space-y-4 md:space-y-6">
                                            <div>
                                                <h3 className="text-lg md:text-2xl font-semibold mb-2 md:mb-4 flex items-center">
                                                    <span className="text-yellow-500 mr-2 text-2xl md:text-3xl">☉</span>
                                                    <span className="text-sm md:text-2xl">SUN: YOUR VITAL LIFE FORCE</span>
                                                </h3>
                                                <h4 className="text-base md:text-xl font-semibold mb-2">Sun in {chartData.planets?.Sun?.sign || 'N/A'}</h4>
                                                <p className="text-sm md:text-base text-gray-700">
                                                    Your Sun sign shows the lens through which you view life.
                                                    Position: {chartData.planets?.Sun?.position || 'N/A'}
                                                </p>
                                            </div>

                                            <div>
                                                <h3 className="text-lg md:text-2xl font-semibold mb-2 md:mb-4 flex items-center">
                                                    <span className="text-gray-400 mr-2 text-2xl md:text-3xl">☽</span>
                                                    <span className="text-sm md:text-2xl">MOON: YOUR INNER WORLD</span>
                                                </h3>
                                                <h4 className="text-base md:text-xl font-semibold mb-2">Moon in {chartData.planets?.Moon?.sign || 'N/A'}</h4>
                                                <p className="text-sm md:text-base text-gray-700">
                                                    Your Moon sign shows what you are emotionally attuned to and your inner personality.
                                                    Position: {chartData.planets?.Moon?.position || 'N/A'}
                                                </p>
                                            </div>

                                            <div>
                                                <h3 className="text-lg md:text-2xl font-semibold mb-2 md:mb-4 flex items-center">
                                                    <span className="mr-2 text-2xl md:text-3xl">↑</span>
                                                    <span className="text-sm md:text-2xl">ASCENDANT: WHO YOU ARE DESTINED TO BECOME</span>
                                                </h3>
                                                <h4 className="text-base md:text-xl font-semibold mb-2">{chartData.ascendant?.sign || 'N/A'} Ascendant</h4>
                                                <p className="text-sm md:text-base text-gray-700">
                                                    The ascendant shows what personality characteristics life is helping you develop.
                                                    Position: {chartData.ascendant?.position || 'N/A'}
                                                </p>
                                            </div>

                                            <div className="border-t pt-4 md:pt-6">
                                                <h3 className="text-lg md:text-xl font-semibold mb-3 md:mb-4">All Planetary Positions</h3>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                                                    {chartData.planets && Object.entries(chartData.planets).map(([planetName, planetData]) => {
                                                        const config = planetConfig[planetName];
                                                        const isSelected = selectedPlanet === planetName;
                                                        return (
                                                            <div
                                                                key={planetName}
                                                                onClick={() => setSelectedPlanet(planetName === selectedPlanet ? null : planetName)}
                                                                className={`p-3 rounded cursor-pointer transition-colors border ${isSelected
                                                                    ? 'bg-indigo-50 border-indigo-300'
                                                                    : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                                                                }`}
                                                            >
                                                                <div className="flex items-center justify-between">
                                                                    <div className="flex items-center gap-2">
                                                                        <span className="text-lg md:text-xl">{config.symbol}</span>
                                                                        <span className={`font-medium text-sm md:text-base ${isSelected ? 'text-indigo-900' : 'text-gray-900'}`}>
                                                                            {planetName}
                                                                        </span>
                                                                    </div>
                                                                    <div className="text-right">
                                                                        <div className={`font-semibold text-sm md:text-base ${isSelected ? 'text-indigo-900' : 'text-gray-900'}`}>
                                                                            {planetData.sign}
                                                                        </div>
                                                                        <div className="text-xs text-gray-500">{planetData.position}</div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {activeView === 'skyview' && (
                                    <div className="mt-4 md:mt-6">
                                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 md:p-4 mb-4 md:mb-6">
                                            <h3 className="font-bold text-blue-900 mb-2 text-sm md:text-base">Sky View Chart</h3>
                                            <p className="text-xs md:text-sm text-gray-700">
                                                This view shows the actual celestial positions as they appear in the night sky from your birth location.
                                                The colored arcs represent the true constellation boundaries along the ecliptic.
                                            </p>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 text-sm mb-4">
                                            <div className="bg-slate-800 text-white rounded-lg p-3">
                                                <h4 className="font-bold text-red-400 mb-2 flex items-center gap-2 text-sm md:text-base">
                                                    <span className="text-base md:text-lg">━━</span> Horizon
                                                </h4>
                                                <p className="text-gray-300 text-xs">Ascendant-Descendant axis (Rising-Setting)</p>
                                            </div>

                                            <div className="bg-slate-800 text-white rounded-lg p-3">
                                                <h4 className="font-bold text-blue-400 mb-2 flex items-center gap-2 text-sm md:text-base">
                                                    <span className="text-base md:text-lg">━━</span> Meridian
                                                </h4>
                                                <p className="text-gray-300 text-xs">Midheaven-IC axis (Highest-Lowest)</p>
                                            </div>

                                            <div className="bg-slate-800 text-white rounded-lg p-3">
                                                <h4 className="font-bold text-purple-400 mb-2 text-sm md:text-base">View Type</h4>
                                                <p className="text-gray-300 text-xs">Flat ecliptic projection from Earth</p>
                                            </div>
                                        </div>

                                        <div className="bg-slate-800 text-white rounded-lg p-3 md:p-4">
                                            <h4 className="font-bold text-yellow-400 mb-3 text-sm md:text-base">Aspect Legend</h4>
                                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-4 h-0.5" style={{backgroundColor: '#FF0000'}}></div>
                                                    <span>Conjunction (0°)</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <div className="w-4 h-0.5" style={{backgroundColor: '#00FF00'}}></div>
                                                    <span>Sextile (60°)</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <div className="w-4 h-0.5" style={{backgroundColor: '#FF8C00'}}></div>
                                                    <span>Square (90°)</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <div className="w-4 h-0.5" style={{backgroundColor: '#0066FF'}}></div>
                                                    <span>Trine (120°)</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <div className="w-4 h-0.5" style={{backgroundColor: '#FF00FF'}}></div>
                                                    <span>Opposition (180°)</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                <div className="flex flex-col md:flex-row justify-center gap-3 md:gap-4 mt-6 md:mt-8">
                                    <button
                                        onClick={() => {
                                           window.location.reload(true)
                                        }}
                                        className="px-6 py-2 border-2 border-gray-300 rounded hover:bg-gray-50 font-semibold text-sm md:text-base"
                                    >
                                        Calculate New Chart
                                    </button>
                                    <Link  to={`/full-report?data=${encodeChartData(chartData)}`} className="px-6 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 font-semibold text-sm md:text-base">
                                        Get Full Report
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChartCalculator;