import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { BASE_URL } from './baseurl';

const AdminSettings = () => {
  const [settings, setSettings] = useState({
    settingsName: 'True Sidereal Settings',
    
  
    zodiacSystem: 'True Sidereal',
    houseSystem: 'Placidus',
    coordinateSystem: 'Geocentric',
    
   
    trueSiderealSettings: {
      ayanamsa: 'Fagan-Bradley',
      includeOphiuchus: true,
      constellationBoundaries: 'IAU 1976',
      precessionCorrection: true,
      nutationCorrection: true
    },
    
    
    wheelSettings: {
      displayPlanets: [
        'Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 
        'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto',
        'Ophiuchus', 'Chiron', 'Ceres', 'Pallas', 'Juno', 'Vesta',
        'North Node', 'South Node', 'Lilith', 'Fortune'
      ],
      planetDegrees: 'Whole',
      ascendantDisplay: 'AS' 
    },
    
  
    aspects: {
      enabledAspects: ['Conjunction', 'Opposition', 'Square', 'Trine', 'Sextile', 'Quincunx', 'Semi-sextile', 'Semi-square'],
      orbs: {
        conjunction: 10,
        opposition: 10,
        square: 8,
        trine: 8,
        sextile: 6,
        quincunx: 3,
        semiSextile: 3,
        semiSquare: 3
      },
      applyToOphiuchus: true
    },
    

    graphSettings: {
      chartTypes: ['Natal', 'Progressed', 'Transit'],
      displayPoints: ['AS', 'MC', 'DS', 'IC'],
      stationsDisplay: true,
      houseIngresses: true
    },
    
    
    graphAspects: {
      enabled: ['Conjunction', 'Opposition', 'Square', 'Trine', 'Sextile', 'Quincunx', 'Semi-sextile', 'Semi-square'],
      types: {
        progressedToNatal: true,
        transitingToNatal: true,
        progressedToProgressed: false,
        transitingToTransiting: false
      }
    },
    
   
    ophiuchusSettings: {
      position: {
        startDegree: 237,
        endDegree: 265,
        durationDays: 18
      },
      interpretationStyle: 'Healing',
      element: 'Ethereal',
      modality: 'Transcendent'
    },
    
   
    reportSettings: {
      includeOphiuchusAnalysis: true,
      trueSiderealExplanations: true,
      astronomicalReferences: true,
      reportLength: 'Standard' 
    },
    

    subscriptionSettings: {
      weeklyHoroscope: false,
      transitAlerts: false,
      ophiuchusTransits: true,
      astronomicalEvents: true
    }
  });

  const [isLoading, setIsLoading] = useState(true);

  
  const handleWheelSettingChange = (setting, value) => {
    setSettings(prev => ({
      ...prev,
      wheelSettings: {
        ...prev.wheelSettings,
        [setting]: value
      }
    }));
  };


  const handlePlanetToggle = (planet, isEnabled) => {
    setSettings(prev => {
      const currentPlanets = [...prev.wheelSettings.displayPlanets];
      let newPlanets;
      
      if (isEnabled && !currentPlanets.includes(planet)) {
        newPlanets = [...currentPlanets, planet];
      } else if (!isEnabled && currentPlanets.includes(planet)) {
        newPlanets = currentPlanets.filter(p => p !== planet);
      } else {
        return prev;
      }
      
      return {
        ...prev,
        wheelSettings: {
          ...prev.wheelSettings,
          displayPlanets: newPlanets
        }
      };
    });
  };


  const handleAspectToggle = (aspect, isEnabled) => {
    setSettings(prev => {
      const currentAspects = [...prev.aspects.enabledAspects];
      let newAspects;
      
      if (isEnabled && !currentAspects.includes(aspect)) {
        newAspects = [...currentAspects, aspect];
      } else if (!isEnabled && currentAspects.includes(aspect)) {
        newAspects = currentAspects.filter(a => a !== aspect);
      } else {
        return prev;
      }
      
      return {
        ...prev,
        aspects: {
          ...prev.aspects,
          enabledAspects: newAspects
        }
      };
    });
  };

 
  const handleOrbChange = (aspect, value) => {
    setSettings(prev => ({
      ...prev,
      aspects: {
        ...prev.aspects,
        orbs: {
          ...prev.aspects.orbs,
          [aspect]: parseInt(value) || 0
        }
      }
    }));
  };


  const handleReportSettingChange = (setting, value) => {
    setSettings(prev => ({
      ...prev,
      reportSettings: {
        ...prev.reportSettings,
        [setting]: value
      }
    }));
  };

  const getSettings = async () => {
    try {
      setIsLoading(true);
      let token = localStorage.getItem('token');
      token = JSON.parse(token);
      
      const response = await axios.get(`${BASE_URL}/getUserSettings`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.success && response.data.data) {
        setSettings(response.data.data);
       
      }
    } catch (e) {
    
    } finally {
      setIsLoading(false);
    }
  };

  const saveSettings = async () => {
    try {
      let token = localStorage.getItem('token');
      token = JSON.parse(token);
      
      const response = await axios.post(
        `${BASE_URL}/createUserSettings`,
        settings,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        toast.success(response.data.message || 'Settings saved successfully!', {
          containerId: 'settings'
        });
      }
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to save settings', {
        containerId: 'settings'
      });
     
    }
  };

  useEffect(() => {
    getSettings();
  }, []);

  if (isLoading) {
    return <div className="text-center p-8">Loading settings...</div>;
  }

  const allPlanets = [
    { key: 'Sun', symbol: '☉', color: 'text-yellow-500' },
    { key: 'Moon', symbol: '☽', color: 'text-blue-600' },
    { key: 'Mercury', symbol: '☿', color: 'text-gray-600' },
    { key: 'Venus', symbol: '♀', color: 'text-green-600' },
    { key: 'Mars', symbol: '♂', color: 'text-red-600' },
    { key: 'Jupiter', symbol: '♃', color: 'text-orange-500' },
    { key: 'Saturn', symbol: '♄', color: 'text-gray-700' },
    { key: 'Uranus', symbol: '♅', color: 'text-cyan-600' },
    { key: 'Neptune', symbol: '♆', color: 'text-blue-500' },
    { key: 'Pluto', symbol: '♇', color: 'text-purple-700' },
    { key: 'Ophiuchus', symbol: '⛎', color: 'text-purple-500' },
    { key: 'Chiron', symbol: '⚷', color: 'text-gray-600' },
    { key: 'Ceres', symbol: '⚳', color: 'text-brown-600' },
    { key: 'Pallas', symbol: '⚴', color: 'text-green-700' },
    { key: 'Juno', symbol: '⚵', color: 'text-pink-600' },
    { key: 'Vesta', symbol: '⚶', color: 'text-orange-600' },
    { key: 'North Node', symbol: '☊', color: 'text-gray-600' },
    { key: 'South Node', symbol: '☋', color: 'text-gray-600' },
    { key: 'Lilith', symbol: '⚸', color: 'text-black' },
    { key: 'Fortune', symbol: '⊕', color: 'text-green-500' }
  ];

  const allAspects = [
    { key: 'Conjunction', symbol: '☌', defaultOrb: 10 },
    { key: 'Opposition', symbol: '☍', defaultOrb: 10 },
    { key: 'Square', symbol: '□', defaultOrb: 8 },
    { key: 'Trine', symbol: '△', defaultOrb: 8 },
    { key: 'Sextile', symbol: '✶', defaultOrb: 6 },
    { key: 'Quincunx', symbol: '⚻', defaultOrb: 3 },
    { key: 'Semi-sextile', symbol: '⚺', defaultOrb: 3 },
    { key: 'Semi-square', symbol: '⚼', defaultOrb: 3 }
  ];

  return (
    <>
      <ToastContainer containerId={"settings"} />

      <div className="max-w-6xl mx-auto bg-gray-50 p-8 rounded-lg space-y-8">
     
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-2xl font-bold text-center mb-6">WHEEL SETTINGS</h2>
          
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4">Display Planets:</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {allPlanets.map(planet => (
                <div key={planet.key} className="flex items-center gap-2">
                  <span className={`text-xl ${planet.color}`}>{planet.symbol}</span>
                  <input 
                    type="checkbox" 
                    checked={settings.wheelSettings.displayPlanets.includes(planet.key)}
                    onChange={(e) => handlePlanetToggle(planet.key, e.target.checked)}
                    className="w-4 h-4 cursor-pointer" 
                  />
                  <span className="text-sm">{planet.key}</span>
                </div>
              ))}
            </div>
          </div>

         
        </div>

      
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-2xl font-bold text-center mb-6">ASPECT SETTINGS</h2>
          
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4">Enabled Aspects:</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {allAspects.map(aspect => (
                <div key={aspect.key} className="flex items-center gap-2">
                  <span className="text-xl">{aspect.symbol}</span>
                  <input 
                    type="checkbox" 
                    checked={settings.aspects.enabledAspects.includes(aspect.key)}
                    onChange={(e) => handleAspectToggle(aspect.key, e.target.checked)}
                    className="w-4 h-4 cursor-pointer" 
                  />
                 
                </div>
              ))}
            </div>
          </div>

         
        </div>

     
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-2xl font-bold text-center mb-6">SAVE SETTINGS</h2>
          
          <div className="max-w-md mx-auto">
            <button 
              onClick={saveSettings}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded transition-colors"
            >
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminSettings;