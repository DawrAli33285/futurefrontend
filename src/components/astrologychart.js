import React from 'react';

const AstrologyChart = ({ data: responseData }) => {
 
  const data = responseData?.data || responseData;
  const birthInfo = responseData?.birthInfo;
  const personName = responseData?.personName;

  const AYANAMSA_2025 = 24.18;

  const zodiacSigns = [
    { name: 'Aries', symbol: '♈', color: '#E74C3C', start: 0, end: 51.16, width: 51.16 },
    { name: 'Taurus', symbol: '♉', color: '#E67E22', start: 51.16, end: 89.93, width: 38.77 },
    { name: 'Gemini', symbol: '♊', color: '#F39C12', start: 89.93, end: 118.46, width: 28.53 },
    { name: 'Cancer', symbol: '♋', color: '#F4D03F', start: 118.46, end: 138.45, width: 19.99 },
    { name: 'Leo', symbol: '♌', color: '#52C41A', start: 138.45, end: 174.24, width: 35.79 },
    { name: 'Virgo', symbol: '♍', color: '#17A589', start: 174.24, end: 218.38, width: 44.14 },
    { name: 'Libra', symbol: '♎', color: '#1ABC9C', start: 218.38, end: 241.79, width: 23.41 },
    { name: 'Scorpio', symbol: '♏', color: '#3498DB', start: 241.79, end: 248.89, width: 7.10 },
    { name: 'Ophiuchus', symbol: '⛎', color: '#9d4edd', start: 248.89, end: 266.82, width: 17.93 },
    { name: 'Sagittarius', symbol: '♐', color: '#9B59B6', start: 266.82, end: 299.93, width: 33.11 },
    { name: 'Capricorn', symbol: '♑', color: '#8E44AD', start: 299.93, end: 327.64, width: 27.71 },
    { name: 'Aquarius', symbol: '♒', color: '#C4569A', start: 327.64, end: 351.49, width: 23.85 },
    { name: 'Pisces', symbol: '♓', color: '#AD1457', start: 351.49, end: 360, width: 8.51 }
  ];

  // Convert tropical longitude to sidereal
const toSidereal = (tropicalLongitude) => {
  let sidereal = tropicalLongitude - AYANAMSA_2025;
  if (sidereal < 0) sidereal += 360;
  return sidereal;
};

// Get zodiac sign info from sidereal longitude
const getZodiacSign = (siderealLongitude) => {
  const normalized = ((siderealLongitude % 360) + 360) % 360;
  
  for (const sign of zodiacSigns) {
    if (sign.name === 'Pisces') {
      if (normalized >= sign.start || normalized < 0) {
        const degree = normalized >= sign.start ? normalized - sign.start : normalized + (360 - sign.start);
        return { ...sign, degreeInSign: degree };
      }
    } else {
      if (normalized >= sign.start && normalized < sign.end) {
        return { ...sign, degreeInSign: normalized - sign.start };
      }
    }
  }
  return { ...zodiacSigns[0], degreeInSign: 0 };
};



  const planetConfig = {
    Sun: { symbol: '☉', color: '#FFD700' },
    Moon: { symbol: '☽', color: '#C0C0C0' },
    Mercury: { symbol: '☿', color: '#A0A0A0' },
    Venus: { symbol: '♀', color: '#FF69B4' },
    Mars: { symbol: '♂', color: '#FF4500' },
    Jupiter: { symbol: '♃', color: '#FF8C00' },
    Saturn: { symbol: '♄', color: '#8B4513' },
    Uranus: { symbol: '♅', color: '#00CED1' },
    Neptune: { symbol: '♆', color: '#4169E1' },
    Pluto: { symbol: '♇', color: '#8B008B' }
  };

  const aspectColors = {
    'Conjunction': '#FF0000',
    'Sextile': '#52C41A',
    'Square': '#E74C3C',
    'Trine': '#3498DB',
    'Opposition': '#FF00FF'
  };

  const size = 600;
  const center = size / 2;
  const outerRadius = 280;
  const innerRadius = 180;
  const houseRadius = 160;
  const planetRadius = 220;

  const degToRad = (deg) => ((deg - 90) * Math.PI) / 180;

  const getPosition = (degree, radius) => {
    const rad = degToRad(degree);
    return {
      x: center + radius * Math.cos(rad),
      y: center + radius * Math.sin(rad)
    };
  };

  const getArcPath = (startDeg, endDeg, innerR, outerR) => {
    const start1 = getPosition(startDeg, outerR);
    const end1 = getPosition(endDeg, outerR);
    const start2 = getPosition(startDeg, innerR);
    const end2 = getPosition(endDeg, innerR);
    
    const largeArc = endDeg - startDeg > 180 ? 1 : 0;
    
    return `
      M ${start1.x} ${start1.y}
      A ${outerR} ${outerR} 0 ${largeArc} 1 ${end1.x} ${end1.y}
      L ${end2.x} ${end2.y}
      A ${innerR} ${innerR} 0 ${largeArc} 0 ${start2.x} ${start2.y}
      Z
    `;
  };


  const planets = data?.planets ? Object.entries(data.planets).map(([name, planetData]) => {
    const tropicalLongitude = parseFloat(planetData.longitude);
    const siderealLongitude = toSidereal(tropicalLongitude);
    const signInfo = getZodiacSign(siderealLongitude);
    
    return {
      name,
      symbol: planetConfig[name]?.symbol || '?',
      degree: siderealLongitude,
      tropicalDegree: tropicalLongitude,
      color: planetConfig[name]?.color || '#888888',
      sign: signInfo.name,
      signSymbol: signInfo.symbol,
      degreeInSign: signInfo.degreeInSign,
      position: planetData.position
    };
  }) : [];

  
  const houses = data?.houses ? data.houses.map(house => parseFloat(house.longitude)) : 
    [0, 25, 55, 85, 118, 148, 180, 205, 235, 265, 298, 328];


  const aspectsMap = new Map();
  if (data?.aspects) {
    data.aspects.forEach(aspect => {
      const planet1 = data.planets?.[aspect.planet1];
      const planet2 = data.planets?.[aspect.planet2];
      
      if (!planet1 || !planet2) return;
      
      const key = [aspect.planet1, aspect.planet2].sort().join('-') + '-' + aspect.aspect;
      
      if (!aspectsMap.has(key)) {
        aspectsMap.set(key, {
          from: parseFloat(planet1.longitude),
          to: parseFloat(planet2.longitude),
          type: aspect.aspect,
          color: aspectColors[aspect.aspect] || '#CCCCCC',
          orb: aspect.orb
        });
      }
    });
  }
  const aspects = Array.from(aspectsMap.values());

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
      <div className="md:p-8 p-4 w-full max-w-3xl">
        <div className="bg-white rounded-xl shadow-xl p-6">
          <div className="text-center mb-6">
            <h1 className="text-3xl md:text-4xl font-light text-indigo-900 mb-2">Birth Chart</h1>
            {personName && <p className="text-lg text-gray-700 font-medium">{personName}</p>}
            {birthInfo && (
              <>
                <p className="text-sm text-gray-600">{birthInfo.date} at {birthInfo.time}</p>
                <p className="text-sm text-gray-500">{birthInfo.location?.name}</p>
              </>
            )}
          </div>
          
          <div className="w-full aspect-square max-w-full">
            <svg viewBox={`0 0 ${size} ${size}`} className="drop-shadow-lg w-full h-full">
            {zodiacSigns.map((sign, idx) => {
  return (
    <g key={sign.name}>
      <path
        d={getArcPath(sign.start, sign.end, innerRadius, outerRadius)}
        fill={sign.color}
        stroke="white"
        strokeWidth="1"
        opacity="0.8"
      />
      <text
        x={getPosition((sign.start + sign.end) / 2, (outerRadius + innerRadius) / 2).x}
        y={getPosition((sign.start + sign.end) / 2, (outerRadius + innerRadius) / 2).y}
        fontSize={sign.name === 'Ophiuchus' ? '24' : '28'}
        fontWeight="bold"
        fill="white"
        textAnchor="middle"
        dominantBaseline="middle"
      >
        {sign.symbol}
      </text>
    </g>
  );
})}

              {Array.from({ length: 360 }, (_, i) => i).filter(i => i % 5 === 0).map(deg => {
                const isMain = deg % 30 === 0;
                const length = isMain ? 15 : 8;
                const start = getPosition(deg, outerRadius);
                const end = getPosition(deg, outerRadius - length);
                return (
                  <line
                    key={deg}
                    x1={start.x}
                    y1={start.y}
                    x2={end.x}
                    y2={end.y}
                    stroke={isMain ? "#333" : "#666"}
                    strokeWidth={isMain ? "2" : "1"}
                  />
                );
              })}

              <circle
                cx={center}
                cy={center}
                r={innerRadius}
                fill="white"
                stroke="#333"
                strokeWidth="2"
              />

              <circle
                cx={center}
                cy={center}
                r={houseRadius}
                fill="none"
                stroke="#9B59B6"
                strokeWidth="3"
              />

              {houses.map((house, idx) => {
                const inner = getPosition(house, 0);
                const outer = getPosition(house, houseRadius);
                const nextHouse = houses[(idx + 1) % 12];
                let midPoint = house + ((nextHouse > house ? nextHouse - house : (360 + nextHouse - house)) / 2);
                if (nextHouse < house) {
                  midPoint = midPoint % 360;
                }
                
                return (
                  <g key={idx}>
                    <line
                      x1={inner.x}
                      y1={inner.y}
                      x2={outer.x}
                      y2={outer.y}
                      stroke="#9B59B6"
                      strokeWidth="2"
                    />
                    <text
                      x={getPosition(midPoint, houseRadius - 20).x}
                      y={getPosition(midPoint, houseRadius - 20).y}
                      fontSize="14"
                      fontWeight="bold"
                      fill="#9B59B6"
                      textAnchor="middle"
                      dominantBaseline="middle"
                    >
                      {idx + 1}
                    </text>
                  </g>
                );
              })}

              {aspects.map((aspect, idx) => {
                const from = getPosition(aspect.from, 60);
                const to = getPosition(aspect.to, 60);
                const isDashed = aspect.type === 'Sextile' || aspect.type === 'Square';
                
                return (
                  <line
                    key={idx}
                    x1={from.x}
                    y1={from.y}
                    x2={to.x}
                    y2={to.y}
                    stroke={aspect.color}
                    strokeWidth="1.5"
                    opacity="0.5"
                    strokeDasharray={isDashed ? '5,5' : '0'}
                  />
                );
              })}

              {planets.map((planet) => {
                const pos = getPosition(planet.degree, planetRadius);
                const labelPos = getPosition(planet.degree, planetRadius + 30);
                const degreeInSign = planet.degree % 30;
                
                return (
                  <g key={planet.name}>
                    <line
                      x1={center}
                      y1={center}
                      x2={getPosition(planet.degree, innerRadius).x}
                      y2={getPosition(planet.degree, innerRadius).y}
                      stroke="#ccc"
                      strokeWidth="1"
                      opacity="0.5"
                    />
                    <circle
                      cx={pos.x}
                      cy={pos.y}
                      r="16"
                      fill="white"
                      stroke={planet.color}
                      strokeWidth="2"
                    />
                    <text
                      x={pos.x}
                      y={pos.y}
                      fontSize="18"
                      fill={planet.color}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fontWeight="bold"
                    >
                      {planet.symbol}
                    </text>
                    <text
  x={labelPos.x}
  y={labelPos.y}
  fontSize="11"
  fill="#333"
  textAnchor="middle"
  dominantBaseline="middle"
  fontWeight="600"
>
  {Math.floor(planet.degreeInSign)}°
</text>
                  </g>
                );
              })}

              <line x1={center} y1={center - 10} x2={center} y2={center + 10} stroke="#9B59B6" strokeWidth="2" />
              <line x1={center - 10} y1={center} x2={center + 10} y2={center} stroke="#9B59B6" strokeWidth="2" />
            </svg>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
            <div>
              <h3 className="font-bold text-indigo-900 mb-2">Inner Planets</h3>
              <div className="space-y-1">
                {planets.filter(p => ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars'].includes(p.name)).map(p => (
                  <div key={p.name} className="flex items-center gap-2">
                    <span style={{ color: p.color }} className="text-lg font-bold">{p.symbol}</span>
                    <span className="text-gray-700">{p.name}</span>
                    <span className="text-gray-500 text-xs">
  {p.signSymbol} {p.sign} {Math.floor(p.degreeInSign)}°
</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-bold text-indigo-900 mb-2">Outer Planets</h3>
              <div className="space-y-1">
                {planets.filter(p => ['Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto'].includes(p.name)).map(p => (
                  <div key={p.name} className="flex items-center gap-2">
                    <span style={{ color: p.color }} className="text-lg font-bold">{p.symbol}</span>
                    <span className="text-gray-700">{p.name}</span>
                    <span className="text-gray-500 text-xs">{p.sign} {Math.floor(p.degree % 30)}°</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {aspects.length > 0 && (
            <div className="mt-4">
              <h3 className="font-bold text-indigo-900 mb-2">Aspects</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs">
                {Object.entries(aspectColors).map(([aspect, color]) => (
                  <div key={aspect} className="flex items-center gap-2">
                    <div className="w-4 h-0.5" style={{ backgroundColor: color }}></div>
                    <span>{aspect}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AstrologyChart;