import React, { useState,useMemo} from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import axios from 'axios';
import { BASE_URL } from '../baseurl';
import { useStripe } from '@stripe/react-stripe-js';
import LocationSuggestionField from './locationsuggestionfield';
import  { useRef ,useEffect} from 'react';
import {toast,ToastContainer} from 'react-toastify'
const SynastryWheel = () => {
  const [showReport, setShowReport] = useState(false);
  const [chartResponse,setChartResponse]=useState({})
  const [settings,setSettings]=useState({})
  const [subscribed,setSubsribed]=useState(false)
  const [savedCharts,setSavedCharts]=useState([])
  const [selectedChart,setSelectedChart]=useState()
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const [person1Data, setPerson1Data] = useState({
    name: '',
    day: '',
    month: 'January',
    year: '',
    hour: '',
    minute: '',
    location: '',
    chartName:''
  });
  const [animateType, setAnimateType] = useState('Animate');
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [timezone, setTimezone] = useState('UTC');
const [timezoneList, setTimezoneList] = useState([]);
const [timezoneLoading, setTimezoneLoading] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [synastryData, setSynastryData] = useState(null);
  const [locationSuggestions, setLocationSuggestions] = useState([]);
const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);
const [locationLoading, setLocationLoading] = useState(false);
const locationRef = useRef(null);
const stripe=useStripe();
 
const calculateHouse = (longitude, houses) => {
  if (!houses || houses.length === 0) return 1;
  
  
  let normLong = longitude % 360;
  if (normLong < 0) normLong += 360;
  
  for (let i = 0; i < houses.length; i++) {
    const currentHouse = houses[i];
    const nextHouse = houses[(i + 1) % houses.length];
    
    let currentCusp = parseFloat(currentHouse.longitude);
    let nextCusp = parseFloat(nextHouse.longitude);
    
  
    if (nextCusp < currentCusp) {
      if (normLong >= currentCusp || normLong < nextCusp) {
        return currentHouse.house;
      }
    } else {
      if (normLong >= currentCusp && normLong < nextCusp) {
        return currentHouse.house;
      }
    }
  }
  
  return 1;
};

const planetColors = {
  Sun: '#FFD700',
  Moon: '#C0C0C0',
  Mercury: '#808080',
  Venus: '#00FF00',
  Mars: '#FF0000',
  Jupiter: '#FFA500',
  Saturn: '#4B0082',
  Uranus: '#00CED1',
  Neptune: '#1E90FF',
  Pluto: '#8B008B'
};


  const planetSymbols = {
    Sun: { symbol: '☉', color: '#FFD700' },
    Moon: { symbol: '☽', color: '#C0C0C0' },
    Mercury: { symbol: '☿', color: '#808080' },
    Venus: { symbol: '♀', color: '#00FF00' },
    Mars: { symbol: '♂', color: '#FF0000' },
    Jupiter: { symbol: '♃', color: '#FFA500' },
    Saturn: { symbol: '♄', color: '#4B0082' },
    Uranus: { symbol: '♅', color: '#00CED1' },
    Neptune: { symbol: '♆', color: '#1E90FF' },
    Pluto: { symbol: '♇', color: '#8B008B' }
  };


  const getPlanetPositions = () => {
    if (!synastryData?.data?.person1?.planets) {
     
      return [
        { name: 'Sun', degree: 338, house: 10 },
        { name: 'Moon', degree: 350, house: 11 },
        { name: 'Mercury', degree: 320, house: 9 },
        { name: 'Venus', degree: 355, house: 11 },
        { name: 'Mars', degree: 2, house: 11 },
        { name: 'Jupiter', degree: 45, house: 1 },
        { name: 'Saturn', degree: 315, house: 9 },
        { name: 'Uranus', degree: 305, house: 9 },
        { name: 'Neptune', degree: 300, house: 9 },
        { name: 'Pluto', degree: 235, house: 6 }
      ];
    }
  

    const planets = synastryData.data.person1.planets;
    const houses = synastryData.data.person1.houses;
    
    return Object.entries(planets).map(([name, data]) => {
      const longitude = parseFloat(data.longitude);
      const house = calculateHouse(longitude, houses);
  
      return {
        name,
        degree: longitude,
        house
      };
    });
  };


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

  
  const getAscendant = () => {
    if (synastryData?.data?.person1?.ascendant?.longitude) {
      return parseFloat(synastryData.data.person1.ascendant.longitude);
    }
    return 0; 
  };
  const person1Planets = (() => {
    const displayPlanets = settings?.wheelSettings?.displayPlanets;
    
  
    const shouldShowAllPlanets = !displayPlanets || displayPlanets === undefined;
    const shouldHideAllPlanets = Array.isArray(displayPlanets) && displayPlanets.length === 0;
    
    if (shouldHideAllPlanets) {
      console.log('Hiding all planets due to empty displayPlanets array');
      return [];
    }
    
    return getPlanetPositions().filter(planet => 
      shouldShowAllPlanets || displayPlanets.includes(planet.name)
    );
  })();


  useEffect(() => {
    if (settings && Object.keys(settings).length > 0) {
      console.log('=== SYNASTRY SETTINGS LOADED ===');
      console.log('Display Planets:', settings?.wheelSettings?.displayPlanets);
      console.log('Enabled Aspects:', settings?.aspects?.enabledAspects);
      console.log('================================');
    }
  }, [settings]);

  const ascendantDegree = getAscendant();

 
  const person2Planets = (() => {
    if (!synastryData?.data?.person2?.planets) return [];
    
    const displayPlanets = settings?.wheelSettings?.displayPlanets;
    
    const shouldShowAllPlanets = !displayPlanets || displayPlanets === undefined;
    const shouldHideAllPlanets = Array.isArray(displayPlanets) && displayPlanets.length === 0;
    
    if (shouldHideAllPlanets) {
      console.log('Hiding all person2 planets due to empty displayPlanets array');
      return [];
    }
    
    return Object.entries(synastryData.data.person2.planets)
      .filter(([name]) => shouldShowAllPlanets || displayPlanets.includes(name))
      .map(([name, data]) => {
        const longitude = parseFloat(data.longitude);
        const ascendant = synastryData.data.person2.ascendant 
          ? parseFloat(synastryData.data.person2.ascendant.longitude) 
          : 0;
        let houseDegree = longitude - ascendant;
        if (houseDegree < 0) houseDegree += 360;
        const house = Math.floor(houseDegree / 30) + 1;
  
        return {
          name,
          degree: longitude,
          house
        };
      });
  })();

  const normalizeAspectName = (aspectName) => {
    if (!aspectName) return '';
    return aspectName.toLowerCase().replace(/[-\s]/g, '');
  };

    const shouldShowChart = (chartType) => {
      return settings?.graphSettings?.chartTypes?.includes(chartType) ?? true;
    };

    const formatPlanetPosition = (position, longitude, sign) => {
      const degreeFormat = settings?.wheelSettings?.planetDegrees;
      
      if (!degreeFormat || degreeFormat === "Whole") {
        return position; 
      } else {
        return `${Math.floor(parseFloat(longitude))}° ${sign}`;
      }
    };





    
    const zodiacSigns = [
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
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];


  const monthNameToNumber = (monthName) => {
    return months.indexOf(monthName) + 1;
  };

  const handleCalculate = async () => {
    
    if (!person1Data.day || !person1Data.month || !person1Data.year || !person1Data.hour || !person1Data.minute) {
      setError('Please fill in all date and time fields');
      return;
    }
  
    if (!person1Data.location) {
      setError('Please enter a location');
      return;
    }
  
    setLoading(true);
    setError(null);
    
    try {
    
      let latitude = 33.5651; 
      let longitude = 73.0169; 
  
      if (person1Data.location) {
        try {
          const locationResponse = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(person1Data.location)}&limit=1`,
            {
              headers: {
                'User-Agent': 'AstrologyApp/1.0'
              }
            }
          );
          
          const locationData = await locationResponse.json();
          
          if (locationData && locationData.length > 0) {
            latitude = parseFloat(locationData[0].lat);
            longitude = parseFloat(locationData[0].lon);
          }
        } catch (locError) {
          console.warn('Could not fetch location coordinates, using defaults:', locError);
        }
      }
  
      const requestBody = {
        person1: {
          year: parseInt(person1Data.year),
          month: monthNameToNumber(person1Data.month),
          day: parseInt(person1Data.day),
          hour: parseInt(person1Data.hour),
          minute: parseInt(person1Data.minute),
          latitude: latitude,
          longitude: longitude,
          timezone: timezone
        },
        settings: {
          zodiacSystem: settings?.zodiacSystem || 'Tropical',
          houseSystem: settings?.houseSystem || 'Placidus',
          coordinateSystem: settings?.coordinateSystem || 'Geocentric',
          includeOphiuchus: settings?.trueSiderealSettings?.includeOphiuchus || false,
          ayanamsa: settings?.trueSiderealSettings?.ayanamsa || 'Lahiri',
          ophiuchusPosition: settings?.ophiuchusSettings?.position
        }
      };
  
      const response = await fetch(`${BASE_URL}/chart/synastry`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });
  
      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }
  
      const data = await response.json();
    
      setSynastryData(data);
      
     
      if (data.data && data.data.person1) {
        setChartResponse({
          ...data.data.person1,
          chart_type: data.data.chart_type
        });
      }
      
    } catch (err) {
      setError(err.message || 'Failed to calculate chart');
      console.error('Error calculating synastry:', err);
    } finally {
      setLoading(false);
    }
  };
  

  
  const handleFormChange = (person, field, value) => {
    if (field === 'minute') {
     
      setPerson1Data(prev => ({ ...prev, [field]: String(value).padStart(2, '0') }));
    } else {
      setPerson1Data(prev => ({ ...prev, [field]: value }));
    }
  };


  const generatePDF = () => {
    if (!synastryData) {
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
          <title>Synastry Chart - ${new Date().toLocaleDateString()}</title>
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
              margin-bottom: 20px;
              color: #333;
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
          <h1>${synastryData.data?.chart_type || 'Synastry Chart'}</h1>
          <div class="chart-container">
            <img src="data:image/svg+xml;base64,${svgBase64}" />
          </div>
        </body>
      </html>
    `);
  
    printWindow.document.close();
    setTimeout(() => printWindow.print(), 500);
  };
      

  const handleSave = async() => {
    try{
      if (Object.keys(chartResponse).length === 0) {
        setError('Please Calculate new chart');
        return;
      }
      if(person1Data.chartName.length==0){
        setError('Please enter chart name');
        return;
      }
  
      let token=localStorage.getItem('token')
      token=JSON.parse(token)
      let saveChart={
        ...chartResponse,
        chartName:person1Data.chartName,
        chartname:'synastry',
        birth_info: {
          ...chartResponse.birth_info,
          location: {
            ...chartResponse.birth_info.location,
            name: person1Data.location  
          }
        }
      }
      
      let response=await axios.post(`${BASE_URL}/saveChart`,saveChart,{
        headers:{
          Authorization:`Bearer ${token}`
        }
      })
  
      toast.success("Chart saved sucessfully",{containerId:"snyastrychart"})
      setError(null)
      setPerson1Data({
        name: '',
        day: '',
        month: 'January',
        year: '',
        hour: '',
        minute: '',
        location: '',
        chartName:''
      })
      setChartResponse({})
      
      
      await getSynastryChart();
      
    }catch(e){
      if(e?.response?.data?.error){
        setError(e?.response?.data?.error)
      }else{
        setError("Error occured while saving chart")
      }
    }
  };

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


const getAspectsFromData = () => {
  if (!synastryData?.data?.person1?.aspects) {
    console.log('No synastry data or aspects');
    return [];
  }

  const enabledAspects = settings?.aspects?.enabledAspects;
  
  const shouldShowAllAspects = !enabledAspects || enabledAspects === undefined;
  const shouldHideAllAspects = Array.isArray(enabledAspects) && enabledAspects.length === 0;
  
  console.log('Enabled Aspects Setting:', enabledAspects);
  console.log('Synastry aspects data:', synastryData.data.person1.aspects);
  
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
  
  const normalizedEnabledAspects = enabledAspects 
    ? enabledAspects.map(a => normalizeAspectName(a))
    : [];

  
  if (synastryData.data.person1.aspects) {
    synastryData.data.person1.aspects.forEach(aspect => {
      const normalizedAspect = normalizeAspectName(aspect.aspect);
      const isAspectEnabled = shouldShowAllAspects || normalizedEnabledAspects.includes(normalizedAspect);
      
      if (isAspectEnabled) {
        const planet1 = synastryData.data.person1.planets?.[aspect.planet1];
        const planet2 = synastryData.data.person1.planets?.[aspect.planet2];
        
        if (planet1 && planet2 && planet1.longitude && planet2.longitude) {
          aspects.push({
            from: parseFloat(planet1.longitude),
            to: parseFloat(planet2.longitude),
            color: aspectColors[aspect.aspect] || '#808080',
            type: aspect.aspect.toLowerCase(),
            opacity: 0.4
          });
        }
      }
    });
  }

  console.log('Total aspects processed:', aspects.length);
  return aspects.slice(0, 30);
};



const aspects = useMemo(() => {
  console.log('Recalculating aspects with settings:', settings?.aspects?.enabledAspects);
  return getAspectsFromData();
}, [synastryData, settings]);


useEffect(() => {
  const handleClickOutside = (event) => {
    if (locationRef.current && !locationRef.current.contains(event.target)) {
      setShowLocationSuggestions(false);
    }
  };

  document.addEventListener('mousedown', handleClickOutside);
  return () => document.removeEventListener('mousedown', handleClickOutside);
}, []);

useEffect(() => {
  const fetchLocationSuggestions = async () => {
    if (!person1Data.location || person1Data.location.length < 3) {
      setLocationSuggestions([]);
      return;
    }

    setLocationLoading(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(person1Data.location)}&limit=5&addressdetails=1`,
        {
          headers: {
            'User-Agent': 'AstrologyApp/1.0'
          }
        }
      );
      
      const data = await response.json();
      
      const formattedSuggestions = data.map(item => ({
        display: item.display_name,
        lat: item.lat,
        lon: item.lon
      }));
      
      setLocationSuggestions(formattedSuggestions);
      setShowLocationSuggestions(true);
    } catch (error) {
      console.error('Error fetching location suggestions:', error);
      setLocationSuggestions([]);
    } finally {
      setLocationLoading(false);
    }
  };

  const debounceTimer = setTimeout(fetchLocationSuggestions, 300);
  return () => clearTimeout(debounceTimer);
}, [person1Data.location]);




const getSynastryChart=async(pageNum = 1, append = false)=>{
  try{
    if (append) setLoadingMore(true);
    
    let token=localStorage.getItem('token')
    token=JSON.parse(token)
    let response=await axios.get(`${BASE_URL}/getSynastryChart?page=${pageNum}&limit=5`,{headers:{
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

useEffect(()=>{
  getSynastryChart();
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

    const handleRemoveChart = async(chartId) => {
     
      if (window.confirm('Are you sure you want to remove this chart?')) {
       
        try{
          let response=await axios.delete(`${BASE_URL}/synastry-chart/${chartId}`)
          const updatedCharts = savedCharts.filter(chart => chart._id !== chartId);
          setSavedCharts(updatedCharts);
          
       
          if (selectedChart === chartId) {
            setSelectedChart(null);
            setSynastryData(null);
          }

          getSynastryChart();
        }catch(e){
          if(e?.response?.data?.error){
            toast.error(e?.response?.data?.error,{containerId:"snyastrychart"})
          }else{
            toast.error("Error occured while trying to delete chart",{containerId:"snyastrychart"})
          }
        }
   
      }
    };
    const getActiveSettings=async()=>{
      try{
  
        let token=localStorage.getItem('token')
        token=JSON.parse(token)
  let response=await axios.get(`${BASE_URL}/active`,{
    headers:{
      Authorization:`Bearer ${token}`
    }
  })
  
  console.log(response.data)
  console.log("SETTINGS")
  
  setSettings(response.data.data)
  }catch(e){
        console.log("settings error")
        console.log(e.message)
      }
    }
  

useEffect(() => {
  const fetchTimezones = async () => {
    setTimezoneLoading(true);
    try {
      const response = await fetch('https://worldtimeapi.org/api/timezone');
      const timezones = await response.json();
      setTimezoneList(timezones);
    } catch (error) {
      console.error('Error fetching timezones:', error);
    
      setTimezoneList(['UTC', 'Asia/Karachi', 'America/New_York', 'Europe/London']);
    } finally {
      setTimezoneLoading(false);
    }
  };

  fetchTimezones();
}, []);

const handleLocationInputChange = (value) => {
  setPerson1Data(prev => ({ ...prev, location: value }));
  setShowLocationSuggestions(true);
};

const handleSelectLocationSuggestion = (suggestion) => {
  setPerson1Data(prev => ({
    ...prev,
    location: suggestion.display
  }));
  setShowLocationSuggestions(false);
  setLocationSuggestions([]);
};


const handleViewReport = () => {
  if (!synastryData) {
    setError('Please calculate a chart first');
    return;
  }
  setShowReport(true);
};

  return (
   <>
   <ToastContainer containerId={"snyastrychart"}/>


   <div className="max-w-6xl mx-auto p-4">

<div className="relative w-full max-w-3xl mx-auto mb-6" style={{ aspectRatio: '1/1' }}>
        <svg viewBox="0 0 600 600" className="w-full h-full">
 
        {zodiacSigns.map((sign, index) => {
           const startAngle = sign.start - 90;
           const nextSign = zodiacSigns[(index + 1) % zodiacSigns.length];
           let signWidth = nextSign.start - sign.start;
           if (signWidth <= 0) {
            signWidth = 360 - sign.start + nextSign.start;
          }



          const endAngle = startAngle + signWidth;
  const path = describeArc(300, 300, 290, startAngle, endAngle);
  
  return (
    <g key={sign.name}>
      <path
        d={path}
        fill={sign.color}
        stroke="#fff"
        strokeWidth="1"
      />
      <text
        x={300 + Math.cos((startAngle + signWidth/2) * Math.PI / 180) * 295}
        y={300 + Math.sin((startAngle + signWidth/2) * Math.PI / 180) * 295}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize="18"
        fontWeight="bold"
        fill="#333"
      >
        {sign.symbol}
      </text>
    </g>
  );
})}


<circle cx="300" cy="300" r="258" fill="white" stroke="#ccc" strokeWidth="1" />
          {Array.from({ length: 360 }).map((_, degree) => {
            if (degree % 1 === 0) {
              const angle = degree - 90;
              const isMajor = degree % 5 === 0;
              const isZodiacBoundary = degree % 30 === 0;
              const x1 = 300 + Math.cos(angle * Math.PI / 180) * 270;
              const y1 = 300 + Math.sin(angle * Math.PI / 180) * 270;
              const x2 = 300 + Math.cos(angle * Math.PI / 180) * (isZodiacBoundary ? 260 : isMajor ? 265 : 268);
              const y2 = 300 + Math.sin(angle * Math.PI / 180) * (isZodiacBoundary ? 260 : isMajor ? 265 : 268);
              
              return (
                <line
                  key={degree}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="#333"
                  strokeWidth={isZodiacBoundary ? "2" : isMajor ? "1" : "0.5"}
                />
              );
            }
            return null;
          })}

        
          <circle cx="300" cy="300" r="258" fill="white" stroke="#ccc" strokeWidth="1" />
          
        
          {Array.from({ length: 360 }).map((_, degree) => {
            if (degree % 1 === 0) {
              const angle = degree - 90;
              const isMajor = degree % 5 === 0;
              const isZodiacBoundary = degree % 30 === 0;
              const x1 = 300 + Math.cos(angle * Math.PI / 180) * 258;
              const y1 = 300 + Math.sin(angle * Math.PI / 180) * 258;
              const x2 = 300 + Math.cos(angle * Math.PI / 180) * (isZodiacBoundary ? 235 : isMajor ? 250 : 254);
              const y2 = 300 + Math.sin(angle * Math.PI / 180) * (isZodiacBoundary ? 235 : isMajor ? 250 : 254);
              
              return (
                <line
                  key={`middle-${degree}`}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="#666"
                  strokeWidth={isZodiacBoundary ? "2" : isMajor ? "1" : "0.5"}
                />
              );
            }
            return null;
          })}

      
{person2Planets.map((planet, index) => {
            const angle = planet.degree - 90;
            const radius = 247;
            const x = 300 + Math.cos(angle * Math.PI / 180) * radius;
            const y = 300 + Math.sin(angle * Math.PI / 180) * radius;
            const planetInfo = planetSymbols[planet.name] || { symbol: '?', color: '#000' };

            return (
              <g key={`p2-${planet.name}-${index}`}>
                <text
                  x={x}
                  y={y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize="16"
                  fill={planetInfo.color}
                  fontWeight="bold"
                >
                  {planetInfo.symbol}
                </text>
                <text
                  x={x + 10}
                  y={y - 8}
                  textAnchor="start"
                  dominantBaseline="middle"
                  fontSize="10"
                  fill="#FF0000"
                  fontWeight="bold"
                >
                  R
                </text>
              </g>
            );
          })}
       
          <circle cx="300" cy="300" r="230" fill="white" stroke="#ccc" strokeWidth="2" />
          <circle cx="300" cy="300" r="258" fill="white" stroke="#ccc" strokeWidth="1" />
          {aspects.map((aspect, index) => {
  const angle1 = aspect.from - 90;
  const angle2 = aspect.to - 90;
  const x1 = 300 + Math.cos(angle1 * Math.PI / 180) * 205;
  const y1 = 300 + Math.sin(angle1 * Math.PI / 180) * 205;
  const x2 = 300 + Math.cos(angle2 * Math.PI / 180) * 205;
  const y2 = 300 + Math.sin(angle2 * Math.PI / 180) * 205;

  return (
    <line
      key={`aspect-${index}`}
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      stroke={aspect.color}
      strokeWidth="1.5"
      opacity={aspect.opacity || 0.4}
    />
  );
})}
          {Array.from({ length: 12 }).map((_, index) => {
           
            const angle = (index * 30) - 90 + ascendantDegree;
            const x1 = 300 + Math.cos(angle * Math.PI / 180) * 230;
            const y1 = 300 + Math.sin(angle * Math.PI / 180) * 230;
            const x2 = 300 + Math.cos(angle * Math.PI / 180) * 80;
            const y2 = 300 + Math.sin(angle * Math.PI / 180) * 80;

            return (
              <line
                key={`house-${index}`}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="#999"
                strokeWidth="1"
              />
            );
          })}

          {zodiacSigns.map((sign, index) => {
            const angle = (sign.start + 15) - 90;
            const radius = 155;
            const x = 300 + Math.cos(angle * Math.PI / 180) * radius;
            const y = 300 + Math.sin(angle * Math.PI / 180) * radius;

          
            const startAngle = sign.start - 90;
            const endAngle = startAngle + 30;
            const housePath = describeArc(300, 300, 230, startAngle, endAngle, 80);

            return (
              <g key={`house-segment-${index}`}>
                <path
                  d={housePath}
                  fill={sign.color}
                  fillOpacity="0.3"
                  stroke="none"
                />
                <text
                  x={x}
                  y={y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize="16"
                  fill="#333"
                  fontWeight="bold"
                >
                  {index + 1}
                </text>
              </g>
            );
          })}

{person1Planets.map((planet, index) => {
            const angle = planet.degree - 90;
            const radius = 205;
            const x = 300 + Math.cos(angle * Math.PI / 180) * radius;
            const y = 300 + Math.sin(angle * Math.PI / 180) * radius;
            const planetInfo = planetSymbols[planet.name] || { symbol: '?', color: '#000' };

            return (
              <text
                key={`p1-${planet.name}`}
                x={x}
                y={y}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="16"
                fill={planetInfo.color}
                fontWeight="bold"
              >
                {planetInfo.symbol}
              </text>
            );
          })}

          <circle cx="300" cy="300" r="75" fill="white" stroke="#ccc" strokeWidth="2" />

       
          {settings?.graphSettings?.displayPoints?.includes('AS') && (
            <>
              <line 
                x1="300" 
                y1="300" 
                x2={300 + Math.cos((ascendantDegree - 90) * Math.PI / 180) * 225} 
                y2={300 + Math.sin((ascendantDegree - 90) * Math.PI / 180) * 225} 
                stroke="#000" 
                strokeWidth="3" 
              />
              <text 
                x={300 + Math.cos((ascendantDegree - 90) * Math.PI / 180) * 200} 
                y={300 + Math.sin((ascendantDegree - 90) * Math.PI / 180) * 200} 
                fontSize="20" 
                fontWeight="bold"
                textAnchor="middle"
              >
                {settings.wheelSettings?.ascendantDisplay || 'AS'}
              </text>
            </>
          )}

        
          {settings?.graphSettings?.displayPoints?.includes('MC') && (
            <>
              <line 
                x1="300" 
                y1="300" 
                x2={300 + Math.cos((ascendantDegree) * Math.PI / 180) * 225} 
                y2={300 + Math.sin((ascendantDegree) * Math.PI / 180) * 225} 
                stroke="#000" 
                strokeWidth="3" 
              />
              <text 
                x={300 + Math.cos((ascendantDegree) * Math.PI / 180) * 195} 
                y={300 + Math.sin((ascendantDegree) * Math.PI / 180) * 195} 
                fontSize="20" 
                fontWeight="bold"
                textAnchor="middle"
              >
                MC
              </text>
            </>
          )}
        </svg>
      </div>

     
      <div className="bg-white rounded-lg shadow-sm p-6 max-w-xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-6">SYNASTRY WHEEL</h2>

        <div className="space-y-6">
         
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Birth Details</h3>
            
            <div className="flex items-center gap-4 flex-col md:flex-row">
              <label className="w-48 md:text-right font-medium">Name:</label>
              <input
                type="text"
                value={person1Data.name}
                onChange={(e) => handleFormChange(1, 'name', e.target.value)}
                className="flex-1 border border-gray-300 rounded px-3 py-2"
              />
            </div>

            <div className="flex items-center gap-4 flex-col md:flex-row">
              <label className="w-48 md:text-right font-medium">Date (dd-month-yyyy):</label>
              <div className="flex-1 flex gap-2">
              <input
  type="number"
  min="1"
  max="31"
  value={person1Data.day}
  onChange={(e) => {
    const val = parseInt(e.target.value);
    if (val >= 1 && val <= 31) {
      handleFormChange(1, 'day', e.target.value);
    } else if (e.target.value === '') {
      handleFormChange(1, 'day', '');
    }
  }}
  onBlur={(e) => {
    const val = parseInt(e.target.value);
    if (isNaN(val) || val < 1) handleFormChange(1, 'day', '1');
    if (val > 31) handleFormChange(1, 'day', '31');
  }}
  className="w-16 border border-gray-300 rounded px-3 py-2 text-center"
  placeholder="28"
/>
                <select
                  value={person1Data.month}
                  onChange={(e) => handleFormChange(1, 'month', e.target.value)}
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
  value={person1Data.year}
  onChange={(e) => {
    const val = parseInt(e.target.value);
    if (val >= 1900 && val <= 2100) {
      handleFormChange(1, 'year', e.target.value);
    } else if (e.target.value === '' || e.target.value.length < 4) {
      handleFormChange(1, 'year', e.target.value);
    }
  }}
  onBlur={(e) => {
    const val = parseInt(e.target.value);
    if (isNaN(val) || val < 1900) handleFormChange(1, 'year', '1900');
    if (val > 2100) handleFormChange(1, 'year', '2100');
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
  value={person1Data.hour}
  onChange={(e) => {
    const val = parseInt(e.target.value);
    if (val >= 0 && val <= 23) {
      handleFormChange(1, 'hour', e.target.value);
    } else if (e.target.value === '') {
      handleFormChange(1, 'hour', '');
    }
  }}
  onBlur={(e) => {
    const val = parseInt(e.target.value);
    if (isNaN(val) || val < 0) handleFormChange(1, 'hour', '0');
    if (val > 23) handleFormChange(1, 'hour', '23');
  }}
  className="w-16 border border-gray-300 rounded px-3 py-2 text-center"
  placeholder="13"
/>
                <span>:</span>
                <input
  type="number"
  min="0"
  max="59"
  value={person1Data.minute}
  onChange={(e) => {
    const val = parseInt(e.target.value);
    if (val >= 0 && val <= 59) {
      handleFormChange(1, 'minute', e.target.value);
    } else if (e.target.value === '') {
      handleFormChange(1, 'minute', '');
    }
  }}
  onBlur={(e) => {
    const val = parseInt(e.target.value);
    if (isNaN(val) || val < 0) handleFormChange(1, 'minute', '0');
    if (val > 59) handleFormChange(1, 'minute', '59');
  }}
  className="w-16 border border-gray-300 rounded px-3 py-2 text-center"
  placeholder="10"
/>
                <span className="text-sm text-gray-600">(24-hour clock)</span>
              </div>
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

            <div className="flex items-center gap-4 flex-col md:flex-row">
  <label className="w-48 md:text-right font-medium"></label>
  <div className="flex-1 relative" ref={locationRef}>
    <input
      type="text"
      value={person1Data.location}
      onChange={(e) => handleLocationInputChange(e.target.value)}
      onFocus={() => locationSuggestions.length > 0 && setShowLocationSuggestions(true)}
      className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-300"
      placeholder="Enter location (city, region, country)..."
      autoComplete="off"
    />
    
    {locationLoading && (
      <div className="absolute right-3 top-3 text-gray-400">
        <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
    )}

    {showLocationSuggestions && locationSuggestions.length > 0 && (
      <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded shadow-lg max-h-60 overflow-y-auto mt-1">
        {locationSuggestions.map((suggestion, index) => (
          <li
            key={index}
            onClick={() => handleSelectLocationSuggestion(suggestion)}
            className="px-3 py-2 hover:bg-purple-50 cursor-pointer border-b border-gray-100 last:border-b-0"
          >
            <div className="text-sm text-gray-900">{suggestion.display}</div>
          </li>
        ))}
      </ul>
    )}

    {showLocationSuggestions && !locationLoading && person1Data.location.length >= 3 && locationSuggestions.length === 0 && (
      <div className="absolute z-10 w-full bg-white border border-gray-300 rounded shadow-lg mt-1 px-3 py-2 text-sm text-gray-500">
        No locations found
      </div>
    )}
  </div>
</div>
          </div>

        
          <h3 className="font-semibold mb-3">Chart Name</h3>

<div className="flex items-center gap-4 flex-col md:flex-row">
 
  <div className="flex-1 flex gap-2">
 <input
 type="text"
 value={person1Data.chartName}
 onChange={(e) => handleFormChange(1, 'chartName', e.target.value)}
 className="flex-1 border border-gray-300 rounded px-3 py-2"/> 
  </div>
</div>

          <div className="space-y-3 pt-4">
            {error && (
              <div className="w-full bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}
            
            <button
              onClick={handleCalculate}
              disabled={loading}
              className="w-full bg-purple-100 hover:bg-purple-200 text-gray-800 font-medium py-3 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Calculating...' : 'Calculate'}
            </button>

            <button
  onClick={generatePDF}
  className="w-full bg-purple-100 hover:bg-purple-200 text-gray-800 font-medium py-3 rounded transition-colors"
>
  View
</button>
            <button
            onClick={subscribed?handleSave:checkOut}
              className="w-full bg-purple-100 hover:bg-purple-200 text-gray-800 font-medium py-3 rounded transition-colors"
            >
              Save {subscribed?'⌘':'🔒'}
            </button>

            <div 
  className="border border-gray-300 rounded bg-white p-2 h-32 overflow-y-auto"
  onScroll={(e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    if (scrollHeight - scrollTop <= clientHeight * 1.5 && hasMore && !loadingMore) {
      getSynastryChart(page + 1, true);
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
        
        const transformedData = {
          data: {
            person1: {
              aspects: val.aspects,
              birth_info: val.birth_info,
              chart_type: val.chart_type,
              houses: val.houses,
              planets: val.planets,
            
            }
          }
        };
        
        setSynastryData(transformedData);
        
        // Update person1Data with saved chart info
        if (val.birth_info) {
          const date = new Date(val.birth_info.date);
          const [hour, minute] = val.birth_info.time.split(':');
          
          setPerson1Data({
            name: val.chartName || '',
            day: date.getDate().toString(),
            month: months[date.getMonth()],
            year: date.getFullYear().toString(),
            hour: hour,
            minute: minute,
            location: val.birth_info.location?.name || '',
            chartName: val.chartName || ''
          });
        }
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

        
         
            <button
              className="w-full bg-purple-100 hover:bg-purple-200 text-gray-800 font-medium py-3 rounded transition-colors"
              onClick={subscribed?handleViewReport:checkOut}
            >
              View Report {subscribed?'⌘':'🔒'}
            </button>
          </div>
        </div>
      </div>

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
          <h2 className="text-2xl font-bold">Synastry Chart Report</h2>
         
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
                  const path = describeArc(300, 300, 290, startAngle, endAngle);
                  
                  return (
                    <g key={sign.name}>
                      <path d={path} fill={sign.color} stroke="#fff" strokeWidth="1" />
                      <text
                        x={300 + Math.cos((startAngle + signWidth/2) * Math.PI / 180) * 295}
                        y={300 + Math.sin((startAngle + signWidth/2) * Math.PI / 180) * 295}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fontSize="18"
                        fontWeight="bold"
                        fill="#333"
                      >
                        {sign.symbol}
                      </text>
                    </g>
                  );
                })}

                <circle cx="300" cy="300" r="258" fill="white" stroke="#ccc" strokeWidth="1" />
                
                {Array.from({ length: 360 }).map((_, degree) => {
                  if (degree % 1 === 0) {
                    const angle = degree - 90;
                    const isMajor = degree % 5 === 0;
                    const isZodiacBoundary = degree % 30 === 0;
                    const x1 = 300 + Math.cos(angle * Math.PI / 180) * 270;
                    const y1 = 300 + Math.sin(angle * Math.PI / 180) * 270;
                    const x2 = 300 + Math.cos(angle * Math.PI / 180) * (isZodiacBoundary ? 260 : isMajor ? 265 : 268);
                    const y2 = 300 + Math.sin(angle * Math.PI / 180) * (isZodiacBoundary ? 260 : isMajor ? 265 : 268);
                    
                    return (
                      <line
                        key={degree}
                        x1={x1} y1={y1} x2={x2} y2={y2}
                        stroke="#333"
                        strokeWidth={isZodiacBoundary ? "2" : isMajor ? "1" : "0.5"}
                      />
                    );
                  }
                  return null;
                })}

                <circle cx="300" cy="300" r="258" fill="white" stroke="#ccc" strokeWidth="1" />
                
                {Array.from({ length: 360 }).map((_, degree) => {
                  if (degree % 1 === 0) {
                    const angle = degree - 90;
                    const isMajor = degree % 5 === 0;
                    const isZodiacBoundary = degree % 30 === 0;
                    const x1 = 300 + Math.cos(angle * Math.PI / 180) * 258;
                    const y1 = 300 + Math.sin(angle * Math.PI / 180) * 258;
                    const x2 = 300 + Math.cos(angle * Math.PI / 180) * (isZodiacBoundary ? 235 : isMajor ? 250 : 254);
                    const y2 = 300 + Math.sin(angle * Math.PI / 180) * (isZodiacBoundary ? 235 : isMajor ? 250 : 254);
                    
                    return (
                      <line
                        key={`middle-${degree}`}
                        x1={x1} y1={y1} x2={x2} y2={y2}
                        stroke="#666"
                        strokeWidth={isZodiacBoundary ? "2" : isMajor ? "1" : "0.5"}
                      />
                    );
                  }
                  return null;
                })}

                {person2Planets.map((planet, index) => {
                  const angle = planet.degree - 90;
                  const radius = 247;
                  const x = 300 + Math.cos(angle * Math.PI / 180) * radius;
                  const y = 300 + Math.sin(angle * Math.PI / 180) * radius;
                  const planetInfo = planetSymbols[planet.name] || { symbol: '?', color: '#000' };

                  return (
                    <g key={`p2-${planet.name}-${index}`}>
                      <text
                        x={x} y={y}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fontSize="16"
                        fill={planetInfo.color}
                        fontWeight="bold"
                      >
                        {planetInfo.symbol}
                      </text>
                      <text
                        x={x + 10} y={y - 8}
                        textAnchor="start"
                        dominantBaseline="middle"
                        fontSize="10"
                        fill="#FF0000"
                        fontWeight="bold"
                      >
                        R
                      </text>
                    </g>
                  );
                })}
            
                <circle cx="300" cy="300" r="230" fill="white" stroke="#ccc" strokeWidth="2" />
                <circle cx="300" cy="300" r="258" fill="white" stroke="#ccc" strokeWidth="1" />
                
                {aspects.map((aspect, index) => {
                  const angle1 = aspect.from - 90;
                  const angle2 = aspect.to - 90;
                  const x1 = 300 + Math.cos(angle1 * Math.PI / 180) * 205;
                  const y1 = 300 + Math.sin(angle1 * Math.PI / 180) * 205;
                  const x2 = 300 + Math.cos(angle2 * Math.PI / 180) * 205;
                  const y2 = 300 + Math.sin(angle2 * Math.PI / 180) * 205;

                  return (
                    <line
                      key={`aspect-${index}`}
                      x1={x1} y1={y1} x2={x2} y2={y2}
                      stroke={aspect.color}
                      strokeWidth="1.5"
                      opacity={aspect.opacity || 0.4}
                    />
                  );
                })}
                
                {Array.from({ length: 12 }).map((_, index) => {
                  const angle = (index * 30) - 90 + ascendantDegree;
                  const x1 = 300 + Math.cos(angle * Math.PI / 180) * 230;
                  const y1 = 300 + Math.sin(angle * Math.PI / 180) * 230;
                  const x2 = 300 + Math.cos(angle * Math.PI / 180) * 80;
                  const y2 = 300 + Math.sin(angle * Math.PI / 180) * 80;

                  return (
                    <line
                      key={`house-${index}`}
                      x1={x1} y1={y1} x2={x2} y2={y2}
                      stroke="#999"
                      strokeWidth="1"
                    />
                  );
                })}

                {zodiacSigns.map((sign, index) => {
                  const angle = (sign.start + 15) - 90;
                  const radius = 155;
                  const x = 300 + Math.cos(angle * Math.PI / 180) * radius;
                  const y = 300 + Math.sin(angle * Math.PI / 180) * radius;

                  const startAngle = sign.start - 90;
                  const endAngle = startAngle + 30;
                  const housePath = describeArc(300, 300, 230, startAngle, endAngle, 80);

                  return (
                    <g key={`house-segment-${index}`}>
                      <path
                        d={housePath}
                        fill={sign.color}
                        fillOpacity="0.3"
                        stroke="none"
                      />
                      <text
                        x={x} y={y}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fontSize="16"
                        fill="#333"
                        fontWeight="bold"
                      >
                        {index + 1}
                      </text>
                    </g>
                  );
                })}

                {person1Planets.map((planet, index) => {
                  const angle = planet.degree - 90;
                  const radius = 205;
                  const x = 300 + Math.cos(angle * Math.PI / 180) * radius;
                  const y = 300 + Math.sin(angle * Math.PI / 180) * radius;
                  const planetInfo = planetSymbols[planet.name] || { symbol: '?', color: '#000' };

                  return (
                    <text
                      key={`p1-${planet.name}`}
                      x={x} y={y}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fontSize="16"
                      fill={planetInfo.color}
                      fontWeight="bold"
                    >
                      {planetInfo.symbol}
                    </text>
                  );
                })}

                <circle cx="300" cy="300" r="75" fill="white" stroke="#ccc" strokeWidth="2" />

                {settings?.graphSettings?.displayPoints?.includes('AS') && (
                  <>
                    <line 
                      x1="300" y1="300" 
                      x2={300 + Math.cos((ascendantDegree - 90) * Math.PI / 180) * 225} 
                      y2={300 + Math.sin((ascendantDegree - 90) * Math.PI / 180) * 225} 
                      stroke="#000" 
                      strokeWidth="3" 
                    />
                    <text 
                      x={300 + Math.cos((ascendantDegree - 90) * Math.PI / 180) * 200} 
                      y={300 + Math.sin((ascendantDegree - 90) * Math.PI / 180) * 200} 
                      fontSize="20" 
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      {settings.wheelSettings?.ascendantDisplay || 'AS'}
                    </text>
                  </>
                )}

                {settings?.graphSettings?.displayPoints?.includes('MC') && (
                  <>
                    <line 
                      x1="300" y1="300" 
                      x2={300 + Math.cos((ascendantDegree) * Math.PI / 180) * 225} 
                      y2={300 + Math.sin((ascendantDegree) * Math.PI / 180) * 225} 
                      stroke="#000" 
                      strokeWidth="3" 
                    />
                    <text 
                      x={300 + Math.cos((ascendantDegree) * Math.PI / 180) * 195} 
                      y={300 + Math.sin((ascendantDegree) * Math.PI / 180) * 195} 
                      fontSize="20" 
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      MC
                    </text>
                  </>
                )}
              </svg>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-xl font-bold text-gray-800 mb-4 border-b-2 border-purple-500 pb-2">
            Chart Overview
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-purple-50 p-4 rounded-lg">
  <h4 className="font-semibold text-purple-900 mb-2">Birth Information</h4>
  <p className="text-sm text-gray-700">Date: {person1Data.day} {person1Data.month} {person1Data.year}</p>
  <p className="text-sm text-gray-700">Time: {person1Data.hour}:{person1Data.minute}</p>
  <p className="text-sm text-gray-700">
    Location: {synastryData?.data?.person1?.birth_info?.location?.name || person1Data.location || 'N/A'}
  </p>
</div>
          </div>
        </div>

        {synastryData?.data?.person1?.ascendant?.sign && (
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4 border-b-2 border-purple-500 pb-2">
              Ascendant in {synastryData.data.person1.ascendant.sign}
            </h3>
            <div className="bg-purple-50 p-4 rounded-lg">
              <p className="text-gray-700 leading-relaxed">
                {getAscendantInterpretation(synastryData.data.person1.ascendant.sign)}
              </p>
            </div>
          </div>
        )}

        {synastryData?.data?.person1?.planets?.Sun && synastryData?.data?.person1?.planets?.Moon && (
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4 border-b-2 border-purple-500 pb-2">
              Core Luminaries
            </h3>
            
            <div className="mb-6 bg-yellow-50 p-4 rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl" style={{ color: planetColors['Sun'] }}>☉</span>
                <div>
                  <h4 className="font-bold text-lg text-gray-800">
                    Sun in {synastryData.data.person1.planets.Sun.sign} - House {calculateHouse(parseFloat(synastryData.data.person1.planets.Sun.longitude), synastryData.data.person1.houses)}
                  </h4>
                  <p className="text-sm text-gray-600">{synastryData.data.person1.planets.Sun.position}</p>
                </div>
              </div>
              <div className="space-y-3">
                <p className="text-gray-700 leading-relaxed">
                  <strong>Sun in {synastryData.data.person1.planets.Sun.sign}:</strong> {getSunSignInterpretation(synastryData.data.person1.planets.Sun.sign)}
                </p>
                <p className="text-gray-700 leading-relaxed">
                  <strong>Sun in House {calculateHouse(parseFloat(synastryData.data.person1.planets.Sun.longitude), synastryData.data.person1.houses)}:</strong> {getSunHouseInterpretation(calculateHouse(parseFloat(synastryData.data.person1.planets.Sun.longitude), synastryData.data.person1.houses))}
                </p>
              </div>
            </div>

            <div className="mb-6 bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl" style={{ color: planetColors['Moon'] }}>☽</span>
                <div>
                  <h4 className="font-bold text-lg text-gray-800">
                    Moon in {synastryData.data.person1.planets.Moon.sign} - House {calculateHouse(parseFloat(synastryData.data.person1.planets.Moon.longitude), synastryData.data.person1.houses)}
                  </h4>
                  <p className="text-sm text-gray-600">{synastryData.data.person1.planets.Moon.position}</p>
                </div>
              </div>
              <div className="space-y-3">
                <p className="text-gray-700 leading-relaxed">
                  <strong>Moon in {synastryData.data.person1.planets.Moon.sign}:</strong> {getMoonSignInterpretation(synastryData.data.person1.planets.Moon.sign)}
                </p>
                <p className="text-gray-700 leading-relaxed">
                  <strong>Moon in House {calculateHouse(parseFloat(synastryData.data.person1.planets.Moon.longitude), synastryData.data.person1.houses)}:</strong> {getMoonHouseInterpretation(calculateHouse(parseFloat(synastryData.data.person1.planets.Moon.longitude), synastryData.data.person1.houses))}
                </p>
              </div>
            </div>
          </div>
        )}

        {synastryData?.data?.person1?.planets && (
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4 border-b-2 border-purple-500 pb-2">
              Other Planetary Positions
            </h3>
            {Object.entries(synastryData.data.person1.planets)
              .filter(([name]) => name !== 'Sun' && name !== 'Moon')
              .filter(([planet]) => {
                const displayPlanets = settings?.wheelSettings?.displayPlanets;
                if (!displayPlanets || displayPlanets === undefined) return true;
                if (Array.isArray(displayPlanets) && displayPlanets.length === 0) return false;
                return displayPlanets.includes(planet);
              })
              .map(([planet, data]) => (
                <div key={planet} className="mb-6 bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-3xl" style={{ color: planetColors[planet] }}>
                      {planetSymbols[planet]?.symbol || '●'}
                    </span>
                    <div>
                      <h4 className="font-bold text-lg text-gray-800">
                        {planet} in {data.sign} - House {calculateHouse(parseFloat(data.longitude), synastryData.data.person1.houses)}
                      </h4>
                      <p className="text-sm text-gray-600">{formatPlanetPosition(data.position, data.longitude, data.sign)}</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <p className="text-gray-700 leading-relaxed">
                      <strong>{planet} in {data.sign}:</strong> {getPlanetSignInterpretation(planet, data.sign)}
                    </p>
                    <p className="text-gray-700 leading-relaxed">
                      <strong>{planet} in House {calculateHouse(parseFloat(data.longitude), synastryData.data.person1.houses)}:</strong> {getPlanetHouseInterpretation(planet, calculateHouse(parseFloat(data.longitude), synastryData.data.person1.houses))}
                    </p>
                  </div>
                </div>
              ))}
          </div>
        )}

        {synastryData?.data?.person1?.houses?.[9]?.sign && (
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4 border-b-2 border-purple-500 pb-2">
              Midheaven in {synastryData.data.person1.houses[9].sign}
            </h3>
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-gray-700 leading-relaxed">
                {getMidheavenInterpretation(synastryData.data.person1.houses[9].sign)}
              </p>
            </div>
          </div>
        )}

        {synastryData?.data?.person1?.houses && synastryData.data.person1.houses.length > 0 && (
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4 border-b-2 border-purple-500 pb-2">
              House Cusps
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              {synastryData.data.person1.houses.map((house) => (
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
        )}

        {synastryData?.data?.person1?.aspects && synastryData.data.person1.aspects.length > 0 && (
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4 border-b-2 border-green-500 pb-2">
              Natal Aspects ({synastryData.data.person1.aspects
                .filter(aspect => {
                  const enabledAspects = settings?.aspects?.enabledAspects;
                  if (!enabledAspects || enabledAspects === undefined) return true;
                  if (Array.isArray(enabledAspects) && enabledAspects.length === 0) return false;
                  const normalizedAspect = normalizeAspectName(aspect.aspect);
                  const normalizedEnabledAspects = enabledAspects.map(a => normalizeAspectName(a));
                  return normalizedEnabledAspects.includes(normalizedAspect);
                }).length})
            </h3>
            <div className="space-y-3">
              {synastryData.data.person1.aspects
                .filter(aspect => {
                  const enabledAspects = settings?.aspects?.enabledAspects;
                  if (!enabledAspects || enabledAspects === undefined) return true;
                  if (Array.isArray(enabledAspects) && enabledAspects.length === 0) return false;
                  const normalizedAspect = normalizeAspectName(aspect.aspect);
                  const normalizedEnabledAspects = enabledAspects.map(a => normalizeAspectName(a));
                  return normalizedEnabledAspects.includes(normalizedAspect);
                })
                .slice(0, 15)
                .map((aspect, idx) => (
                  <div key={idx} className="bg-green-50 p-3 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-gray-800">
                        {aspect.planet1} {aspect.aspect} {aspect.planet2}
                      </h4>
                      <span className="text-sm text-gray-600">
                        Orb: {aspect.orb}° {aspect.exact && '✓ Exact'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {getAspectInterpretation(aspect.planet1, aspect.planet2, aspect.aspect)}
                    </p>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  </div>
)}
    </div>
   
   </>
  );
};

function describeArc(x, y, radius, startAngle, endAngle, innerRadius = null) {
  const start = polarToCartesian(x, y, radius, endAngle);
  const end = polarToCartesian(x, y, radius, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

  if (innerRadius !== null) {
    const startInner = polarToCartesian(x, y, innerRadius, endAngle);
    const endInner = polarToCartesian(x, y, innerRadius, startAngle);

    return [
      "M", start.x, start.y,
      "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y,
      "L", endInner.x, endInner.y,
      "A", innerRadius, innerRadius, 0, largeArcFlag, 1, startInner.x, startInner.y,
      "Z"
    ].join(" ");
  }

  const outerRadius = radius;
  const innerRadiusCalc = radius - 20;

  const startOuter = polarToCartesian(x, y, outerRadius, endAngle);
  const endOuter = polarToCartesian(x, y, outerRadius, startAngle);
  const startInner = polarToCartesian(x, y, innerRadiusCalc, endAngle);
  const endInner = polarToCartesian(x, y, innerRadiusCalc, startAngle);

  return [
    "M", startOuter.x, startOuter.y,
    "A", outerRadius, outerRadius, 0, largeArcFlag, 0, endOuter.x, endOuter.y,
    "L", endInner.x, endInner.y,
    "A", innerRadiusCalc, innerRadiusCalc, 0, largeArcFlag, 1, startInner.x, startInner.y,
    "Z"
  ].join(" ");
}

function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
  const angleInRadians = angleInDegrees * Math.PI / 180.0;
  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians)
  };
}

export default SynastryWheel;