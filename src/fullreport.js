import React, { useState, useEffect } from 'react';
import { Star, Moon, Sun, Globe, ArrowLeft } from 'lucide-react';

export default function FullAstrologyReport() {
  const [chartData, setChartData] = useState(null);
  const [selectedSection, setSelectedSection] = useState('overview');
  const [loading, setLoading] = useState(true);

  
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const encodedData = params.get('data');
    
    if (encodedData) {
      try {
      
        const base64Decoded = atob(encodedData);
        const uriDecoded = decodeURIComponent(base64Decoded);
        const decoded = JSON.parse(uriDecoded);
       
        setChartData(decoded);
        setLoading(false);
      } catch (error) {
        console.error('Error decoding chart data:', error);
        console.error('Encoded data:', encodedData);
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);


  const signInterpretations = {
    'Aries': {
      element: 'Fire',
      quality: 'Cardinal',
      ruler: 'Mars ♂',
      traits: 'Bold, pioneering, energetic, assertive'
    },
    'Taurus': {
      element: 'Earth',
      quality: 'Fixed',
      ruler: 'Venus ♀',
      traits: 'Grounded, reliable, sensual, patient'
    },
    'Gemini': {
      element: 'Air',
      quality: 'Mutable',
      ruler: 'Mercury ☿',
      traits: 'Communicative, versatile, curious, adaptable'
    },
    'Cancer': {
      element: 'Water',
      quality: 'Cardinal',
      ruler: 'Moon ☽',
      traits: 'Nurturing, intuitive, emotional, protective'
    },
    'Leo': {
      element: 'Fire',
      quality: 'Fixed',
      ruler: 'Sun ☉',
      traits: 'Confident, creative, generous, dramatic'
    },
    'Virgo': {
      element: 'Earth',
      quality: 'Mutable',
      ruler: 'Mercury ☿',
      traits: 'Analytical, precise, practical, helpful'
    },
    'Libra': {
      element: 'Air',
      quality: 'Cardinal',
      ruler: 'Venus ♀',
      traits: 'Diplomatic, balanced, harmonious, social'
    },
   'Scorpius': { 
    element: 'Water',
    quality: 'Fixed',
    ruler: 'Mars ♂',
    traits: 'Intense, transformative, passionate, mysterious'
  },

    'Ophiuchus': {
      element: 'Water',
      quality: 'Fixed',
      ruler: 'Mars ♂',
      traits: 'Healing, wisdom-seeking, transformative, intuitive'
    },
    'Sagittarius': {
      element: 'Fire',
      quality: 'Mutable',
      ruler: 'Jupiter ♃',
      traits: 'Optimistic, philosophical, adventurous, honest'
    },
  'Capricornus': {  
    element: 'Earth',
    quality: 'Cardinal',
    ruler: 'Saturn ♄',
    traits: 'Ambitious, disciplined, responsible, strategic'
  },
    'Aquarius': {
      element: 'Air',
      quality: 'Fixed',
      ruler: 'Uranus ♅',
      traits: 'Innovative, humanitarian, independent, visionary'
    },
    'Pisces': {
      element: 'Water',
      quality: 'Mutable',
      ruler: 'Neptune ♆',
      traits: 'Compassionate, imaginative, intuitive, artistic'
    }
  };
  

  const aspectInterpretations = {
    'Conjunction': { angle: 0, nature: 'Merging', color: 'text-yellow-400' },
    'Opposition': { angle: 180, nature: 'Tension', color: 'text-red-400' },
    'Trine': { angle: 120, nature: 'Harmony', color: 'text-green-400' },
    'Square': { angle: 90, nature: 'Challenge', color: 'text-orange-400' },
    'Sextile': { angle: 60, nature: 'Opportunity', color: 'text-blue-400' }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-900 flex items-center justify-center">
        <div className="text-white text-2xl">Loading your cosmic blueprint...</div>
      </div>
    );
  }

  if (!chartData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-900 flex items-center justify-center">
        <div className="text-white text-center">
          <h2 className="text-3xl mb-4">No Chart Data Found</h2>
          <p className="text-gray-400">Please generate a chart first</p>
        </div>
      </div>
    );
  }

  const planets = chartData.planets || {};
  const ascendant = chartData.ascendant || {};
  const midheaven = chartData.midheaven || {};
  const aspects = chartData.aspects || [];
  const houses = chartData.houses || [];
  const birthInfo = chartData.birth_info || {};
  const composition = chartData.composition || {};

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-900 text-white">
   
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(100)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${2 + Math.random() * 4}s`
            }}
          />
        ))}
      </div>

    
      <div className="relative z-10 bg-black/30 backdrop-blur-md border-b border-purple-500/30">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold tracking-wider mb-2">
                True Sidereal Chart Report
              </h1>
              <p className="text-purple-300">
                Born: {birthInfo.date} at {birthInfo.time} {birthInfo.timezone}
              </p>
            </div>
            <div className="flex gap-3">
              <Star className="w-8 h-8 text-yellow-400 animate-pulse" />
              <Moon className="w-7 h-7 text-blue-300" />
              <Sun className="w-8 h-8 text-orange-400" />
            </div>
          </div>
        </div>
      </div>

   
      <div className="relative z-10 bg-black/20 backdrop-blur-sm border-b border-purple-500/20">
        <div className="container mx-auto px-6">
          <div className="flex gap-2 overflow-x-auto py-4">
            {['overview', 'planets', 'houses', 'aspects', 'composition'].map((section) => (
              <button
                key={section}
                onClick={() => setSelectedSection(section)}
                className={`px-6 py-2 rounded-full whitespace-nowrap transition-all ${
                  selectedSection === section
                    ? 'bg-purple-600 text-white'
                    : 'bg-white/5 text-gray-300 hover:bg-white/10'
                }`}
              >
                {section.charAt(0).toUpperCase() + section.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

     
      <div className="relative z-10 container mx-auto px-6 py-12">
        {selectedSection === 'overview' && (
          <div className="space-y-8">
       
            <div className="bg-gradient-to-br from-purple-600/20 to-indigo-600/20 backdrop-blur-lg rounded-2xl p-8 border border-purple-500/30">
              <div className="flex items-start gap-4 mb-6">
                <div className="text-5xl">⬆</div>
                <div>
                  <h2 className="text-3xl font-bold text-purple-200">
                    Ascendant in {ascendant.sign}
                  </h2>
                  <p className="text-purple-300 mt-1">
                    {ascendant.position} • {ascendant.degree}°
                  </p>
                  <p className="text-sm text-purple-400 mt-2">
                    Chart Ruler: {birthInfo.chart_ruler}
                  </p>
                </div>
              </div>
              
              {signInterpretations[ascendant.sign] && (
                <div className="mt-6 space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-black/30 rounded-lg p-4">
                      <p className="text-xs text-gray-400">Element</p>
                      <p className="text-lg font-semibold">{signInterpretations[ascendant.sign].element}</p>
                    </div>
                    <div className="bg-black/30 rounded-lg p-4">
                      <p className="text-xs text-gray-400">Quality</p>
                      <p className="text-lg font-semibold">{signInterpretations[ascendant.sign].quality}</p>
                    </div>
                    <div className="bg-black/30 rounded-lg p-4">
                      <p className="text-xs text-gray-400">Ruler</p>
                      <p className="text-lg font-semibold">{signInterpretations[ascendant.sign].ruler}</p>
                    </div>
                    <div className="bg-black/30 rounded-lg p-4">
                      <p className="text-xs text-gray-400">Traits</p>
                      <p className="text-sm">{signInterpretations[ascendant.sign].traits.split(',')[0]}</p>
                    </div>
                  </div>
                  
                  <p className="text-gray-200 leading-relaxed">
                    Your ascendant represents your outer personality and how you approach life. 
                    With {ascendant.sign} rising, you naturally embody {signInterpretations[ascendant.sign].traits.toLowerCase()} qualities.
                    This is the mask you wear and the first impression you make on others.
                  </p>
                </div>
              )}
            </div>

         
            <div className="bg-gradient-to-br from-indigo-600/20 to-blue-600/20 backdrop-blur-lg rounded-2xl p-8 border border-blue-500/30">
              <div className="flex items-start gap-4 mb-6">
                <div className="text-5xl">⭐</div>
                <div>
                  <h2 className="text-3xl font-bold text-blue-200">
                    Midheaven in {midheaven.sign}
                  </h2>
                  <p className="text-blue-300 mt-1">
                    {midheaven.position} • {midheaven.degree}°
                  </p>
                </div>
              </div>
              
              <p className="text-gray-200 leading-relaxed">
                Your Midheaven represents your public image, career path, and life goals. 
                In {midheaven.sign}, you're called to achieve recognition through the qualities of this sign.
              </p>
            </div>

         
            <div className="grid md:grid-cols-3 gap-6">
           
              <div className="bg-gradient-to-br from-orange-600/20 to-yellow-600/20 backdrop-blur-lg rounded-2xl p-6 border border-orange-500/30">
                <div className="text-4xl mb-3">☉</div>
                <h3 className="text-xl font-bold mb-2">Sun in {planets.Sun?.sign}</h3>
                <p className="text-sm text-gray-300 mb-2">{planets.Sun?.position}</p>
                <p className="text-xs text-gray-400">Your core identity and ego</p>
              </div>

              
              <div className="bg-gradient-to-br from-blue-600/20 to-cyan-600/20 backdrop-blur-lg rounded-2xl p-6 border border-blue-500/30">
                <div className="text-4xl mb-3">☽</div>
                <h3 className="text-xl font-bold mb-2">Moon in {planets.Moon?.sign}</h3>
                <p className="text-sm text-gray-300 mb-2">{planets.Moon?.position}</p>
                <p className="text-xs text-gray-400">Your emotions and inner world</p>
              </div>

             
              <div className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 backdrop-blur-lg rounded-2xl p-6 border border-purple-500/30">
                <div className="text-4xl mb-3">⬆</div>
                <h3 className="text-xl font-bold mb-2">Rising in {ascendant.sign}</h3>
                <p className="text-sm text-gray-300 mb-2">{ascendant.position}</p>
                <p className="text-xs text-gray-400">Your outer personality</p>
              </div>
            </div>
          </div>
        )}

        {selectedSection === 'planets' && (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold mb-6">Planetary Placements</h2>
            
            {Object.entries(planets).map(([planetName, planetData]) => (
              <div 
                key={planetName}
                className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-purple-500/20 hover:border-purple-500/40 transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="text-4xl">
                      {planetName === 'Sun' && '☉'}
                      {planetName === 'Moon' && '☽'}
                      {planetName === 'Mercury' && '☿'}
                      {planetName === 'Venus' && '♀'}
                      {planetName === 'Mars' && '♂'}
                      {planetName === 'Jupiter' && '♃'}
                      {planetName === 'Saturn' && '♄'}
                      {planetName === 'Uranus' && '♅'}
                      {planetName === 'Neptune' && '♆'}
                      {planetName === 'Pluto' && '♇'}
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold">{planetName} in {planetData.sign}</h3>
                      <p className="text-purple-300 mt-1">
                        {planetData.position} • {planetData.degree}°
                      </p>
                      
                      {signInterpretations[planetData.sign] && (
                        <div className="mt-4 grid grid-cols-3 gap-3 text-sm">
                          <div>
                            <span className="text-gray-400">Element: </span>
                            <span className="text-white">{signInterpretations[planetData.sign].element}</span>
                          </div>
                          <div>
                            <span className="text-gray-400">Quality: </span>
                            <span className="text-white">{signInterpretations[planetData.sign].quality}</span>
                          </div>
                          <div>
                            <span className="text-gray-400">Ruler: </span>
                            <span className="text-white">{signInterpretations[planetData.sign].ruler}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
            
                <div className="mt-4 pt-4 border-t border-purple-500/20">
                  <p className="text-xs text-gray-400 mb-2">Aspects:</p>
                  <div className="flex flex-wrap gap-2">
                    {aspects
                      .filter(a => a.planet1 === planetName || a.planet2 === planetName)
                      .map((aspect, idx) => (
                        <span 
                          key={idx}
                          className={`text-xs px-3 py-1 rounded-full bg-purple-600/30 ${aspectInterpretations[aspect.aspect]?.color || 'text-white'}`}
                        >
                          {aspect.aspect} {aspect.planet1 === planetName ? aspect.planet2 : aspect.planet1} (orb: {aspect.orb}°)
                        </span>
                      ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {selectedSection === 'houses' && (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold mb-6">House System</h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {houses.map((house) => (
                <div 
                  key={house.house}
                  className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-purple-500/20"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="text-3xl font-bold text-purple-400">{house.house}</div>
                    <div>
                      <h3 className="text-lg font-semibold">House {house.house}</h3>
                      <p className="text-sm text-purple-300">{house.sign}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <p className="text-gray-400">
                      <span className="text-white">Position:</span> {house.position}
                    </p>
                    <p className="text-gray-400">
                      <span className="text-white">Degree:</span> {house.degree}°
                    </p>
                    
                    {signInterpretations[house.sign] && (
                      <div className="mt-3 pt-3 border-t border-purple-500/20">
                        <p className="text-xs text-gray-500">Sign Qualities</p>
                        <p className="text-xs text-gray-300 mt-1">
                          {signInterpretations[house.sign].traits}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedSection === 'aspects' && (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold mb-6">Planetary Aspects</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              {aspects.map((aspect, idx) => (
                <div 
                  key={idx}
                  className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-purple-500/20"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl font-bold">{aspect.planet1}</span>
                      <span className={`text-xl ${aspectInterpretations[aspect.aspect]?.color || 'text-purple-400'}`}>
                      {aspect.aspect === 'Conjunction' && '☌'}
{aspect.aspect === 'Opposition' && '☍'}
{aspect.aspect === 'Trine' && '△'}
{aspect.aspect === 'Square' && '□'}
{aspect.aspect === 'Sextile' && '⚹'}
                      </span>
                      <span className="text-2xl font-bold">{aspect.planet2}</span>
                    </div>
                    <span className="text-sm text-gray-400">
                      {aspect.angle}° (orb: {aspect.orb}°)
                    </span>
                  </div>
                  
                  <h3 className={`text-lg font-semibold mb-2 ${aspectInterpretations[aspect.aspect]?.color || 'text-white'}`}>
                    {aspect.aspect}
                  </h3>
                  
                  {aspectInterpretations[aspect.aspect] && (
                    <p className="text-sm text-gray-300">
                      Nature: {aspectInterpretations[aspect.aspect].nature}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedSection === 'composition' && (
          <div className="space-y-8">
            <h2 className="text-3xl font-bold mb-6">Chart Composition</h2>
            
       
            <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-purple-500/20">
              <h3 className="text-2xl font-semibold mb-6">Elements Distribution</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {composition.elements && Object.entries(composition.elements).map(([element, count]) => (
                  <div key={element} className="text-center">
                    <div className="text-5xl mb-3">
                      {element === 'Fire' && '🔥'}
                      {element === 'Earth' && '🌍'}
                      {element === 'Air' && '💨'}
                      {element === 'Water' && '💧'}
                    </div>
                    <h4 className="text-xl font-bold">{element}</h4>
                    <p className="text-3xl font-bold text-purple-400 mt-2">{count}</p>
                    <div className="mt-3 bg-purple-600/20 rounded-full h-2 overflow-hidden">
                      <div 
                        className="bg-purple-500 h-full"
                        style={{ width: `${(count / 11) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

           
            <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-purple-500/20">
              <h3 className="text-2xl font-semibold mb-6">Modalities Distribution</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {composition.modalities && Object.entries(composition.modalities).map(([modality, count]) => (
                  <div key={modality} className="bg-black/30 rounded-lg p-6">
                    <h4 className="text-xl font-bold mb-2">{modality}</h4>
                    <p className="text-4xl font-bold text-purple-400">{count}</p>
                    <div className="mt-4 bg-purple-600/20 rounded-full h-3 overflow-hidden">
                      <div 
                        className="bg-purple-500 h-full rounded-full"
                        style={{ width: `${(count / 11) * 100}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-400 mt-3">
                      {modality === 'Cardinal' && 'Initiating, action-oriented, leadership'}
                      {modality === 'Fixed' && 'Stable, persistent, determined'}
                      {modality === 'Mutable' && 'Adaptable, flexible, versatile'}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

    
      <div className="relative z-10 bg-black/30 backdrop-blur-md border-t border-purple-500/30 mt-16">
        <div className="container mx-auto px-6 py-8 text-center">
          <p className="text-gray-400">
            True Sidereal Astrology Report • 13 Sign System Including Ophiuchus
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Generated on {new Date().toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
}