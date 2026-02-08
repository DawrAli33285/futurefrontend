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
  
     
        <section className="py-20 px-4 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          
      
          <div className="space-y-6">
            <div className="inline-block">
              <div className="text-6xl mb-4">⛎</div>
            </div>
            
            <h3 className="text-4xl md:text-5xl font-light text-black mb-6 leading-tight">
              Ophiuchus in Astrology
            </h3>
            
            <div className="w-20 h-1 bg-black mb-8"></div>
            
            <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
              Ophiuchus represents <span className="font-semibold text-black">healing</span>, <span className="font-semibold text-black">transmutation</span>, and <span className="font-semibold text-black">redemption</span>. Planets and houses associated with Ophiuchus show where healing and redemption take place in our lives.
            </p>
            
            <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
              It shows where we can have a more accepting attitude toward ourselves, our lives, and others. Through cultivating these characteristics we take on freer and lighter energy.
            </p>
          </div>
          
    
          <div className="relative">
            <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden shadow-2xl">
              <iframe
                src="https://www.youtube.com/embed/oL-Y4ZMCFLY"
                title="Ophiuchus in Astrology"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
                style={{ aspectRatio: '16/9', minHeight: '315px' }}
              />
            </div>
            
     
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-black opacity-5 rounded-lg -z-10"></div>
            <div className="absolute -top-6 -left-6 w-32 h-32 bg-black opacity-5 rounded-lg -z-10"></div>
          </div>
        </div>
      </div>
    </section>

<section className="py-16 px-4 bg-white text-black">
          <div className="max-w-4xl mx-auto">
            
            
            <article className="mb-16">
              <h2 className="text-3xl md:text-4xl font-light mb-8">What does Ophiuchus represent?</h2>
             
              <div className="mb-12 flex justify-center">
                <img 
                  src="/ophichus.jpeg" 
                  alt="Ophiuchus constellation" 
                  className="rounded-lg shadow-xl max-w-md w-full"
                />
              </div>
              
              <div className="space-y-6 text-justify leading-relaxed">
                <p>
                  Ophiuchus is the "13th sign". The reason it's called that is that traditionally, there are only 12 signs of the zodiac. Recently, there has been a large push to start using Ophiuchus. It is a constellation, and you can see it in the sky passing over the ecliptic.
                </p>
                
                <p>
                  About four to five thousand years ago Ophiuchus was lumped in with Scorpio. Scorpio spans over the bottom of Ophiuchus. So for all intents and purposes, it's still accurate to lump the two together. Ophiuchus and Scorpio are very similar energies. But let's differentiate the difference between the two, to see what this sign is all about.
                </p>
              </div>
  
              <h3 className="text-2xl md:text-3xl font-light mt-12 mb-6">Ophiuchus vs Scorpio</h3>
              
              <div className="space-y-6 text-justify leading-relaxed">
                <p>
                  The easiest way to describe Ophiuchus is by viewing the signs as the evolutionary journey. Scorpio, coming before Ophiuchus, represents the deeper aspects of life. Scorpio wants to see the truth about the matter, dive deep, and uncover it. So the next step of the journey comes after we see the truth. Ophiuchus takes what Scorpio uncovers and works with it.
                </p>
                
                <p>
                  Scorpio has to do with awareness of the instinctual. It's the scorpion. It is the deeper awareness of the self. The raw, primal, primordial aspects of the human self. Ophiuchus transmutes this. It transforms this into what you might call higher states of being or more whole states of being. Integrating the deeper self. This is known as "shadow work" in Jungian psychological terms.
                </p>

                <div className="my-10 flex justify-center">
                  <div className="max-w-lg w-full">
                    <img 
                      src="/chartone.png" 
                      alt="Planetary aspects diagram showing relationships between celestial bodies" 
                      className="rounded-lg shadow-lg w-full"
                    />
                    <p className="text-sm text-gray-600 text-center mt-3 italic">
                      Planetary aspect relationships in true sidereal astrology
                    </p>
                  </div>
                </div>
                
                <p>
                  You can also see this by the fact that Ophiuchus is where the galactic center is. The center of the Milky Way galaxy is two degrees from the end of Ophiuchus. This is a very transformational point in the sky. Every time a planet goes over this point there is some sort of transformative event. After passing over the point it expands us as a result, which is then Sagittarius. Sagittarius is the sign after Ophiuchus and represents the "post-transformed" state of being.
                </p>
                
                <p>
                  Ophiuchus is the final stage of the cocoon, before emergence. The stage right before the caterpillar turns into a butterfly. This process of metamorphosis is Ophiuchus energy. It is the process of transformation resulting in the lighter states of Sagittarius.
                </p>
                
                <p>
                  Ophiuchus is about taking the instinctual aspects exposed by Scorpio and transmuting them. It's not only about awareness of the deeper aspects of the self, but transforming them into higher states of being. The way that's done is through redemption - redeeming the self. Good examples include the teachings of Christ and Buddha who taught unconditional acceptance. Unconditional acceptance of ourselves, our lives, and others. This is when we heal and transform. This is seen in modern psychology, in the idea that self-acceptance is the first step towards healing.
                </p>
                
                <p>
                  Ophiuchus is about redeeming these "lower", exiled, and fractured parts of ourselves. When we're not only aware of these parts, but we've fully accepted them, then we're healed as a result.
                </p>
              </div>
  
              <h3 className="text-2xl md:text-3xl font-light mt-12 mb-6">What is an Ophiuchus personality?</h3>
              
              <div className="space-y-6 text-justify leading-relaxed">
                <p>
                  The qualities of this transformation process can be seen in a person with a strong Ophiuchus placement in their chart. For example, if their Sun, Moon, or rising sign is here then we see the qualities of this transformative process. These individuals have gone and are still going through this process. They also can help others become aware of their deeper side and redeem it. Ophiuchus is the natural healer, whether that's the intention or not. The result of interacting with an Ophiuchus person is healing - even if the process is unconscious.
                </p>
                
             
                <div className="my-10 flex justify-center">
                  <div className="max-w-2xl w-full">
                    <img 
                      src="/charttwo.png" 
                      alt="13-sign zodiac wheel with Ophiuchus constellation patterns" 
                      className="rounded-lg shadow-xl w-full"
                    />
                    <p className="text-sm text-gray-600 text-center mt-3 italic">
                      The complete 13-sign zodiac wheel including Ophiuchus
                    </p>
                  </div>
                </div>

                <p>
                  When an Ophiuchus is balanced they want to help others. They want to renew perspectives of life and the deeper world. They want themselves and others to have that fresh new perspective on life when we are aware of the truth and accepting it.
                </p>
                
                <p>
                  Ophiuchus is in continuous transformation. For instance, Sagittarius has gone through the transformation process. For Sagittarius, it's much more about the philosophy gained after transformation. Ophiuchus is always in the process of it. This is why Ophiuchus' are great healers.
                </p>
                
                <p>
                  Ophiuchus can mean physical healing as well. Doctors and surgeons are often seen with Ophiuchus placements. These professions were traditionally associated with Scorpio. Ophiuchus' are the healers, whether it's physical, emotional, psychological, or spiritual.
                </p>
              </div>
  
              <h3 className="text-2xl md:text-3xl font-light mt-12 mb-6">Ruler, Element, and Modality</h3>
              
              <div className="space-y-6 text-justify leading-relaxed">
                <p>
                  Traditionally this part of the sky is ruled by Mars. Mars rules Scorpio and it's always been associated with this area of the sky. Modernly, you can say Pluto. But Chiron is much closer to the energy of Ophiuchus. If you look at the mythology of Chiron, it's all about the healer qualities, very much like Ophiuchus.
                </p>
                
                <p>
                  Ophiuchus being in the same part of the sky as Scorpio also makes it associated with water. But some have called the element of Ophiuchus ether. This makes sense since ether is the highest element and part of the transmutation process. If Ophiuchus is ether, it would probably be the only sign or the second with Pisces. Ophiuchus is likely fixed because Scorpio's fixed. But, it's more on the mutable side since it's closer to Sagittarius. Much like Pisces as well.
                </p>
              </div>
  
              <h3 className="text-2xl md:text-3xl font-light mt-12 mb-6">Ophiuchus vs Orion</h3>
              
              <div className="space-y-6 text-justify leading-relaxed">
                <p>
                  Another note is that Ophiuchus is opposite Orion. Interestingly, there are two human constellations in the sky opposite each other. This makes the balancing point to Ophiuchus Orion. Originally, Orion represented the hunter. It's the very physical qualities of the human. Where Ophiuchus is working on cultivating the spiritual aspects of life, Orion is the very human side.
                </p>
                
                
                <div className="my-10 flex justify-center">
                  <div className="max-w-2xl w-full">
                    <img 
                      src="/chartthree.png" 
                      alt="Clean 13-sign zodiac wheel with constellation symbols" 
                      className="rounded-lg shadow-xl w-full"
                    />
                    <p className="text-sm text-gray-600 text-center mt-3 italic">
                      The 13 visible constellations used in true sidereal astrology
                    </p>
                  </div>
                </div>

                <p>
                  So to balance out Ophiuchus we need to incorporate the Orion energy. We need to "hunt", to do the human thing, the earthy thing. This helps ground the watery and spiritual energy of Ophiuchus. This is also seen in Taurus. Opposite Scorpio and Ophiuchus, Taurus is the earthy aspect of life.
                </p>
              </div>
  
              <h3 className="text-2xl md:text-3xl font-light mt-12 mb-6">The serpent bearer</h3>
              
              <div className="space-y-6 text-justify leading-relaxed">
                <p>
                  Lastly, Ophiuchus involves the serpent. This is a big part of the energy. Ophiuchus is the serpent bearer or the serpent redeemer. Serpents in past civilizations represented healing. Particularly healing the human ego. Serpents always have their belly on the earth. Ophiuchus is symbolic of not destroying the serpent, or fighting it, but instead befriending and accepting it. To work with these lower or physical aspects of the self. As a result, we heal those parts of ourselves, become redeemed, and become more whole.
                </p>
              </div>
            </article>
  
            <hr className="border-gray-300 my-16" />
  
      
            <article className="mb-16">
              <h2 className="text-3xl md:text-4xl font-light mb-8">The Planets in Ophiuchus</h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <h3 className="text-xl font-medium mb-3">Sun in Ophiuchus ☉</h3>
                  <p className="text-justify leading-relaxed">
                    Individuals with their Sun in Ophiuchus are naturally drawn towards transformation and healing. They possess a deep understanding of the human condition and are often seen as wise beyond their years. Their journey is one of continuous growth and self-improvement, always seeking to transmute their experiences into wisdom.
                  </p>
                </div>
  
                <div className="space-y-6">
                  <h3 className="text-xl font-medium mb-3">Moon in Ophiuchus ☽</h3>
                  <p className="text-justify leading-relaxed">
                    Those with their Moon in Ophiuchus are emotionally attuned to the process of healing and transformation. They have a deep emotional connection to the instinctual aspects of the self and are adept at integrating these aspects into their conscious awareness. Their emotional journey is one of redemption and acceptance, leading to profound personal growth.
                  </p>
                </div>
  
                <div className="space-y-6">
                  <h3 className="text-xl font-medium mb-3">Mercury in Ophiuchus ☿</h3>
                  <p className="text-justify leading-relaxed">
                    Those with Mercury in Ophiuchus have a mind that is constantly seeking transformation and healing. They are adept at communicating about the deeper aspects of the self and can help others understand their own transformative processes. Their thoughts and ideas often revolve around the themes of redemption and acceptance.
                  </p>
                </div>
  
                <div className="space-y-6">
                  <h3 className="text-xl font-medium mb-3">Venus in Ophiuchus ♀</h3>
                  <p className="text-justify leading-relaxed">
                    Venus in Ophiuchus individuals are attracted to the transformative and healing aspects of relationships. They seek partners who are willing to embark on a journey of self-discovery and growth with them. Their relationships often involve deep emotional healing and the integration of shadow aspects.
                  </p>
                </div>
  
                <div className="space-y-6">
                  <h3 className="text-xl font-medium mb-3">Mars in Ophiuchus ♂</h3>
                  <p className="text-justify leading-relaxed">
                    Individuals with Mars in Ophiuchus are driven by the desire for transformation and healing. They are courageous in their journey towards self-improvement and are not afraid to confront the darker aspects of their nature. Their actions often lead to profound personal growth and self-acceptance.
                  </p>
                </div>
  
                <div className="space-y-6">
                  <h3 className="text-xl font-medium mb-3">Jupiter in Ophiuchus ♃</h3>
                  <p className="text-justify leading-relaxed">
                    Those with Jupiter in Ophiuchus are blessed with a natural ability for transformation and healing. They are often seen as wise and understanding, with a deep knowledge of the human condition. Their journey is one of continuous growth and self-improvement, always seeking to transmute their experiences into wisdom.
                  </p>
                </div>
  
                <div className="space-y-6">
                  <h3 className="text-xl font-medium mb-3">Saturn in Ophiuchus ♄</h3>
                  <p className="text-justify leading-relaxed">
                    Saturn in Ophiuchus individuals have a serious and disciplined approach to transformation and healing. They understand the importance of integrating the shadow aspects of the self and are willing to put in the hard work required. Their journey is one of redemption and acceptance, leading to profound personal growth.
                  </p>
                </div>
  
                <div className="space-y-6">
                  <h3 className="text-xl font-medium mb-3">Chiron in Ophiuchus ⚷</h3>
                  <p className="text-justify leading-relaxed">
                    Those with Chiron in Ophiuchus are natural healers. They have a deep understanding of the human condition and are adept at helping others navigate their own transformative processes. Their journey is one of continuous growth and self-improvement, always seeking to transmute their experiences into wisdom.
                  </p>
                </div>
  
                <div className="space-y-6">
                  <h3 className="text-xl font-medium mb-3">Uranus in Ophiuchus ♅</h3>
                  <p className="text-justify leading-relaxed">
                    Individuals with Uranus in Ophiuchus are innovative and original in their approach to transformation and healing. They are not afraid to challenge traditional views of the self and are often seen as pioneers in the field of personal growth. Their journey is one of continuous evolution and self-discovery.
                  </p>
                </div>
  
                <div className="space-y-6">
                  <h3 className="text-xl font-medium mb-3">Neptune in Ophiuchus ♆</h3>
                  <p className="text-justify leading-relaxed">
                    Those with Neptune in Ophiuchus have a dreamy and intuitive approach to transformation and healing. They are deeply connected to the spiritual aspects of the self and are often seen as mystics or visionaries. Their journey is one of redemption and acceptance, leading to profound personal growth.
                  </p>
                </div>
  
                <div className="space-y-6">
                  <h3 className="text-xl font-medium mb-3">Pluto in Ophiuchus ♇</h3>
                  <p className="text-justify leading-relaxed">
                    Individuals with Pluto in Ophiuchus are intensely focused on transformation and healing. They have a deep understanding of the human condition and are not afraid to confront the darker aspects of their nature. Their journey is one of continuous growth and self-improvement, always seeking to transmute their experiences into wisdom.
                  </p>
                </div>
  
                <div className="space-y-6">
                  <h3 className="text-xl font-medium mb-3">North Node in Ophiuchus ☊</h3>
                  <p className="text-justify leading-relaxed">
                    Those with their North Node in Ophiuchus are destined to embark on a journey of transformation and healing. They are meant to integrate the shadow aspects of the self and to help others do the same. Their life path is one of redemption and acceptance, leading to profound personal growth.
                  </p>
                </div>
              </div>
            </article>
  
            <hr className="border-gray-300 my-16" />
  
          
            <article>
              <h2 className="text-3xl md:text-4xl font-light mb-8">Ophiuchus in the Houses</h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-medium mb-3">Ophiuchus in 1st House</h3>
                  <p className="text-justify leading-relaxed">
                    An Ophiuchus in the 1st House is likely to have a strong sense of self-awareness and a deep understanding of their own transformational journey. They are often seen as natural healers, with an instinctual ability to help others navigate their own paths of self-discovery and redemption. Their personal identity is closely tied to their ongoing process of self-transformation and healing.
                  </p>
                </div>
  
                <div>
                  <h3 className="text-xl font-medium mb-3">Ophiuchus in 2nd House</h3>
                  <p className="text-justify leading-relaxed">
                    Those with Ophiuchus in the 2nd House are likely to value the process of transformation and self-discovery above material possessions. They may find that their personal worth is closely tied to their ability to heal and transform themselves and others. Their financial situation may fluctuate as they navigate their own transformative journey, but they are likely to find true value in the process itself.
                  </p>
                </div>
  
                <div>
                  <h3 className="text-xl font-medium mb-3">Ophiuchus in 3rd House</h3>
                  <p className="text-justify leading-relaxed">
                    With Ophiuchus in the 3rd House, individuals are likely to be communicative healers, using their words and ideas to facilitate transformation in themselves and others. They may be drawn to fields of study that involve deep self-exploration and healing. Their relationships with siblings and neighbors may be characterized by mutual growth and transformation.
                  </p>
                </div>
  
                <div>
                  <h3 className="text-xl font-medium mb-3">Ophiuchus in 4th House</h3>
                  <p className="text-justify leading-relaxed">
                    An Ophiuchus in the 4th House is likely to have a home life characterized by deep transformation and healing. They may find that their family dynamics involve a lot of self-discovery and redemption. Their home may serve as a sanctuary for healing and personal growth, both for themselves and for others.
                  </p>
                </div>
  
                <div>
                  <h3 className="text-xl font-medium mb-3">Ophiuchus in 5th House</h3>
                  <p className="text-justify leading-relaxed">
                    Those with Ophiuchus in the 5th House are likely to find joy and creativity in the process of transformation and healing. They may be drawn to creative outlets that allow them to explore their deeper selves and facilitate their own redemption. Their romantic relationships are likely to be intense and transformative, with a focus on mutual growth and healing.
                  </p>
                </div>
  
                <div>
                  <h3 className="text-xl font-medium mb-3">Ophiuchus in 6th House</h3>
                  <p className="text-justify leading-relaxed">
                    With Ophiuchus in the 6th House, individuals are likely to find their work and daily routines deeply intertwined with their personal transformation journey. They may be drawn to careers in healing or therapy, and their approach to health and wellness is likely to involve a deep understanding of their own instinctual selves. Their daily routines may involve practices aimed at self-discovery and redemption.
                  </p>
                </div>
  
                <div>
                  <h3 className="text-xl font-medium mb-3">Ophiuchus in 7th House</h3>
                  <p className="text-justify leading-relaxed">
                    An Ophiuchus in the 7th House is likely to seek partnerships that facilitate mutual growth and transformation. Their relationships, both romantic and business, are likely to be characterized by deep self-discovery and healing. They may find that their partners are also on a journey of self-redemption, and together they navigate the path of transformation.
                  </p>
                </div>
  
                <div>
                  <h3 className="text-xl font-medium mb-3">Ophiuchus in 8th House</h3>
                  <p className="text-justify leading-relaxed">
                    Those with Ophiuchus in the 8th House are likely to experience intense transformations related to death, rebirth, and shared resources. They may find that their journey of self-discovery and redemption is deeply intertwined with experiences of loss and regeneration. Their approach to shared resources and intimacy is likely to involve a deep understanding of their own instinctual selves.
                  </p>
                </div>
  
                <div>
                  <h3 className="text-xl font-medium mb-3">Ophiuchus in 9th House</h3>
                  <p className="text-justify leading-relaxed">
                    With Ophiuchus in the 9th House, individuals are likely to seek wisdom and higher learning through their personal transformation journey. They may be drawn to philosophies and belief systems that emphasize self-discovery and redemption. Their travels and experiences with foreign cultures may serve as catalysts for deep personal growth and transformation.
                  </p>
                </div>
  
                <div>
                  <h3 className="text-xl font-medium mb-3">Ophiuchus in 10th House</h3>
                  <p className="text-justify leading-relaxed">
                    An Ophiuchus in the 10th House is likely to have a public image characterized by their transformative journey and healing abilities. They may be recognized for their ability to facilitate growth and redemption in others. Their career path is likely to involve helping others navigate their own paths of self-discovery and transformation.
                  </p>
                </div>
  
                <div>
                  <h3 className="text-xl font-medium mb-3">Ophiuchus in 11th House</h3>
                  <p className="text-justify leading-relaxed">
                    Those with Ophiuchus in the 11th House are likely to seek friendships and community involvement that facilitate mutual growth and transformation. They may find that their hopes and dreams are closely tied to their personal journey of self-discovery and redemption. Their approach to social causes and group dynamics is likely to involve a deep understanding of their own instinctual selves.
                  </p>
                </div>
  
                <div>
                  <h3 className="text-xl font-medium mb-3">Ophiuchus in 12th House</h3>
                  <p className="text-justify leading-relaxed">
                    With Ophiuchus in the 12th House, individuals are likely to experience deep transformations related to their subconscious mind and spiritual growth. They may find that their journey of self-discovery and redemption is deeply intertwined with experiences of solitude and introspection. Their approach to spirituality and the unconscious is likely to involve a deep understanding of their own instinctual selves.
                  </p>
                </div>
              </div>
            </article>
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