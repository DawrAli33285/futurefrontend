import React from 'react';

const AstrologyPlacements = ({ data: responseData }) => {

  const data = responseData?.data || responseData;
  const personName = responseData?.personName;


  const signColors = {
    'Aries': 'text-red-500',
    'Taurus': 'text-green-600',
    'Gemini': 'text-yellow-500',
    'Cancer': 'text-blue-300',
    'Leo': 'text-orange-500',
    'Virgo': 'text-teal-400',
    'Libra': 'text-pink-400',
    'Scorpius': 'text-cyan-400',        
    'Ophiuchus': 'text-emerald-500',  
    'Sagittarius': 'text-purple-500',
    'Capricornus': 'text-purple-600',  
    'Aquarius': 'text-pink-500',
    'Pisces': 'text-blue-400'
  };
 
  const planetSymbols = {
    'Sun': '☉',
    'Moon': '☽',
    'Mercury': '☿',
    'Venus': '♀',
    'Mars': '♂',
    'Jupiter': '♃',
    'Saturn': '♄',
    'Uranus': '♅',
    'Neptune': '♆',
    'Pluto': '♇'
  };

 
  const getHouseForPlanet = (planetLongitude) => {
    if (!data?.houses) return null;
    
    const longitude = parseFloat(planetLongitude);
    
    for (let i = 0; i < data.houses.length; i++) {
      const currentHouse = parseFloat(data.houses[i].longitude);
      const nextHouse = parseFloat(data.houses[(i + 1) % data.houses.length].longitude);
      
  
      if (nextHouse < currentHouse) {
        if (longitude >= currentHouse || longitude < nextHouse) {
          return `${data.houses[i].house}${getOrdinalSuffix(data.houses[i].house)} House`;
        }
      } else {
        if (longitude >= currentHouse && longitude < nextHouse) {
          return `${data.houses[i].house}${getOrdinalSuffix(data.houses[i].house)} House`;
        }
      }
    }
    return null;
  };


  const getOrdinalSuffix = (num) => {
    const j = num % 10;
    const k = num % 100;
    if (j === 1 && k !== 11) return 'st';
    if (j === 2 && k !== 12) return 'nd';
    if (j === 3 && k !== 13) return 'rd';
    return 'th';
  };

 
  const placements = [];

  if (data?.ascendant) {
    placements.push({
      symbol: '♈',
      name: 'Ascendant',
      sign: data.ascendant.sign,
      signColor: signColors[data.ascendant.sign] || 'text-gray-700',
      house: null,
      degree: Math.floor(parseFloat(data.ascendant.degree))  
    });
  }

  
  if (data?.planets) {
    Object.entries(data.planets).forEach(([name, planetData]) => {
      placements.push({
        symbol: planetSymbols[name] || '?',
        name: name,
        sign: planetData.sign,
        signColor: signColors[planetData.sign] || 'text-gray-700',
        house: getHouseForPlanet(planetData.longitude),
        degree: Math.floor(parseFloat(planetData.degree))  
      });
    });
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-3xl">
        <h1 className="text-[26px] md:text-[30px] font-light text-center mb-4">
          {personName ? `${personName.toUpperCase()}'S PLACEMENTS` : 'PLACEMENTS'}
        </h1>
        
        {responseData?.birthInfo && (
          <p className="text-center text-gray-600 text-sm mb-12">
            {responseData.birthInfo.date} • {responseData.birthInfo.location?.name}
          </p>
        )}

        <div className="space-y-2">
          {placements.map((placement, index) => (
            <div
              key={index}
              className="bg-gray-50 hover:bg-gray-100 transition-colors duration-200 rounded-lg p-4 border border-gray-200"
            >
              <div className="md:flex md:items-center">
                <div className="flex items-center gap-4 md:flex-1">
                  <span className="text-2xl w-8 text-center text-gray-700">
                    {placement.symbol}
                  </span>
                  <span className="text-gray-800 font-medium md:w-32">
                    {placement.name}
                  </span>
                  <span className={`font-bold text-lg ${placement.signColor} hidden md:inline`}>
                    {placement.sign} {placement.degree}°
                  </span>
                </div>
                <div className="md:hidden mt-2 ml-12">
                  <div className={`font-bold text-lg ${placement.signColor}`}>
                    {placement.sign} {placement.degree}°
                  </div>
                  {placement.house && (
                    <div className="text-gray-600 text-sm mt-1">
                      {placement.house}
                    </div>
                  )}
                </div>
                {placement.house && (
                  <span className="text-gray-600 text-sm hidden md:inline md:w-32 md:text-right">
                    {placement.house}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AstrologyPlacements;