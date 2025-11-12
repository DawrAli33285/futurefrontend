import React, { useState, useEffect, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { BASE_URL } from './baseurl';
import LocationSuggestionField from './components/locationsuggestionfield';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
const AdminChart = () => {
  const [selectedPlanet, setSelectedPlanet] = useState(null);
  const [selectedChart,setSelectedChart]=useState()
  const [animateType, setAnimateType] = useState('Animate');
  const [settings,setSettings]=useState({})
  const [showReport, setShowReport] = useState(false);
  const [savedCharts,setSavedCharts]=useState([])
const [page, setPage] = useState(1);
const [hasMore, setHasMore] = useState(true);
const [loadingMore, setLoadingMore] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [timezone, setTimezone] = useState('UTC');
const [timezoneList, setTimezoneList] = useState([]);
const [timezoneLoading, setTimezoneLoading] = useState(false);
const [chartResponse,setChartResponse]=useState({}) 
const [subscribed,setSubsribed]=useState(false)

  const [formData, setFormData] = useState({
    name: '',
    day: '',
    month: 'January',
    year: '',
    hour: '',
    minute: '',
    location: '',
    latitude: null,
    longitude: null,
    chartName:''
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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

  const planetColors = {
    'Sun': '#FFD700',
    'Moon': '#C0C0C0',
    'Mercury': '#808080',
    'Venus': '#00FF00',
    'Mars': '#FF0000',
    'Jupiter': '#FFA500',
    'Saturn': '#4B0082',
    'Uranus': '#00CED1',
    'Neptune': '#1E90FF',
    'Pluto': '#8B008B'
  };

  const calculateHouse = (longitude, houses) => {
    if (!houses || houses.length === 0) return 1;
    
    for (let i = 0; i < houses.length; i++) {
      const currentHouse = houses[i].longitude;
      const nextHouse = houses[(i + 1) % houses.length].longitude;
      
      if (nextHouse > currentHouse) {
        if (longitude >= currentHouse && longitude < nextHouse) {
          return houses[i].house;
        }
      } else {
        if (longitude >= currentHouse || longitude < nextHouse) {
          return houses[i].house;
        }
      }
    }
    return 1;
  };

  const getPlanetsFromData = () => {
    if (!chartData) return [];
  
    const displayPlanets = settings?.wheelSettings?.displayPlanets;
    
   
    const shouldShowAllPlanets = !displayPlanets || displayPlanets === undefined;
    const shouldHideAllPlanets = Array.isArray(displayPlanets) && displayPlanets.length === 0;
    
    console.log('Display Planets Setting:', displayPlanets);
    console.log('Should Show All Planets:', shouldShowAllPlanets);
    console.log('Should Hide All Planets:', shouldHideAllPlanets);
    
  
    if (shouldHideAllPlanets) {
      console.log('Hiding all planets due to empty displayPlanets array');
      return [];
    }
    const planets = [];
    
    
    if (chartData.natal && chartData.natal.planets) {
      Object.entries(chartData.natal.planets).forEach(([name, data]) => {
        if (shouldShowAllPlanets || (displayPlanets && displayPlanets.includes(name))) {
          planets.push({
            symbol: planetSymbols[name],
            name: name,
            degree: parseFloat(data.longitude),
            sign: data.sign,
            house: calculateHouse(parseFloat(data.longitude), chartData.natal.houses),
            color: planetColors[name],
            natal: true,
            progressed: false,
            transit: false,
            position: data.position
          });
        }
      });
    }
  

    if (chartData.progressed && chartData.progressed.planets) {
      Object.entries(chartData.progressed.planets).forEach(([name, data]) => {
        if (shouldShowAllPlanets || displayPlanets.includes(name)) {
          planets.push({
            symbol: planetSymbols[name],
            name: name,
            degree: parseFloat(data.longitude),
            sign: data.sign,
            house: calculateHouse(parseFloat(data.longitude), chartData.natal.houses),
            color: planetColors[name],
            natal: false,
            progressed: true,
            transit: false,
            position: data.position
          });
        }
      });
    }
  
  
    if (chartData.transit && chartData.transit.planets) {
      Object.entries(chartData.transit.planets).forEach(([name, data]) => {
        if (shouldShowAllPlanets || displayPlanets.includes(name)) {
          planets.push({
            symbol: planetSymbols[name],
            name: name,
            degree: parseFloat(data.longitude),
            sign: data.sign,
            house: calculateHouse(parseFloat(data.longitude), chartData.natal.houses),
            color: planetColors[name],
            natal: false,
            progressed: false,
            transit: true,
            position: data.position
          });
        }
      });
    }
  
    return planets;
  };

  const handleViewReport = () => {
    if (!chartData) {
      setError('Please calculate a chart first');
      return;
    }
    setShowReport(true);
  };

  const getAspectsFromData = () => {
    if (!chartData || !chartData.aspects) {
      console.log('No chart data or aspects');
      return [];
    }
  
    const enabledAspects = settings?.aspects?.enabledAspects;
    
    const shouldShowAllAspects = !enabledAspects || enabledAspects === undefined;
    const shouldHideAllAspects = Array.isArray(enabledAspects) && enabledAspects.length === 0;
    
    console.log('Enabled Aspects Setting:', enabledAspects);
    console.log('Chart aspects data:', {
      natal_to_progressed: chartData.aspects.natal_to_progressed?.length,
      natal_to_transit: chartData.aspects.natal_to_transit?.length,
      progressed_to_transit: chartData.aspects.progressed_to_transit?.length
    });
    
    if (shouldHideAllAspects) {
      console.log('Hiding all aspects due to empty enabledAspects array');
      return [];
    }

    const aspectColors = {
      'Conjunction': '#FFD700',
      'Opposition': '#FF0000',
      'Trine': '#0000FF',
      'Square': '#FF6B6B',
      'Sextile': '#00FF00',
      'Quincunx': '#FFA500',
      'Semi-sextile': '#90EE90',
      'Semi-square': '#FFB6C1'
    };
  
    const aspects = [];
    
    const normalizeAspectName = (aspectName) => {
      if (!aspectName) return '';
      return aspectName.toLowerCase().replace(/[-\s]/g, '');
    };
    
    const normalizedEnabledAspects = enabledAspects 
      ? enabledAspects.map(a => normalizeAspectName(a))
      : [];

   
    if (chartData.aspects.natal_to_progressed) {
      chartData.aspects.natal_to_progressed.forEach(aspect => {
        const normalizedAspect = normalizeAspectName(aspect.aspect);
        const isAspectEnabled = shouldShowAllAspects || normalizedEnabledAspects.includes(normalizedAspect);
        
        if (isAspectEnabled) {
          const planet1 = chartData.natal?.planets?.[aspect.planet1];
          const planet2 = chartData.progressed?.planets?.[aspect.planet2];
          
          if (planet1 && planet2 && planet1.longitude && planet2.longitude) {
            aspects.push({
              from: parseFloat(planet1.longitude),
              to: parseFloat(planet2.longitude),
              color: aspectColors[aspect.aspect] || '#808080',
              type: aspect.aspect.toLowerCase(),
              category: 'natal-progressed',
              opacity: 0.5
            });
          }
        }
      });
    }

  
    if (chartData.aspects.natal_to_transit) {
      chartData.aspects.natal_to_transit.forEach(aspect => {
        const normalizedAspect = normalizeAspectName(aspect.aspect);
        const isAspectEnabled = shouldShowAllAspects || normalizedEnabledAspects.includes(normalizedAspect);
        
        if (isAspectEnabled) {
          const planet1 = chartData.natal?.planets?.[aspect.planet1];
          const planet2 = chartData.transit?.planets?.[aspect.planet2];
          
          if (planet1 && planet2 && planet1.longitude && planet2.longitude) {
            aspects.push({
              from: parseFloat(planet1.longitude),
              to: parseFloat(planet2.longitude),
              color: aspectColors[aspect.aspect] || '#808080',
              type: aspect.aspect.toLowerCase(),
              category: 'natal-transit',
              opacity: 0.3
            });
          }
        }
      });
    }

  
    if (chartData.aspects.progressed_to_transit) {
      chartData.aspects.progressed_to_transit.forEach(aspect => {
        const normalizedAspect = normalizeAspectName(aspect.aspect);
        const isAspectEnabled = shouldShowAllAspects || normalizedEnabledAspects.includes(normalizedAspect);
        
        if (isAspectEnabled) {
          const planet1 = chartData.progressed?.planets?.[aspect.planet1];
          const planet2 = chartData.transit?.planets?.[aspect.planet2];
          
          if (planet1 && planet2 && planet1.longitude && planet2.longitude) {
            aspects.push({
              from: parseFloat(planet1.longitude),
              to: parseFloat(planet2.longitude),
              color: aspectColors[aspect.aspect] || '#808080',
              type: aspect.aspect.toLowerCase(),
              category: 'progressed-transit',
              opacity: 0.4
            });
          }
        }
      });
    }

    console.log('Total aspects processed:', aspects.length);
    return aspects.slice(0, 30);
  };
  
  useEffect(() => {
    if (settings && Object.keys(settings).length > 0) {
      console.log('Settings updated in component:', settings);
    }
  }, [settings]);
  
  const planets = useMemo(() => {
    console.log('Recalculating planets with settings:', settings?.wheelSettings?.displayPlanets);
    return getPlanetsFromData();
  }, [chartData, settings]);
  
  const aspects = useMemo(() => {
    console.log('Recalculating aspects with settings:', settings?.aspects?.enabledAspects);
    return getAspectsFromData();
  }, [chartData, settings]);


const getZodiacSigns = () => {
  return [
    { name: 'Aries', symbol: '♈', start: 0, color: '#FF6B6B' },
    { name: 'Taurus', symbol: '♉', start: 30, color: '#4ECDC4' },
    { name: 'Gemini', symbol: '♊', start: 60, color: '#FFE66D' },
    { name: 'Cancer', symbol: '♋', start: 90, color: '#95E1D3' },
    { name: 'Leo', symbol: '♌', start: 120, color: '#F38181' },
    { name: 'Virgo', symbol: '♍', start: 150, color: '#AA96DA' },
    { name: 'Libra', symbol: '♎', start: 180, color: '#FCBAD3' },
    { name: 'Scorpio', symbol: '♏', start: 210, color: '#A8D8EA' },
    { name: 'Ophiuchus', symbol: '⛎', start: 240, color: '#9B59B6' },
    { name: 'Sagittarius', symbol: '♐', start: 263, color: '#FFD93D' },
    { name: 'Capricorn', symbol: '♑', start: 293, color: '#6BCB77' },
    { name: 'Aquarius', symbol: '♒', start: 321, color: '#4D96FF' },
    { name: 'Pisces', symbol: '♓', start: 351, color: '#C8B6FF' },
  ]
  
  
};

const zodiacSigns = getZodiacSigns();

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handlePlanetClick = (planet) => {
    setSelectedPlanet(planet);
  };

  const closeModal = () => {
    setSelectedPlanet(null);
  };


  const handlePrevious = () => {
    if (animateType === 'Year') {
      setFormData(prev => ({ ...prev, year: String(parseInt(prev.year || new Date().getFullYear()) - 1) }));
    } else if (animateType === 'Month') {
      const currentIndex = months.indexOf(formData.month);
      const newIndex = currentIndex === 0 ? 11 : currentIndex - 1;
      setFormData(prev => ({ ...prev, month: months[newIndex] }));
    } else if (animateType === 'Day') {
      setFormData(prev => ({ ...prev, day: String(Math.max(1, parseInt(prev.day || 1) - 1)) }));
    } else if (animateType === 'Hour') {
      setFormData(prev => ({ ...prev, hour: String((parseInt(prev.hour || 0) - 1 + 24) % 24) }));
    } else if (animateType === 'Minute') {
      setFormData(prev => ({ ...prev, minute: String((parseInt(prev.minute || 0) - 1 + 60) % 60).padStart(2, '0') }));
    }
  };

  const handleNext = () => {
    const now = new Date();
  
    if (animateType === 'Year') {
      setFormData(prev => ({ ...prev, year: String(now.getFullYear()) }));
    } else if (animateType === 'Month') {
      setFormData(prev => ({ ...prev, month: months[now.getMonth()] }));
    } else if (animateType === 'Day') {
      setFormData(prev => ({ ...prev, day: String(now.getDate()) }));
    } else if (animateType === 'Hour') {
      setFormData(prev => ({ ...prev, hour: String(now.getHours()) }));
    } else if (animateType === 'Minute') {
      setFormData(prev => ({ ...prev, minute: String(now.getMinutes()).padStart(2, '0') }));
    }
  };
  
  const handleNow = () => {
    const now = new Date();
    setFormData(prev => ({
      ...prev,
      day: String(now.getDate()),
      month: months[now.getMonth()],
      year: String(now.getFullYear()),
      hour: String(now.getHours()),
      minute: String(now.getMinutes()).padStart(2, '0')
    }));
  };

  const handleAnimateChange = (type) => {
    setAnimateType(type);
    setShowDropdown(false);
  };

  const handleCalculate = async () => {
    if (!formData.day || !formData.month || !formData.year || !formData.hour || !formData.minute) {
      setError('Please fill in all date and time fields');
      return;
    }
  
    setLoading(true);
    setError(null);
    
    try {
      const monthIndex = months.indexOf(formData.month) + 1;
      const birthDate = `${formData.year}-${String(monthIndex).padStart(2, '0')}-${String(formData.day).padStart(2, '0')}`;
      const birthTime = `${String(formData.hour).padStart(2, '0')}:${String(formData.minute).padStart(2, '0')}`;
      
      const response = await fetch(`${BASE_URL}/chart/transit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          birth_date: birthDate,
          birth_time: birthTime,
          latitude: formData.latitude || 40.7128,
          longitude: formData.longitude || -74.0060,
          timezone: timezone,
          transit_date: new Date().toISOString().split('T')[0],
          transit_time: "12:00",
          zodiac_system: settings?.zodiacSystem || 'Tropical',
          house_system: settings?.houseSystem || 'Placidus',
          coordinate_system: settings?.coordinateSystem || 'Geocentric',
          include_ophiuchus: settings?.trueSiderealSettings?.includeOphiuchus || false,
          ayanamsa: settings?.trueSiderealSettings?.ayanamsa || 'Fagan-Bradley',
          constellation_boundaries: settings?.trueSiderealSettings?.constellationBoundaries || 'IAU 1976',
          precession_correction: settings?.trueSiderealSettings?.precessionCorrection || true,
          nutation_correction: settings?.trueSiderealSettings?.nutationCorrection || true,
          ophiuchus_start_degree: settings?.ophiuchusSettings?.position?.startDegree || 237,
          ophiuchus_end_degree: settings?.ophiuchusSettings?.position?.endDegree || 265,
          aspect_orbs: settings?.aspects?.orbs || {},
          enabled_aspects: (settings?.aspects?.enabledAspects && settings.aspects.enabledAspects.length > 0) 
            ? settings.aspects.enabledAspects 
            : null, 
          display_planets: (settings?.wheelSettings?.displayPlanets && settings.wheelSettings.displayPlanets.length > 0)
            ? settings.wheelSettings.displayPlanets
            : null,
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to calculate chart');
      }
      
      const result = await response.json();
      
      if (result.success && result.data) {
        // ADD THIS: Store birth info in chartData before clearing formData
        result.data.birthInfo = {
          name: formData.name,
          day: formData.day,
          month: formData.month,
          year: formData.year,
          hour: formData.hour,
          minute: formData.minute,
          location: formData.location
        };
        
        setChartResponse(result.data);
        setChartData(result.data);
        
        // Now clear formData
        setFormData({
          ...formData,
          name: '',
          day: '',
          month: 'January',
          year: '',
          hour: '',
          minute: '',
          location: '',
          latitude: null,
          longitude: null,
        });
      } else {
        throw new Error('Invalid response from server');
      }
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to calculate chart');
    } finally {
      setLoading(false);
    }
  };

  // const handleCalculate = async () => {
  //   if (!formData.day || !formData.month || !formData.year || !formData.hour || !formData.minute) {
  //     setError('Please fill in all date and time fields');
  //     return;
  //   }
  
  //   setLoading(true);
  //   setError(null);
    
  //   try {
  //     const monthIndex = months.indexOf(formData.month) + 1;
  //   const birthDate = `${formData.year}-${String(monthIndex).padStart(2, '0')}-${String(formData.day).padStart(2, '0')}`;
  //   const birthTime = `${String(formData.hour).padStart(2, '0')}:${String(formData.minute).padStart(2, '0')}`;
    
  //   const response = await fetch(`${BASE_URL}/chart/transit`, {
  //     method: 'POST',
  //     headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify({
  //       birth_date: birthDate,
  //       birth_time: birthTime,
  //       latitude: formData.latitude || 40.7128,
  //       longitude: formData.longitude || -74.0060,
  //       timezone: timezone,
  //       transit_date: new Date().toISOString().split('T')[0],
  //       transit_time: "12:00",
       
       
  //       zodiac_system: settings?.zodiacSystem || 'Tropical',
  //       house_system: settings?.houseSystem || 'Placidus',
  //       coordinate_system: settings?.coordinateSystem || 'Geocentric',
        
       
  //       include_ophiuchus: settings?.trueSiderealSettings?.includeOphiuchus || false,
  //       ayanamsa: settings?.trueSiderealSettings?.ayanamsa || 'Fagan-Bradley',
  //       constellation_boundaries: settings?.trueSiderealSettings?.constellationBoundaries || 'IAU 1976',
  //       precession_correction: settings?.trueSiderealSettings?.precessionCorrection || true,
  //       nutation_correction: settings?.trueSiderealSettings?.nutationCorrection || true,
        
     
  //       ophiuchus_start_degree: settings?.ophiuchusSettings?.position?.startDegree || 237,
  //       ophiuchus_end_degree: settings?.ophiuchusSettings?.position?.endDegree || 265,
        
     
  //       aspect_orbs: settings?.aspects?.orbs || {},
        
       
  //       enabled_aspects: (settings?.aspects?.enabledAspects && settings.aspects.enabledAspects.length > 0) 
  //         ? settings.aspects.enabledAspects 
  //         : null, 
        
       
  //       display_planets: (settings?.wheelSettings?.displayPlanets && settings.wheelSettings.displayPlanets.length > 0)
  //         ? settings.wheelSettings.displayPlanets
  //         : null,
  //     })
  //   });
  //     if (!response.ok) {
  //       throw new Error('Failed to calculate chart');
  //     }
      
  //     const result = await response.json();
  //     console.log(result)
  //     console.log("result")
  //     setChartResponse(result.data)
  //     setFormData({
  //       ...formData,
  //       name: '',
  //       day: '',
  //       month: 'January',
  //       year: '',
  //       hour: '',
  //       minute: '',
  //       location: '',
  //       latitude: null,
  //       longitude: null,
  //     })
  //     if (result.success && result.data) {
  //       setChartData(result.data);
  //     } else {
  //       throw new Error('Invalid response from server');
  //     }
  //     setError(null)
  //   } catch (err) {
  //     setError(err.message || 'Failed to calculate chart');
  //   } finally {
  //     setLoading(false);
  //   }
  // };


  const handleView = () => {
    console.log('View clicked', chartData);
  };

  const handleSave = async() => {
    try{
      if (Object.keys(chartResponse).length === 0) {
        setError('Please Calculate new chart');
        return;
      }
      
      if(formData.chartName.length==0){
        setError('Please enter chart name');
        return;
      }
      
      let token=localStorage.getItem('token')
      token=JSON.parse(token)
      
      const natalHouses = chartResponse.natal?.houses || [];
      
      let saveChart = {
        chart_type: chartResponse.chart_type || "Transit (Triwheel)",
        chartName: formData.chartName,
        chartname: 'main',
        // ADD THIS LINE:
        birthInfo: chartResponse.birthInfo || {},
        aspects: chartResponse.aspects || {
          natal_to_progressed: [],
          natal_to_transit: [],
          progressed_to_transit: []
        },
        natal: {
          planets: chartResponse.natal?.planets || {},
          ascendant: chartResponse.natal?.ascendant || {},
          houses: natalHouses
        },
        progressed: {
          planets: chartResponse.progressed?.planets || {},
          ascendant: chartResponse.progressed?.ascendant || {},
          houses: (chartResponse.progressed?.houses && chartResponse.progressed.houses.length > 0) 
            ? chartResponse.progressed.houses 
            : natalHouses,
          progression_info: chartResponse.progressed?.progression_info || {}
        },
        transit: {
          planets: chartResponse.transit?.planets || {},
          ascendant: chartResponse.transit?.ascendant || {},
          date: chartResponse.transit?.date || '',
          time: chartResponse.transit?.time || '',
          houses: (chartResponse.transit?.houses && chartResponse.transit.houses.length > 0) 
            ? chartResponse.transit.houses 
            : natalHouses
        }
      };
      
      let response=await axios.post(`${BASE_URL}/saveChart`,saveChart,{
        headers:{
          Authorization:`Bearer ${token}`
        }
      })
      
      toast.success("Chart saved sucessfully",{containerId:"mainchart"})
      setError(null)
      setFormData({
        name: '',
        day: '',
        month: 'January',
        year: '',
        hour: '',
        minute: '',
        location: '',
        latitude: null,
        longitude: null,
        chartName:''
      })
      setChartResponse({})
      
      setSavedCharts([...savedCharts, response.data.chart])
    }catch(e){
      if(e?.response?.data?.error){
        setError(e?.response?.data?.error)
      }else{
        setError("Error occured while saving chart")
      }
    }
  };
  const handleRemoveChart = async(chartId) => {
    
    if (window.confirm('Are you sure you want to remove this chart?')) {
     
      try{
        let response=await axios.delete(`${BASE_URL}/main-chart/${chartId}`)
        const updatedCharts = savedCharts.filter(chart => chart._id !== chartId);
        setSavedCharts(updatedCharts);
    
        if (selectedChart === chartId) {
          setSelectedChart(null);
          setChartData(null);
        }
        getMainChart();
      }catch(e){
if(e?.response?.data?.error){
  toast.error(e?.response?.data?.error,{containerId:"mainchart"})
}else{
  toast.error("Error occured while trying to delete chart",{containerId:"mainchart"})
}
      }
      
    
    }
  };

  const handleFormChange = (field, value) => {
    if (field === 'location' && typeof value === 'object') {
    
      setFormData(prev => ({ 
        ...prev, 
        location: value.name,
        latitude: value.latitude,
        longitude: value.longitude
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  useEffect(() => {
    const fetchTimezones = async () => {
      setTimezoneLoading(true);
      try {
        const response = await fetch('https://worldtimeapi.org/api/timezone');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const timezones = await response.json();
        setTimezoneList(timezones);
      } catch (error) {
        console.error('Error fetching timezones:', error);
        
     
        setTimezoneList([
          'UTC',
          'Asia/Karachi',
          'America/New_York',
          'Europe/London',
          'Europe/Paris',
          'Asia/Tokyo',
          'Australia/Sydney',
          'America/Los_Angeles',
          'America/Chicago',
          'America/Denver',
          'Europe/Berlin',
          'Europe/Madrid',
          'Asia/Dubai',
          'Asia/Singapore',
          'Asia/Hong_Kong',
          'Australia/Melbourne',
          'Pacific/Auckland',
          'America/Toronto',
          'America/Mexico_City',
          'America/Buenos_Aires'
        ]);
      } finally {
        setTimezoneLoading(false);
      }
    };
  
    fetchTimezones();
  }, []);

  const checkOut=async()=>{
    try{
      let token=localStorage.getItem('token')
      token=JSON.parse(token)
  let response=await axios.get(`${BASE_URL}/subscribe`,{
    headers:{
      Authorization:`Bearer ${token}`
    }
  })
  window.location.href=response.data.url
  console.log(response.data)
    }catch(e){
      console.log(e.message)
    }
  }
  

  const generatePDF = () => {
    if (!chartData) {
      setError('Please calculate a chart first');
      return;
    }
  
   
    const svgElement = document.querySelector('svg');
    let svgString = new XMLSerializer().serializeToString(svgElement);
    
  
    const utf8ToBase64 = (str) => {
      return btoa(unescape(encodeURIComponent(str)));
    };
    
    const svgBase64 = utf8ToBase64(svgString);
  
    const printWindow = window.open('', '', 'width=800,height=900');
  
    printWindow.document.write(`
      <html>
        <head>
          <meta charset="UTF-8">
          <title>Birth Chart - ${formData.name || 'Chart'} - ${new Date().toLocaleDateString()}</title>
          <style>
            body { 
              margin: 0;
              padding: 20px;
              text-align: center;
              font-family: Arial, sans-serif;
              background-color: white;
            }
            h1 {
              font-size: 28px;
              margin-bottom: 10px;
              color: #333;
            }
            .info {
              font-size: 14px;
              color: #666;
              margin-bottom: 20px;
            }
            .chart-container {
              text-align: center;
            }
            .chart-container img {
              max-width: 100%;
              height: auto;
            }
            @media print {
              body { background-color: white; }
            }
          </style>
        </head>
        <body>
          <h1>Birth Chart - ${formData.name || 'Chart'}</h1>
          <div class="info">
            ${formData.day} ${formData.month} ${formData.year} • ${formData.hour}:${formData.minute} • ${formData.location || 'Location not specified'}
          </div>
          <div class="chart-container">
            <img src="data:image/svg+xml;base64,${svgBase64}" />
          </div>
        </body>
      </html>
    `);
  
    printWindow.document.close();
    setTimeout(() => printWindow.print(), 500);
  };


  useEffect(()=>{
getMainChart();
getActiveSettings();
getSubscribed();
  },[])


  const getSubscribed=async()=>{
    try{
      let token=localStorage.getItem('token')
      token=JSON.parse(token)
let response=await axios.get(`${BASE_URL}/getSubscribed`,{
  headers:{
    Authorization:`Bearer ${token}`
  }
})

setSubsribed(response.data.found)
    }catch(e){

    }
  }
  const getActiveSettings=async()=>{
    try{
      let token=localStorage.getItem('token')
      token=JSON.parse(token)
      
      let response=await axios.get(`${BASE_URL}/active`,{
        headers:{
          Authorization:`Bearer ${token}`
        }
      })

      console.log('=== ACTIVE SETTINGS LOADED ===')
      console.log('Full Settings:', response.data.data)
      console.log('Display Planets:', response.data.data?.wheelSettings?.displayPlanets)
      console.log('Enabled Aspects:', response.data.data?.aspects?.enabledAspects)
      console.log('Planet Degrees Format:', response.data.data?.wheelSettings?.planetDegrees)
      console.log('Ascendant Display:', response.data.data?.wheelSettings?.ascendantDisplay)
      console.log('Display Points:', response.data.data?.graphSettings?.displayPoints)
      console.log('================================')

      setSettings(response.data.data)
    }catch(e){
      console.log("settings error")
      console.log(e.message)
    }
  }


  // Get a detailed interpretation for a given Ascendant (Rising Sign)
  const getAscendantInterpretation = (sign) => {
    const interpretations = {
      'Aries': 'With Aries rising, you meet life head-on with courage, independence, and initiative. You exude confidence and act quickly, often blazing trails for others. Your challenge is to balance assertiveness with patience and empathy.',
      'Taurus': 'With Taurus rising, you approach life with steadiness, patience, and a love for comfort and beauty. You value stability and prefer to build things that last. Others find you reliable and soothing, though you may resist sudden change.',
      'Gemini': 'With Gemini rising, you’re curious, adaptable, and full of ideas. You navigate the world through words and intellect, constantly exploring new perspectives. Your challenge is to focus your energy and avoid scattering your attention.',
      'Cancer': 'With Cancer rising, you come across as nurturing, sensitive, and emotionally intuitive. You instinctively protect what matters and create safety for yourself and others. Your lesson is to balance emotional security with openness to growth.',
      'Leo': 'With Leo rising, you shine brightly with warmth, creativity, and confidence. You draw attention naturally and express yourself with flair. Life teaches you to balance pride with humility and to lead through inspiration rather than dominance.',
      'Virgo': 'With Virgo rising, you approach life thoughtfully, valuing order, efficiency, and improvement. You’re perceptive and service-oriented, often refining yourself and your surroundings. Your growth comes from learning self-acceptance amid imperfection.',
      'Libra': 'With Libra rising, you meet life through the lens of harmony, fairness, and relationships. You’re diplomatic and gracious, striving for balance and aesthetic beauty. Your task is to cultivate inner peace rather than relying solely on others for equilibrium.',
      'Scorpio': 'With Scorpio rising, you possess depth, magnetism, and emotional intensity. You’re drawn to transformation and seek to uncover life’s hidden truths. Your power lies in mastering your emotions and channeling passion into meaningful change.',
      'Ophiuchus': 'With Ophiuchus rising, you embody transformation, wisdom, and healing. You have a magnetic presence that draws others to you for insight or renewal. Your path involves balancing your desire to heal and enlighten others with maintaining your own boundaries and well-being.',
      'Sagittarius': 'With Sagittarius rising, you approach life with optimism, enthusiasm, and a thirst for adventure. You see the world as a grand classroom, seeking truth and freedom. Your challenge is to stay grounded while exploring endless horizons.',
      'Capricorn': 'With Capricorn rising, you project determination, maturity, and self-control. You strive for achievement and respect tradition, building success through perseverance. Your growth involves softening rigid expectations and embracing vulnerability.',
      'Aquarius': 'With Aquarius rising, you appear original, progressive, and socially aware. You champion independence and innovation, valuing individuality and collective progress alike. Your lesson is to blend intellect with emotional connection.',
      'Pisces': 'With Pisces rising, you move through life with compassion, imagination, and sensitivity. You’re attuned to unseen energies and drawn to creative or spiritual pursuits. Your journey is to find healthy boundaries while embracing your empathetic nature.'
    };
  
    return (
      interpretations[sign] ||
      'Your ascendant (rising sign) shapes how you engage with the world — your first impression, instincts, and outward style. It acts as the filter through which your entire birth chart expresses itself.'
    );
  };
  

// Get a detailed interpretation for a given Sun sign
const getSunSignInterpretation = (sign) => {
  const interpretations = {
    'Aries': 'With the Sun in Aries, you’re bold, pioneering, and full of life. You thrive on challenges and move fearlessly toward your goals. Leadership comes naturally to you, though learning patience and cooperation helps balance your fiery energy.',
    'Taurus': 'With the Sun in Taurus, you’re grounded, patient, and loyal. You value stability, comfort, and the beauty of the material world. Your steady persistence brings long-term success, but beware of becoming overly attached to routines or possessions.',
    'Gemini': 'With the Sun in Gemini, you’re curious, quick-witted, and communicative. Your mind is always active, seeking new ideas, conversations, and experiences. Your challenge is to cultivate focus and depth amid your endless curiosity.',
    'Cancer': 'With the Sun in Cancer, you’re nurturing, intuitive, and emotionally sensitive. Family, home, and emotional connection are central to your life. Your growth involves learning to balance care for others with care for yourself.',
    'Leo': 'With the Sun in Leo, you radiate confidence, generosity, and creative self-expression. You shine when you follow your passions and lead from the heart. Your challenge is to avoid pride and to use your warmth to uplift others.',
    'Virgo': 'With the Sun in Virgo, you’re analytical, thoughtful, and service-oriented. You seek perfection through practical effort and self-improvement. Learning to embrace imperfection and celebrate small victories leads to fulfillment.',
    'Libra': 'With the Sun in Libra, you’re diplomatic, charming, and relationship-focused. You strive for balance, harmony, and fairness in all areas of life. Your lesson is to strengthen your sense of self while maintaining peace with others.',
    'Scorpio': 'With the Sun in Scorpio, you’re intense, passionate, and transformative. You feel life deeply and crave emotional truth and authenticity. Your journey involves mastering your inner power and learning to trust through vulnerability.',
    'Ophiuchus': 'With the Sun in Ophiuchus, you embody depth, renewal, and a desire to understand life’s complexities. You’re drawn to growth, wisdom, and healing-oriented pursuits. Your path involves embracing personal transformation while learning to guide and uplift others without losing yourself.',
    'Sagittarius': 'With the Sun in Sagittarius, you’re optimistic, adventurous, and philosophical. You’re driven by a desire for growth, truth, and freedom. Your challenge is to channel your enthusiasm with focus and avoid restlessness.',
    'Capricorn': 'With the Sun in Capricorn, you’re ambitious, disciplined, and pragmatic. You take responsibility seriously and strive to build lasting success. Your lesson is to balance hard work with emotional connection and self-care.',
    'Aquarius': 'With the Sun in Aquarius, you’re independent, visionary, and socially conscious. You value originality and thrive when contributing to a greater cause. Your growth comes from blending intellect with empathy and embracing your unique path.',
    'Pisces': 'With the Sun in Pisces, you’re compassionate, imaginative, and deeply intuitive. You’re attuned to the unseen and often drawn to creative or spiritual pursuits. Your challenge is to stay grounded while expressing your boundless empathy and dreams.'
  };

  return (
    interpretations[sign] ||
    `Your Sun in ${sign} shapes your core identity, vitality, and purpose — the light you express most naturally in the world.`
  );
};


  
  // Get a detailed interpretation for the Sun's house placement
  const getSunHouseInterpretation = (house) => {
    const interpretations = {
      1: 'Your Sun in the 1st house makes self-expression and personal identity central to your life. You shine through individuality, confidence, and leadership. Your growth involves learning to balance self-focus with awareness of others.',
      2: 'Your Sun in the 2nd house highlights values, security, and material stability. You seek to build self-worth through tangible achievements and possessions. Your challenge is to recognize that true value comes from within, not just what you own.',
      3: 'Your Sun in the 3rd house illuminates communication, learning, and curiosity. You thrive when exchanging ideas and connecting with others intellectually. Your growth comes from developing focus and deep listening alongside self-expression.',
      4: 'Your Sun in the 4th house roots your identity in home, family, and emotional foundations. You shine by creating security and nurturing environments. Life teaches you to balance your private world with your public ambitions.',
      5: 'Your Sun in the 5th house fills you with creativity, playfulness, and self-expression. You radiate joy when you create, perform, or inspire others. Your lesson is to share your light authentically without needing constant validation.',
      6: 'Your Sun in the 6th house emphasizes service, work, and personal improvement. You take pride in being useful and refining your craft. Your growth involves learning to care for your well-being as much as you care for responsibilities.',
      7: 'Your Sun in the 7th house finds purpose through partnership and cooperation. Relationships mirror your identity and help you understand yourself more deeply. Your challenge is to maintain individuality while building balanced connections.',
      8: 'Your Sun in the 8th house draws you toward transformation, intimacy, and life’s hidden dimensions. You’re meant to face change fearlessly and embrace emotional rebirth. Power is found in vulnerability and deep self-understanding.',
      9: 'Your Sun in the 9th house inspires you to explore truth, philosophy, and the world beyond familiar boundaries. You shine when expanding your horizons through travel, study, or spiritual growth. Your lesson is to stay open-minded while grounding your beliefs in experience.',
      10: 'Your Sun in the 10th house lights up ambition, reputation, and achievement. You’re driven to make a visible impact and earn respect through your efforts. Your growth lies in aligning outer success with your inner sense of purpose.',
      11: 'Your Sun in the 11th house connects your vitality to community, friendship, and ideals. You’re inspired by collaboration and envisioning a better future. Your challenge is to honor your individuality while contributing meaningfully to collective goals.',
      12: 'Your Sun in the 12th house brings depth, empathy, and spiritual awareness. You’re drawn to solitude, healing, and helping others in unseen ways. Your lesson is to honor both your inner world and your need to express yourself outwardly.',
      13: 'Your Sun in the 13th house symbolizes transcendence, renewal, and integration of all life experiences. You’re here to bridge the visible and invisible, guiding others through transformation while embodying wisdom born from self-mastery. Your growth lies in embracing your role as both student and healer of life’s cycles.'
    };
  
    return (
      interpretations[house] ||
      `Your Sun in the ${house}th house shows where you shine most naturally — the life area where your identity, confidence, and purpose are expressed.`
    );
  };
  

  
// Get a detailed interpretation for a given Moon sign
const getMoonSignInterpretation = (sign) => {
  const interpretations = {
    'Aries': 'With the Moon in Aries, your emotions are fiery, spontaneous, and direct. You feel things quickly and act on instinct, often wearing your heart on your sleeve. You thrive on excitement but benefit from learning patience and emotional reflection.',
    'Taurus': 'With the Moon in Taurus, you crave stability, comfort, and peace. Emotional security comes from consistency, touch, and life’s simple pleasures. You nurture through reliability and warmth, though you may resist change when it’s needed.',
    'Gemini': 'With the Moon in Gemini, your feelings are curious, quick-shifting, and mental in nature. You process emotions through conversation, thought, and storytelling. Emotional growth comes from learning to connect deeply rather than staying in your head.',
    'Cancer': 'With the Moon in Cancer, you’re deeply sensitive, nurturing, and empathetic. You feel safest when surrounded by emotional connection, family, and familiarity. Your gift is your capacity to care — your challenge is to avoid absorbing others’ moods.',
    'Leo': 'With the Moon in Leo, your heart is expressive, loyal, and dramatic. You feel loved when appreciated and seen for who you are. Your emotional growth lies in balancing the need for validation with genuine self-love and generosity of spirit.',
    'Virgo': 'With the Moon in Virgo, you seek emotional order through routine, usefulness, and thoughtful care. You show love by helping others and improving what’s around you. Your challenge is to quiet inner criticism and recognize that imperfection is human.',
    'Libra': 'With the Moon in Libra, harmony and partnership are your emotional anchors. You find comfort in beauty, balance, and mutual understanding. Your lesson is to honor your own emotional needs instead of always prioritizing peace.',
    'Scorpio': 'With the Moon in Scorpio, your emotions run deep, passionate, and intense. You experience feelings profoundly and crave emotional truth and transformation. Your challenge is to trust others enough to reveal your vulnerability without fear of loss.',
    'Ophiuchus': 'With the Moon in Ophiuchus, your emotions are transformative, healing, and wise. You feel things deeply and instinctively seek renewal after emotional intensity. Your path involves embracing your gift for emotional insight while learning not to carry the pain of others as your own.',
    'Sagittarius': 'With the Moon in Sagittarius, you need freedom, honesty, and adventure to feel emotionally alive. You’re lifted by optimism and a love of discovery. Your growth comes from learning to stay present with emotions instead of escaping through constant motion.',
    'Capricorn': 'With the Moon in Capricorn, your emotions are steady but contained. You feel safe when you’re in control and accomplishing goals. Over time, you learn that true strength includes emotional openness and the courage to depend on others.',
    'Aquarius': 'With the Moon in Aquarius, your emotions are independent, idealistic, and future-oriented. You often detach to understand feelings intellectually before expressing them. Your lesson is to embrace vulnerability and human connection without fear of losing freedom.',
    'Pisces': 'With the Moon in Pisces, your emotions are compassionate, imaginative, and deeply sensitive. You feel everything — often even what others feel — and are drawn to creativity or spirituality as an outlet. Your challenge is to stay grounded and protect your emotional boundaries.'
  };

  return (
    interpretations[sign] ||
    `Your Moon in ${sign} shapes your emotional nature, instincts, and inner needs — how you nurture and respond to life at a feeling level.`
  );
};


  
 // Get a detailed interpretation for the Moon's house placement
 const getMoonHouseInterpretation = (house) => {
  const interpretations = {
    1: 'Your Moon in the 1st house makes emotions a visible part of your identity. You instinctively express how you feel and respond quickly to your environment. Your lesson is to balance emotional responsiveness with self-awareness, so feelings don’t rule your direction.',
    2: 'Your Moon in the 2nd house ties emotional security to material stability and self-worth. You feel safe when life is predictable and your needs are met. Growth comes from learning that inner confidence provides deeper comfort than external possessions.',
    3: 'Your Moon in the 3rd house gives emotional sensitivity to words, ideas, and communication. You need mental stimulation and close connections with siblings or community to feel nurtured. Your challenge is to think before reacting and to express feelings clearly.',
    4: 'Your Moon in the 4th house roots your emotional life in home, family, and private foundations. You draw comfort from familiar surroundings and nurturing bonds. Your growth lies in creating inner security rather than seeking it only from others.',
    5: 'Your Moon in the 5th house finds joy in creativity, love, and self-expression. You feel emotionally alive when you’re playing, performing, or creating beauty. Your lesson is to express feelings authentically without depending on attention for validation.',
    6: 'Your Moon in the 6th house seeks emotional satisfaction through work, service, and daily routines. You nurture by being helpful and reliable, but may worry too much about perfection. Balance comes from caring for yourself as much as you care for others.',
    7: 'Your Moon in the 7th house connects emotional well-being to relationships and harmony. You feel complete when your partnerships are stable and emotionally supportive. Growth involves cultivating inner balance so your happiness isn’t dependent on others.',
    8: 'Your Moon in the 8th house gives deep emotional intensity and a fascination with life’s mysteries. You feel drawn to transformation, intimacy, and shared emotional truth. Your challenge is to release control and allow vulnerability to deepen connections.',
    9: 'Your Moon in the 9th house finds comfort in exploration, faith, and expanding horizons. Emotional fulfillment comes through travel, learning, or spiritual growth. Your lesson is to ground your ideals in real experience and nurture a sense of belonging wherever you go.',
    10: 'Your Moon in the 10th house links emotions with ambition, reputation, and achievement. You seek validation through public recognition and meaningful work. Growth comes from honoring your personal needs alongside professional goals.',
    11: 'Your Moon in the 11th house feels emotionally fulfilled through friendships, community, and shared ideals. You find comfort in belonging to groups or contributing to collective causes. Your challenge is to stay emotionally authentic within social dynamics.',
    12: 'Your Moon in the 12th house creates deep emotional sensitivity and empathy. You may feel others’ emotions as your own and need quiet or solitude to recharge. Your lesson is to embrace emotional awareness without losing yourself in others’ energy.',
    13: 'Your Moon in the 13th house symbolizes emotional rebirth, healing, and transcendence. You experience feelings as gateways to spiritual understanding and personal renewal. Your growth comes from learning to channel deep empathy into wisdom rather than emotional exhaustion.'
  };

  return (
    interpretations[house] ||
    `Your Moon in the ${house}th house shows where you seek emotional fulfillment, comfort, and intuitive connection to life.`
  );
};


  
const getPlanetSignInterpretation = (planet, sign) => {
  const signInterpretations = {
    'Aries': 'You express boldness, initiative, and courage. Your approach is direct and energetic, driven by instinct and passion.',
    'Taurus': 'You express stability, patience, and sensuality. Your approach is grounded and persistent, valuing comfort and consistency.',
    'Gemini': 'You express curiosity, adaptability, and communication. Your approach is lively, intellectual, and quick-witted, thriving on new ideas.',
    'Cancer': 'You express sensitivity, empathy, and protectiveness. Your approach is emotional and nurturing, guided by intuition and care.',
    'Leo': 'You express creativity, confidence, and warmth. Your approach is expressive and proud, seeking recognition through heartfelt action.',
    'Virgo': 'You express practicality, precision, and service. Your approach is thoughtful and analytical, always seeking improvement and order.',
    'Libra': 'You express harmony, fairness, and connection. Your approach is diplomatic and charming, motivated by balance and beauty.',
    'Scorpio': 'You express intensity, passion, and transformation. Your approach is private, magnetic, and deeply emotional, craving truth and depth.',
    'Ophiuchus': 'You express wisdom, healing, and renewal. Your approach is transformative and insightful, seeking growth through emotional and spiritual evolution.',
    'Sagittarius': 'You express optimism, adventure, and philosophical thinking. Your approach is free-spirited and visionary, always searching for truth and meaning.',
    'Capricorn': 'You express discipline, ambition, and resilience. Your approach is structured and strategic, focused on achieving long-term goals.',
    'Aquarius': 'You express innovation, independence, and humanitarian vision. Your approach is unconventional and idealistic, focused on collective progress.',
    'Pisces': 'You express compassion, imagination, and spirituality. Your approach is intuitive and artistic, guided by dreams, empathy, and emotion.'
  };

  const base = signInterpretations[sign] || `You express your energy through the qualities of ${sign}.`;
  return `Your ${planet} in ${sign} influences how you channel ${planet} energy. ${base}`;
};

// Get a detailed interpretation for any planet in any house
const getPlanetHouseInterpretation = (planet, house) => {
  const houseInterpretations = {
    1: `With ${planet} in your 1st house, this energy expresses itself through your self-presentation, appearance, and personal drive. You radiate this planet’s qualities outwardly, shaping how others perceive you.`,
    2: `With ${planet} in your 2nd house, this energy focuses on resources, values, and your sense of stability and security. You seek to express ${planet} through what you build and value in tangible ways.`,
    3: `With ${planet} in your 3rd house, this energy operates through communication, learning, and mental connections. You express ${planet} in your ideas, writing, and conversations with those around you.`,
    4: `With ${planet} in your 4th house, this energy centers on home, family, and your emotional foundations. You express ${planet} most comfortably in private or nurturing settings.`,
    5: `With ${planet} in your 5th house, this energy fuels creativity, joy, and self-expression. You shine through artistic or playful pursuits that reveal your individuality.`,
    6: `With ${planet} in your 6th house, this energy influences your daily routines, health, and service. You express ${planet} through discipline, improvement, and attention to detail.`,
    7: `With ${planet} in your 7th house, this energy plays out through relationships, partnerships, and one-on-one connections. Cooperation, reflection, and mutual understanding bring ${planet} to life.`,
    8: `With ${planet} in your 8th house, this energy deals with depth, transformation, and shared power. You express ${planet} through emotional intensity, healing, or regeneration.`,
    9: `With ${planet} in your 9th house, this energy expands through exploration, study, and spiritual growth. You express ${planet} by seeking truth, wisdom, and higher meaning.`,
    10: `With ${planet} in your 10th house, this energy is visible in your career, reputation, and life path. You express ${planet} publicly and strive to achieve mastery in your field.`,
    11: `With ${planet} in your 11th house, this energy connects to community, friendship, and collective vision. You express ${planet} through collaboration and idealistic causes.`,
    12: `With ${planet} in your 12th house, this energy works inwardly, influencing intuition, healing, and your connection to the unseen. You express ${planet} quietly, often through compassion or creativity.`,
    13: `With ${planet} in your 13th house, this energy transcends the personal and reaches into spiritual evolution. You express ${planet} through awakening, renewal, and deep soul integration — a place where inner mastery meets universal purpose.`
  };

  return (
    houseInterpretations[house] ||
    `With ${planet} in your ${house}th house, this planetary energy manifests in life areas associated with that house.`
  );
};

  
const getMidheavenInterpretation = (sign) => {
  const interpretations = {
    Aries: 'With Aries Midheaven, your career path involves leadership, independence, and pioneering initiatives. You thrive when taking bold action and setting your own direction.',
    Taurus: 'With Taurus Midheaven, your professional growth comes through patience, reliability, and steady progress. You build a lasting reputation based on consistency and quality.',
    Gemini: 'With Gemini Midheaven, communication, learning, and adaptability define your public path. You may excel in fields involving information, networking, or teaching.',
    Cancer: 'With Cancer Midheaven, your career is shaped by emotional intelligence, empathy, and the desire to nurture others. You’re drawn to roles that provide security or support.',
    Leo: 'With Leo Midheaven, creativity, confidence, and self-expression fuel your ambitions. You’re meant to stand out and inspire through your presence and talents.',
    Virgo: 'With Virgo Midheaven, precision, service, and practicality shape your professional life. You excel through attention to detail, reliability, and a problem-solving mindset.',
    Libra: 'With Libra Midheaven, diplomacy, cooperation, and aesthetics guide your public image. Success comes through partnerships, fairness, and creating balance.',
    Scorpio: 'With Scorpio Midheaven, depth, transformation, and strategic insight drive your career. You’re drawn to uncovering truth, managing resources, or guiding others through change.',
    Ophiuchus: 'With Ophiuchus Midheaven, your public path involves healing, renewal, and transformation. You’re drawn toward professions that involve wisdom, teaching, or restoring balance. Your drive to uncover truth and uplift others defines your reputation.',
    Sagittarius: 'With Sagittarius Midheaven, exploration, philosophy, and teaching are key themes in your vocation. You’re motivated by freedom, growth, and sharing wisdom.',
    Capricorn: 'With Capricorn Midheaven, ambition, discipline, and structure define your professional life. You build success gradually and command respect through perseverance.',
    Aquarius: 'With Aquarius Midheaven, innovation, independence, and humanitarian ideals shape your reputation. You often stand out through originality and forward-thinking ideas.',
    Pisces: 'With Pisces Midheaven, imagination, empathy, and spirituality influence your career direction. You’re drawn to creative or healing roles that connect you to something larger than yourself.'
  };

  return (
    interpretations[sign] ||
    `Your Midheaven in ${sign} shapes your public image, reputation, and overall career direction.`
  );
};

  
const getAspectInterpretation = (planet1, planet2, aspectType) => {
  const baseInterpretations = {
    Conjunction: 'creates a blending and intensification of both planetary energies, uniting their themes into one strong expression.',
    Opposition: 'highlights polarity and tension between the two planets, encouraging awareness, balance, and integration of their contrasting forces.',
    Trine: 'flows with natural harmony and ease, allowing the planets to support and enhance each other’s strengths.',
    Square: 'creates dynamic friction and challenge, motivating growth and active problem-solving between the planets involved.',
    Sextile: 'offers opportunity and cooperation between the planets, encouraging constructive progress through conscious effort.',
    Quincunx: 'introduces adjustment and rebalancing, requiring flexibility and realignment of the planets’ differing needs.',
    SemiSquare: 'brings subtle tension and restlessness, prompting small but necessary changes for progress.',
    Sesquiquadrate: 'adds pressure and motivation to resolve underlying differences between the planetary energies.',
    SemiSextile: 'creates minor interaction that can promote growth through awareness and adaptation.',
    Quintile: 'represents creative expression and talent between the two planets, blending their energies in original ways.',
    BiQuintile: 'amplifies creative or intellectual synergy, allowing the planets to cooperate through skill and inspiration.'
  };

  const meaning =
    baseInterpretations[aspectType] ||
    'forms an interaction influencing the dynamic between these planetary energies.';

  return `The ${aspectType} aspect between ${planet1} and ${planet2} ${meaning}`;
};

  
const getHouseInterpretation = (houseNum) => {
  const interpretations = {
    1: 'The 1st House governs self, identity, and how you present yourself to the world. It reflects your physical appearance, personal approach, and the first impression you make.',
    2: 'The 2nd House governs values, possessions, and material resources. It reveals how you handle money, define security, and express self-worth.',
    3: 'The 3rd House governs communication, learning, and your immediate environment. It represents thinking patterns, early education, and relationships with siblings and neighbors.',
    4: 'The 4th House governs home, family, and emotional foundations. It points to your roots, heritage, and sense of belonging.',
    5: 'The 5th House governs creativity, pleasure, and romance. It represents self-expression, hobbies, entertainment, and your relationship with joy.',
    6: 'The 6th House governs work, health, and daily routines. It relates to service, organization, and the way you maintain physical and mental well-being.',
    7: 'The 7th House governs partnerships and one-to-one relationships. It shows how you connect, cooperate, and seek balance with others in personal and professional life.',
    8: 'The 8th House governs transformation, shared resources, and deep psychological processes. It relates to intimacy, renewal, and cycles of loss and rebirth.',
    9: 'The 9th House governs higher learning, philosophy, travel, and belief systems. It describes how you seek truth, meaning, and broader horizons.',
    10: 'The 10th House governs career, public image, and life direction. It represents ambition, achievement, and your visible role in the world.',
    11: 'The 11th House governs friendships, community, and long-term aspirations. It highlights collaboration, innovation, and your connection to collective ideals.',
    12: 'The 12th House governs spirituality, the unconscious, and hidden matters. It represents introspection, healing, and the unseen dimensions of life.'
  };

  return (
    interpretations[houseNum] ||
    `The ${houseNum}th House represents a specific area of life experience and personal development.`
  );
};


  const selectSavedChart=(id)=>{
    try{
let chart=savedCharts.find(u=>u._id==id)
console.log("SELECTED CHART DATA:")
    console.log(chart)
    console.log("Aspects in chart:", chart.aspects)
    console.log("Natal planets:", chart.natal?.planets)
    console.log("Progressed planets:", chart.progressed?.planets)
    console.log("Transit planets:", chart.transit?.planets)
setChartData(chart)
    }catch(e){

    }
  }
  const getMainChart=async(pageNum = 1, append = false)=>{
    try{
      if (append) setLoadingMore(true);
      
      let token=localStorage.getItem('token')
      token=JSON.parse(token)
      let response=await axios.get(`${BASE_URL}/getMainChart?page=${pageNum}&limit=5`,{headers:{
        Authorization:`Bearer ${token}`
      }})
      console.log(response.data)
      console.log("man")
      
      if (append) {
        setSavedCharts(prev => [...prev, ...response.data.charts]);
      } else {
        setSavedCharts(response.data.charts);
      }
      
      setHasMore(response.data.hasMore);
      setPage(pageNum);
    }catch(e){
      console.log(e.message)
    } finally {
      setLoadingMore(false);
    }
  }


  const formatPlanetPosition = (position, degree, sign) => {
    const degreeFormat = settings?.wheelSettings?.planetDegrees;
    
    if (!degreeFormat || degreeFormat === "Whole") {
      return position; 
    } else {

      return `${Math.floor(degree)}° ${sign}`;
    }
  };

  const shouldShowDisplayPoint = (point) => {
    const displayPoints = settings?.graphSettings?.displayPoints;
    
  
    if (!displayPoints || displayPoints === undefined) {
      return true;
    }
    
   
    if (Array.isArray(displayPoints) && displayPoints.length === 0) {
      console.log(`Hiding display point ${point} due to empty displayPoints array`);
      return false;
    }
    
    console.log(`Checking display point ${point}:`, displayPoints.includes(point));
    return displayPoints.includes(point);
  };
  return (
   <>
   <ToastContainer containerId={"mainchart"}/>
   <div className="lg:max-w-6xl mx-auto lg:p-8">
      
      
   {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
            <p className="mt-4 text-gray-700">Calculating chart...</p>
          </div>
        </div>
      )}

    
  <div className="relative w-full max-w-3xl mx-auto mb-6" style={{ aspectRatio: '1/1' }}>
        <svg viewBox="0 0 600 600" className="w-full h-full">
          {zodiacSigns.map((sign,index) => {
            const startAngle = sign.start - 90;

            const nextSign = zodiacSigns[(index + 1) % zodiacSigns.length];
            let signWidth = nextSign.start - sign.start;
        
            if (signWidth <= 0) {
              signWidth = 360 - sign.start + nextSign.start;
            }
            const endAngle = startAngle + signWidth;
            const path = describeArc(300, 300, 280, startAngle, endAngle);
            return (
              <g key={sign.name}>
                <path d={path} fill={sign.color} stroke="#fff" strokeWidth="2" />
                <text
  x={300 + Math.cos((startAngle + signWidth/2) * Math.PI / 180) * 265}
  y={300 + Math.sin((startAngle + signWidth/2) * Math.PI / 180) * 265}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize="20"
                  fontWeight="bold"
                >
                  {sign.symbol}
                </text>
              </g>
            );
          })}

          <circle cx="300" cy="300" r="260" fill="white" stroke="#ccc" strokeWidth="1" />
          
          {Array.from({ length: 360 }).map((_, degree) => {
            if (degree % 5 === 0) {
              const angle = degree - 90;
              const x1 = 300 + Math.cos(angle * Math.PI / 180) * 255;
              const y1 = 300 + Math.sin(angle * Math.PI / 180) * 255;
              const x2 = 300 + Math.cos(angle * Math.PI / 180) * (degree % 30 === 0 ? 245 : 250);
              const y2 = 300 + Math.sin(angle * Math.PI / 180) * (degree % 30 === 0 ? 245 : 250);
              
              return (
                <line
                  key={degree}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="#666"
                  strokeWidth={degree % 30 === 0 ? "2" : "1"}
                />
              );
            }
            return null;
          })}

          <circle cx="300" cy="300" r="240" fill="white" stroke="#ccc" strokeWidth="2" />

          {aspects.map((aspect, index) => {
            const angle1 = aspect.from - 90;
            const angle2 = aspect.to - 90;
            const x1 = 300 + Math.cos(angle1 * Math.PI / 180) * 200;
            const y1 = 300 + Math.sin(angle1 * Math.PI / 180) * 200;
            const x2 = 300 + Math.cos(angle2 * Math.PI / 180) * 200;
            const y2 = 300 + Math.sin(angle2 * Math.PI / 180) * 200;

            return (
              <line
                key={index}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={aspect.color}
                strokeWidth="1"
                opacity={aspect.opacity || 0.5}
                strokeDasharray={aspect.category === 'natal-transit' ? "5,5" : aspect.category === 'progressed-transit' ? "3,3" : "none"}
              />
            );
          })}

          {Array.from({ length: 12 }).map((_, index) => {
            const angle = (index * 30) - 90;
            const x1 = 300 + Math.cos(angle * Math.PI / 180) * 240;
            const y1 = 300 + Math.sin(angle * Math.PI / 180) * 240;
            const x2 = 300 + Math.cos(angle * Math.PI / 180) * 100;
            const y2 = 300 + Math.sin(angle * Math.PI / 180) * 100;

            return (
              <line
                key={index}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="#999"
                strokeWidth="1"
              />
            );
          })}

          {Array.from({ length: 12 }).map((_, index) => {
            const angle = (index * 30 + 15) - 90;
            const x = 300 + Math.cos(angle * Math.PI / 180) * 220;
            const y = 300 + Math.sin(angle * Math.PI / 180) * 220;

            return (
              <text
                key={index}
                x={x}
                y={y}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="14"
                fill="#666"
              >
                {index + 1}
              </text>
            );
          })}

{planets.filter(p => p.natal || p.progressed || p.transit).map((planet, index) => {
            const angle = planet.degree - 90;
            const radius = planet.natal ? 150 : planet.progressed ? 170 : 190;
            const x = 300 + Math.cos(angle * Math.PI / 180) * radius;
            const y = 300 + Math.sin(angle * Math.PI / 180) * radius;

            return (
              <g key={`${planet.name}-${planet.natal ? 'natal' : planet.progressed ? 'progressed' : 'transit'}-${index}`}>
                <circle
                  cx={x}
                  cy={y}
                  r="15"
                  fill="white"
                  stroke={planet.color}
                  strokeWidth="2"
                  strokeDasharray={planet.transit ? "3,3" : planet.progressed ? "2,2" : "none"}
                  className="cursor-pointer hover:opacity-80"
                  onClick={() => handlePlanetClick(planet)}
                />
                <text
                  x={x}
                  y={y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize="18"
                  fill={planet.color}
                  className="cursor-pointer"
                  onClick={() => handlePlanetClick(planet)}
                >
                  {planet.symbol}
                </text>
              </g>
            );
          })}

{shouldShowDisplayPoint('AS') && (
  <g>
    <line x1="300" y1="300" x2="540" y2="300" stroke="#000" strokeWidth="3" />
    <text x="510" y="290" fontSize="16" fontWeight="bold">
      {settings?.wheelSettings?.ascendantDisplay || "AS"}
    </text>
    <text x="505" y="310" fontSize="12">
      {chartData ? chartData.natal.ascendant.position : ""}
    </text>
  </g>
)}


{shouldShowDisplayPoint('MC') && (
  <g>
    <line x1="300" y1="300" x2="300" y2="60" stroke="#000" strokeWidth="3" />
    <text x="285" y="75" fontSize="16" fontWeight="bold">MC</text>
    <text x="275" y="90" fontSize="12">
      {chartData && chartData.natal.houses[9] ? chartData.natal.houses[9].position : ""}
    </text>
  </g>
)}


{shouldShowDisplayPoint('DS') && (
  <g>
    <line x1="300" y1="300" x2="60" y2="300" stroke="#000" strokeWidth="3" />
    <text x="70" y="290" fontSize="16" fontWeight="bold">DS</text>
    <text x="65" y="310" fontSize="12">
      {chartData && chartData.natal.houses 
        ? (chartData.natal.houses.find(h => h.house === 7)?.position || "")
        : ""}
    </text>
  </g>
)}


{shouldShowDisplayPoint('IC') && (
  <g>
    <line x1="300" y1="300" x2="300" y2="540" stroke="#000" strokeWidth="3" />
    <text x="285" y="525" fontSize="16" fontWeight="bold">IC</text>
    <text x="275" y="510" fontSize="12">
      {chartData && chartData.natal.houses 
        ? (chartData.natal.houses.find(h => h.house === 4)?.position || "")
        : ""}
    </text>
  </g>
)}


         
        </svg>
      </div>

      <div className="flex items-center justify-center gap-4 mb-6">
        <button
          onClick={handlePrevious}
          className="p-2 border border-gray-300 rounded hover:bg-gray-100"
        >
          <ChevronLeft size={20} />
        </button>

        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100 flex items-center gap-2"
          >
            {animateType}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {showDropdown && (
            <div className="absolute top-full mt-1 left-0 bg-white border border-gray-300 rounded shadow-lg z-10 w-full">
              {['Animate', 'Year', 'Month', 'Day', 'Hour', 'Minute'].map(type => (
                <button
                  key={type}
                  onClick={() => handleAnimateChange(type)}
                  className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                >
                  {type}
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={handleNow}
          className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
        >
          Now
        </button>

        <button
          onClick={handleNext}
          className="p-2 border border-gray-300 rounded hover:bg-gray-100"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6 lg:max-w-xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-6">MAIN WHEEL</h2>

        <div className="space-y-4">
          <div className="flex items-center gap-4 flex-col md:flex-row">
            <label className="w-48 md:text-right font-medium">Name:</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleFormChange('name', e.target.value)}
              className="flex-1 border border-gray-300 rounded px-3 py-2"
            />
          </div>

          <div className="flex items-center gap-4 flex-col md:flex-row">
            <label className="w-48 md:text-right font-medium">Date (dd-month-yyyy):</label>
            <div className="flex-1 flex gap-2 flex-col md:flex-row">
            <input
  type="number"
  min="1"
  max="31"
  value={formData.day}
  onChange={(e) => {
    const val = parseInt(e.target.value);
    if (val >= 1 && val <= 31) {
      handleFormChange('day', e.target.value);
    } else if (e.target.value === '') {
      handleFormChange('day', '');
    }
  }}
  onBlur={(e) => {
    const val = parseInt(e.target.value);
    if (isNaN(val) || val < 1) handleFormChange('day', '1');
    if (val > 31) handleFormChange('day', '31');
  }}
  className="w-16 border border-gray-300 rounded px-3 py-2 text-center"
  placeholder="28"
/>
              <select
                value={formData.month}
                onChange={(e) => handleFormChange('month', e.target.value)}
                className="flex-1 border border-gray-300 rounded px-3 py-2"
              >
                {months.map(month => (
                  <option key={month} value={month}>{month}</option>
                ))}
              </select>
              <input
  type="number"
  min="1900"
  max="2100"
  value={formData.year}
  onChange={(e) => {
    const val = parseInt(e.target.value);
    if (val >= 1900 && val <= 2100) {
      handleFormChange('year', e.target.value);
    } else if (e.target.value === '' || e.target.value.length < 4) {
      handleFormChange('year', e.target.value);
    }
  }}
  onBlur={(e) => {
    const val = parseInt(e.target.value);
    if (isNaN(val) || val < 1900) handleFormChange('year', '1900');
    if (val > 2100) handleFormChange('year', '2100');
  }}
  className="w-20 border border-gray-300 rounded px-3 py-2 text-center"
  placeholder="2025"
/>
            </div>
          </div>

          <div className="flex items-center gap-4 flex-col md:flex-row">
            <label className="w-48 md:text-right font-medium">Time (hh-mm):</label>
            <div className="flex-1 flex items-center gap-2">
            <input
  type="number"
  min="0"
  max="23"
  value={formData.hour}
  onChange={(e) => {
    const val = parseInt(e.target.value);
    if (val >= 0 && val <= 23) {
      handleFormChange('hour', e.target.value);
    } else if (e.target.value === '') {
      handleFormChange('hour', '');
    }
  }}
  onBlur={(e) => {
    const val = parseInt(e.target.value);
    if (isNaN(val) || val < 0) handleFormChange('hour', '0');
    if (val > 23) handleFormChange('hour', '23');
  }}
  className="w-16 border border-gray-300 rounded px-3 py-2 text-center"
  placeholder="13"
/>
              <span>:</span>
              <input
  type="number"
  min="0"
  max="59"
  value={formData.minute}
  onChange={(e) => {
    const val = parseInt(e.target.value);
    if (val >= 0 && val <= 59) {
      handleFormChange('minute', e.target.value);
    } else if (e.target.value === '') {
      handleFormChange('minute', '');
    }
  }}
  onBlur={(e) => {
    const val = parseInt(e.target.value);
    if (isNaN(val) || val < 0) handleFormChange('minute', '0');
    if (val > 59) handleFormChange('minute', '59');
  }}
  className="w-16 border border-gray-300 rounded px-3 py-2 text-center"
  placeholder="10"
/>
              <span className="text-sm text-gray-600">(24-hour clock)</span>
            </div>
          </div>

          <div className="flex items-center gap-4 flex-col md:flex-row">
  <label className="w-48 md:text-right font-medium"></label>
  <div className="flex-1">
    <LocationSuggestionField
      value={formData.location}
      onChange={(location) => handleFormChange('location', location)}
      name="location"
    />
  </div>
</div>

<h3 className="font-semibold mb-3">Chart Name</h3>

<div className="flex items-center gap-4 flex-col md:flex-row">
 
  <div className="flex-1 flex gap-2">
 <input
 type="text"
 value={formData.chartName}
 onChange={(e) => handleFormChange('chartName', e.target.value)}
 className="flex-1 border border-gray-300 rounded px-3 py-2"/> 
  </div>
</div>


{error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      
          <div className="flex justify-center pt-2">
            <button
              onClick={handleCalculate}
              className="w-full bg-purple-100 hover:bg-purple-200 text-gray-800 font-medium py-3 rounded transition-colors"
            >
              Calculate
            </button>
          </div>
          <button
  onClick={generatePDF}
  className="w-full bg-purple-100 hover:bg-purple-200 text-gray-800 font-medium py-3 rounded transition-colors"
>
  View
</button>

      

          <div className="flex justify-center">
            <button
              onClick={subscribed?handleSave:checkOut}
      
              className="w-full bg-purple-100 hover:bg-purple-200 text-gray-800 font-medium py-3 rounded transition-colors"
            >
              Save {subscribed?'⌘':'🔒'}
            </button>
          </div>

          <div 
  className="border border-gray-300 rounded bg-white p-2 h-32 overflow-y-auto"
  onScroll={(e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    if (scrollHeight - scrollTop <= clientHeight * 1.5 && hasMore && !loadingMore) {
      getMainChart(page + 1, true);
    }
  }}
>
 {savedCharts.map((val, i) => (
  <div
    key={i.toString()}
    className={`px-3 py-2 cursor-pointer hover:bg-purple-50 border-b border-gray-100 last:border-b-0 flex justify-between items-center group ${
      selectedChart === val._id ? 'bg-purple-100 font-semibold' : ''
    }`}
  >
    <div 
      className="flex-1"
      onClick={() => {
        setSelectedChart(val._id);
        setChartData(val);
      }}
    >
      {val?.chartName}
    </div>
    
  
    <button
      onClick={(e) => {
        e.stopPropagation(); 
     
        handleRemoveChart(val._id);
      }}
      className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-gray-400 hover:text-red-500 p-1 rounded"
      title="Remove chart"
    >
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        className="h-4 w-4" 
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M6 18L18 6M6 6l12 12" 
        />
      </svg>
    </button>
  </div>
))}
  {loadingMore && (
    <div className="px-3 py-2 text-gray-500 text-sm text-center">
      Loading more...
    </div>
  )}
  {!hasMore && savedCharts.length > 0 && (
    <div className="px-3 py-2 text-gray-400 text-xs text-center">
      No more charts
    </div>
  )}
</div>
          <div className="flex items-center gap-4 flex-col md:flex-row">
  <label className="w-48 md:text-right font-medium">Timezone:</label>
  <select
    value={timezone}
    onChange={(e) => setTimezone(e.target.value)}
    className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-300"
    disabled={true}
  >
    {timezoneLoading ? (
      <option>Loading timezones...</option>
    ) : (
      timezoneList.map((tz) => (
        <option key={tz} value={tz}>
          {tz}
        </option>
      ))
    )}
  </select>
</div>

       
          <div className="flex justify-center">
            <button
              onClick={subscribed?handleViewReport:checkOut}
              className="w-full bg-purple-100 hover:bg-purple-200 text-gray-800 font-medium py-3 rounded transition-colors"
            >
              View Report {subscribed?'⌘':'🔒'}
            </button>
          </div>
        </div>
      </div>

      {selectedPlanet && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-lg shadow-xl p-6 max-w-2xl w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start gap-4 mb-4">
              <span className="text-4xl" style={{ color: selectedPlanet.color }}>
                {selectedPlanet.symbol}
              </span>
              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-2">{selectedPlanet.name}</h3>
                <p className="text-lg mb-4">
  {formatPlanetPosition(selectedPlanet.position, selectedPlanet.degree, selectedPlanet.sign)}
</p>
<p className="text-sm text-gray-600">
  House {selectedPlanet.house} | {selectedPlanet.natal ? 'Natal' : selectedPlanet.progressed ? 'Progressed' : 'Transit'}
</p>
              </div>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-lg mb-2">
                  {selectedPlanet.name} in {selectedPlanet.sign}:
                </h4>
                <p className="text-gray-700">
                  Your {selectedPlanet.name} in {selectedPlanet.sign} influences your personality and life path. This placement shapes how you express the qualities associated with {selectedPlanet.name}.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-lg mb-2">
                  {selectedPlanet.name} in House {selectedPlanet.house}:
                </h4>
                <p className="text-gray-700">
                  {selectedPlanet.name} in your {selectedPlanet.house}th house affects specific areas of your life. This house placement shows where the energy of {selectedPlanet.name} manifests most strongly in your experience.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}


{showReport && (
  <div
    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    onClick={() => setShowReport(false)}
  >
    <div
      className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
      onClick={(e) => e.stopPropagation()}
    >
    
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-6 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Astrological Report</h2>
        </div>
        <button
          onClick={() => setShowReport(false)}
          className="bg-white bg-opacity-20 hover:bg-opacity-30 p-2 rounded-lg transition-all"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

     
      <div className="overflow-y-auto max-h-[calc(90vh-100px)] p-6">
        
       
        <div className="mb-8">
         
<div className="mb-8">
 
  <div className="bg-gray-50 p-4 rounded-lg">
    <div className="relative w-full max-w-2xl mx-auto" style={{ aspectRatio: '1/1' }}>
      <svg viewBox="0 0 600 600" className="w-full h-full">
      
        {zodiacSigns.map((sign, index) => {
          const startAngle = sign.start - 90;
          const nextSign = zodiacSigns[(index + 1) % zodiacSigns.length];
          let signWidth = nextSign.start - sign.start;
          if (signWidth <= 0) {
            signWidth = 360 - sign.start + nextSign.start;
          }
          const endAngle = startAngle + signWidth;
          const path = describeArc(300, 300, 280, startAngle, endAngle);
          return (
            <g key={sign.name}>
              <path d={path} fill={sign.color} stroke="#fff" strokeWidth="2" />
              <text
                x={300 + Math.cos((startAngle + signWidth/2) * Math.PI / 180) * 265}
                y={300 + Math.sin((startAngle + signWidth/2) * Math.PI / 180) * 265}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="20"
                fontWeight="bold"
              >
                {sign.symbol}
              </text>
            </g>
          );
        })}

        <circle cx="300" cy="300" r="260" fill="white" stroke="#ccc" strokeWidth="1" />
        
        
        {Array.from({ length: 360 }).map((_, degree) => {
          if (degree % 5 === 0) {
            const angle = degree - 90;
            const x1 = 300 + Math.cos(angle * Math.PI / 180) * 255;
            const y1 = 300 + Math.sin(angle * Math.PI / 180) * 255;
            const x2 = 300 + Math.cos(angle * Math.PI / 180) * (degree % 30 === 0 ? 245 : 250);
            const y2 = 300 + Math.sin(angle * Math.PI / 180) * (degree % 30 === 0 ? 245 : 250);
            
            return (
              <line
                key={degree}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="#666"
                strokeWidth={degree % 30 === 0 ? "2" : "1"}
              />
            );
          }
          return null;
        })}

        <circle cx="300" cy="300" r="240" fill="white" stroke="#ccc" strokeWidth="2" />

       
        {aspects.map((aspect, index) => {
          const angle1 = aspect.from - 90;
          const angle2 = aspect.to - 90;
          const x1 = 300 + Math.cos(angle1 * Math.PI / 180) * 200;
          const y1 = 300 + Math.sin(angle1 * Math.PI / 180) * 200;
          const x2 = 300 + Math.cos(angle2 * Math.PI / 180) * 200;
          const y2 = 300 + Math.sin(angle2 * Math.PI / 180) * 200;

          return (
            <line
              key={index}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={aspect.color}
              strokeWidth="1"
              opacity={aspect.opacity || 0.5}
              strokeDasharray={aspect.category === 'natal-transit' ? "5,5" : aspect.category === 'progressed-transit' ? "3,3" : "none"}
            />
          );
        })}

      
        {Array.from({ length: 12 }).map((_, index) => {
          const angle = (index * 30) - 90;
          const x1 = 300 + Math.cos(angle * Math.PI / 180) * 240;
          const y1 = 300 + Math.sin(angle * Math.PI / 180) * 240;
          const x2 = 300 + Math.cos(angle * Math.PI / 180) * 100;
          const y2 = 300 + Math.sin(angle * Math.PI / 180) * 100;

          return (
            <line
              key={index}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="#999"
              strokeWidth="1"
            />
          );
        })}

        
        {Array.from({ length: 12 }).map((_, index) => {
          const angle = (index * 30 + 15) - 90;
          const x = 300 + Math.cos(angle * Math.PI / 180) * 220;
          const y = 300 + Math.sin(angle * Math.PI / 180) * 220;

          return (
            <text
              key={index}
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="14"
              fill="#666"
            >
              {index + 1}
            </text>
          );
        })}

        
        {planets.filter(p => p.natal || p.progressed || p.transit).map((planet, index) => {
          const angle = planet.degree - 90;
          const radius = planet.natal ? 150 : planet.progressed ? 170 : 190;
          const x = 300 + Math.cos(angle * Math.PI / 180) * radius;
          const y = 300 + Math.sin(angle * Math.PI / 180) * radius;

          return (
            <g key={`${planet.name}-${planet.natal ? 'natal' : planet.progressed ? 'progressed' : 'transit'}-${index}`}>
              <circle
                cx={x}
                cy={y}
                r="15"
                fill="white"
                stroke={planet.color}
                strokeWidth="2"
                strokeDasharray={planet.transit ? "3,3" : planet.progressed ? "2,2" : "none"}
              />
              <text
                x={x}
                y={y}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="18"
                fill={planet.color}
              >
                {planet.symbol}
              </text>
            </g>
          );
        })}


        {shouldShowDisplayPoint('AS') && (
          <g>
            <line x1="300" y1="300" x2="540" y2="300" stroke="#000" strokeWidth="3" />
            <text x="510" y="290" fontSize="16" fontWeight="bold">
              {settings?.wheelSettings?.ascendantDisplay || "AS"}
            </text>
            <text x="505" y="310" fontSize="12">
              {chartData.natal.ascendant.position}
            </text>
          </g>
        )}

        {shouldShowDisplayPoint('MC') && (
          <g>
            <line x1="300" y1="300" x2="300" y2="60" stroke="#000" strokeWidth="3" />
            <text x="285" y="75" fontSize="16" fontWeight="bold">MC</text>
            <text x="275" y="90" fontSize="12">
              {chartData.natal.houses[9] ? chartData.natal.houses[9].position : ""}
            </text>
          </g>
        )}

        {shouldShowDisplayPoint('DS') && (
          <g>
            <line x1="300" y1="300" x2="60" y2="300" stroke="#000" strokeWidth="3" />
            <text x="70" y="290" fontSize="16" fontWeight="bold">DS</text>
            <text x="65" y="310" fontSize="12">
              {chartData.natal.houses.find(h => h.house === 7)?.position || ""}
            </text>
          </g>
        )}

        {shouldShowDisplayPoint('IC') && (
          <g>
            <line x1="300" y1="300" x2="300" y2="540" stroke="#000" strokeWidth="3" />
            <text x="285" y="525" fontSize="16" fontWeight="bold">IC</text>
            <text x="275" y="510" fontSize="12">
              {chartData.natal.houses.find(h => h.house === 4)?.position || ""}
            </text>
          </g>
        )}
      </svg>
    </div>
  </div>
</div>
          <h3 className="text-xl font-bold text-gray-800 mb-4 border-b-2 border-purple-500 pb-2">
            Chart Overview
          </h3>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-purple-50 p-4 rounded-lg">
              <h4 className="font-semibold text-purple-900 mb-2">Birth Information</h4>
              <p className="text-sm text-gray-700">Name: {chartData.birthInfo?.name || 'N/A'}</p>
              <p className="text-sm text-gray-700">Date: {chartData.birthInfo?.day} {chartData.birthInfo?.month} {chartData.birthInfo?.year}</p>
              <p className="text-sm text-gray-700">Time: {chartData.birthInfo?.hour}:{chartData.birthInfo?.minute}</p>
              <p className="text-sm text-gray-700">Location: {chartData.birthInfo?.location || 'N/A'}</p>
            </div>
            
            <div className="bg-pink-50 p-4 rounded-lg">
              <h4 className="font-semibold text-pink-900 mb-2">Key Points</h4>
              <p className="text-sm text-gray-700">
                Ascendant: {chartData.natal.ascendant.position} in {chartData.natal.ascendant.sign}
              </p>
              <p className="text-sm text-gray-700">
                Sun: {chartData.natal.planets.Sun?.position || 'N/A'} in {chartData.natal.planets.Sun?.sign || 'N/A'}
              </p>
              <p className="text-sm text-gray-700">
                Moon: {chartData.natal.planets.Moon?.position || 'N/A'} in {chartData.natal.planets.Moon?.sign || 'N/A'}
              </p>
            </div>
          </div>
        </div>

       
        <div className="mb-8">
          <h3 className="text-xl font-bold text-gray-800 mb-4 border-b-2 border-purple-500 pb-2">
            Ascendant in {chartData.natal.ascendant.sign}
          </h3>
          <div className="bg-purple-50 p-4 rounded-lg">
            <p className="text-gray-700 leading-relaxed">
              {getAscendantInterpretation(chartData.natal.ascendant.sign)}
            </p>
          </div>
        </div>

      
        <div className="mb-8">
          <h3 className="text-xl font-bold text-gray-800 mb-4 border-b-2 border-purple-500 pb-2">
            Core Luminaries
          </h3>
          
          
          <div className="mb-6 bg-yellow-50 p-4 rounded-lg">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-3xl" style={{ color: planetColors['Sun'] }}>☉</span>
              <div>
                <h4 className="font-bold text-lg text-gray-800">
                  Sun in {chartData.natal.planets.Sun?.sign} - House {calculateHouse(parseFloat(chartData.natal.planets.Sun?.longitude), chartData.natal.houses)}
                </h4>
                <p className="text-sm text-gray-600">{chartData.natal.planets.Sun?.position}</p>
              </div>
            </div>
            <div className="space-y-3">
              <p className="text-gray-700 leading-relaxed">
                <strong>Sun in {chartData.natal.planets.Sun?.sign}:</strong> {getSunSignInterpretation(chartData.natal.planets.Sun?.sign)}
              </p>
              <p className="text-gray-700 leading-relaxed">
                <strong>Sun in House {calculateHouse(parseFloat(chartData.natal.planets.Sun?.longitude), chartData.natal.houses)}:</strong> {getSunHouseInterpretation(calculateHouse(parseFloat(chartData.natal.planets.Sun?.longitude), chartData.natal.houses))}
              </p>
            </div>
          </div>

       
          <div className="mb-6 bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-3xl" style={{ color: planetColors['Moon'] }}>☽</span>
              <div>
                <h4 className="font-bold text-lg text-gray-800">
                  Moon in {chartData.natal.planets.Moon?.sign} - House {calculateHouse(parseFloat(chartData.natal.planets.Moon?.longitude), chartData.natal.houses)}
                </h4>
                <p className="text-sm text-gray-600">{chartData.natal.planets.Moon?.position}</p>
              </div>
            </div>
            <div className="space-y-3">
              <p className="text-gray-700 leading-relaxed">
                <strong>Moon in {chartData.natal.planets.Moon?.sign}:</strong> {getMoonSignInterpretation(chartData.natal.planets.Moon?.sign)}
              </p>
              <p className="text-gray-700 leading-relaxed">
                <strong>Moon in House {calculateHouse(parseFloat(chartData.natal.planets.Moon?.longitude), chartData.natal.houses)}:</strong> {getMoonHouseInterpretation(calculateHouse(parseFloat(chartData.natal.planets.Moon?.longitude), chartData.natal.houses))}
              </p>
            </div>
          </div>
        </div>

      
        <div className="mb-8">
          <h3 className="text-xl font-bold text-gray-800 mb-4 border-b-2 border-purple-500 pb-2">
            Natal Planetary Positions
          </h3>
          {Object.entries(chartData.natal.planets).filter(([name]) => name !== 'Sun' && name !== 'Moon').map(([planet, data]) => (
            <div key={planet} className="mb-6 bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl" style={{ color: planetColors[planet] }}>
                  {planetSymbols[planet]}
                </span>
                <div>
                  <h4 className="font-bold text-lg text-gray-800">
                    {planet} in {data.sign} - House {calculateHouse(parseFloat(data.longitude), chartData.natal.houses)}
                  </h4>
                  <p className="text-sm text-gray-600">{data.position}</p>
                </div>
              </div>
              <div className="space-y-3">
                <p className="text-gray-700 leading-relaxed">
                  <strong>{planet} in {data.sign}:</strong> {getPlanetSignInterpretation(planet, data.sign)}
                </p>
                <p className="text-gray-700 leading-relaxed">
                  <strong>{planet} in House {calculateHouse(parseFloat(data.longitude), chartData.natal.houses)}:</strong> {getPlanetHouseInterpretation(planet, calculateHouse(parseFloat(data.longitude), chartData.natal.houses))}
                </p>
              </div>
            </div>
          ))}
        </div>

      
        <div className="mb-8">
          <h3 className="text-xl font-bold text-gray-800 mb-4 border-b-2 border-purple-500 pb-2">
            Midheaven in {chartData.natal.houses[9]?.sign || 'N/A'}
          </h3>
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-gray-700 leading-relaxed">
              {getMidheavenInterpretation(chartData.natal.houses[9]?.sign)}
            </p>
          </div>
        </div>

        
        {chartData.aspects && (
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4 border-b-2 border-purple-500 pb-2">
              Major Aspects
            </h3>
            {chartData.aspects.natal_to_progressed?.slice(0, 15).map((aspect, idx) => (
              <div key={idx} className="mb-4 bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-800">
                    {aspect.planet1} {aspect.aspect} {aspect.planet2}
                  </h4>
                  <span className="text-sm text-gray-600">
                    Orb: {aspect.orb}°
                  </span>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {getAspectInterpretation(aspect.planet1, aspect.planet2, aspect.aspect)}
                </p>
              </div>
            ))}
          </div>
        )}

    
        <div className="mb-8">
          <h3 className="text-xl font-bold text-gray-800 mb-4 border-b-2 border-purple-500 pb-2">
            House Cusps
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            {chartData.natal.houses.map((house) => (
              <div key={house.house} className="bg-gray-50 p-3 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-1">
                  House {house.house} - {house.sign}
                </h4>
                <p className="text-xs text-gray-600">{house.position}</p>
                <p className="text-sm text-gray-700 mt-2">
                  {getHouseInterpretation(house.house)}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  </div>
)}
    </div>
   </>
  );
};

function describeArc(x, y, radius, startAngle, endAngle) {
  const outerRadius = radius;
  const innerRadius = radius - 30;
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

  const startOuter = polarToCartesian(x, y, outerRadius, endAngle);
  const endOuter = polarToCartesian(x, y, outerRadius, startAngle);
  const startInner = polarToCartesian(x, y, innerRadius, endAngle);
  const endInner = polarToCartesian(x, y, innerRadius, startAngle);

  return [
    "M", startOuter.x, startOuter.y,
    "A", outerRadius, outerRadius, 0, largeArcFlag, 0, endOuter.x, endOuter.y,
    "L", endInner.x, endInner.y,
    "A", innerRadius, innerRadius, 0, largeArcFlag, 1, startInner.x, startInner.y,
    "Z"
  ].join(" ");
}

function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
  const angleInRadians = angleInDegrees * Math.PI / 180.0;
  return {
    x: centerX + (radius * Math.cos(angleInRadians)),
    y: centerY + (radius * Math.sin(angleInRadians))
  };
}

export default AdminChart;