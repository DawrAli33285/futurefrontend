import React, { useState, useEffect, useRef } from 'react';
import { BASE_URL } from '../baseurl';
import { ToastContainer,toast } from 'react-toastify';
import axios from 'axios';
const CompositeChartWheel = () => {
  const [chartResponse,setChartResponse]=useState({})

  const [settings,setSettings]=useState({})
  const [subscribed,setSubsribed]=useState(false)
  const [savedCharts,setSavedCharts]=useState([])
  const [selectedChart,setSelectedChart]=useState()
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [formData, setFormData] = useState({
    person1_year: '',
    person1_month: '',
    person1_day: '',
    person1_hour: '',
    person1_minute: '',
    person1_location: '',
    person1_latitude: null,
    person1_longitude: null,
    person1_timezone: 'UTC',
    person2_year: '',
    person2_month: '',
    person2_day: '',
    person2_hour: '',
    person2_minute: '',
    person2_location: '',
    person2_latitude: null,
    person2_longitude: null,
    person2_timezone: 'UTC',
    chartName:''
  });

  const [showReport, setShowReport] = useState(false);

  const [timezoneList, setTimezoneList] = useState([]);
const [timezoneLoading, setTimezoneLoading] = useState(false);

  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPerson2, setShowPerson2] = useState(false);


  const [suggestions1, setSuggestions1] = useState([]);
  const [suggestions2, setSuggestions2] = useState([]);
  const [showSuggestions1, setShowSuggestions1] = useState(false);
  const [showSuggestions2, setShowSuggestions2] = useState(false);
  const [loadingLocation1, setLoadingLocation1] = useState(false);
  const [loadingLocation2, setLoadingLocation2] = useState(false);
  const wrapper1Ref = useRef(null);
  const wrapper2Ref = useRef(null);


  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapper1Ref.current && !wrapper1Ref.current.contains(event.target)) {
        setShowSuggestions1(false);
      }
      if (wrapper2Ref.current && !wrapper2Ref.current.contains(event.target)) {
        setShowSuggestions2(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

 
  useEffect(() => {
    const fetchSuggestions = async () => {
      const value = formData.person1_location;
      if (!value || value.length < 3) {
        setSuggestions1([]);
        return;
      }

      setLoadingLocation1(true);
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(value)}&limit=5&addressdetails=1`,
          { headers: { 'User-Agent': 'CompositeChartApp/1.0' } }
        );
        
        const data = await response.json();
        const formattedSuggestions = data.map(item => ({
          name: item.display_name,
          latitude: parseFloat(item.lat),
          longitude: parseFloat(item.lon)
        }));
        
        setSuggestions1(formattedSuggestions);
        setShowSuggestions1(true);
      } catch (error) {
        console.error('Error fetching location suggestions:', error);
        setSuggestions1([]);
      } finally {
        setLoadingLocation1(false);
      }
    };

    const debounceTimer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounceTimer);
  },[formData.person1_location]);



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


useEffect(() => {
  const fetchSuggestions = async () => {
    const value = formData.person2_location;
    if (!value || value.length < 3) {
      setSuggestions2([]);
      return;
    }

    setLoadingLocation2(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(value)}&limit=5&addressdetails=1`,
        { headers: { 'User-Agent': 'CompositeChartApp/1.0' } }
      );
      
      const data = await response.json();
      const formattedSuggestions = data.map(item => ({
        name: item.display_name,
        latitude: parseFloat(item.lat),
        longitude: parseFloat(item.lon)
      }));
      
      setSuggestions2(formattedSuggestions);
      setShowSuggestions2(true);
    } catch (error) {
      console.error('Error fetching location suggestions:', error);
      setSuggestions2([]);
    } finally {
      setLoadingLocation2(false);
    }
  };

  const debounceTimer = setTimeout(fetchSuggestions, 300);
  return () => clearTimeout(debounceTimer);
}, [formData.person2_location]);
  
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLocationSelect = (person, suggestion) => {
    if (person === 1) {
      setFormData(prev => ({
        ...prev,
        person1_location: suggestion.name,
        person1_latitude: suggestion.latitude,
        person1_longitude: suggestion.longitude
      }));
      setShowSuggestions1(false);
    } else {
      setFormData(prev => ({
        ...prev,
        person2_location: suggestion.name,
        person2_latitude: suggestion.latitude,
        person2_longitude: suggestion.longitude
      }));
      setShowSuggestions2(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
  
    try {
  
      if (!formData.person2_year || !formData.person2_month || !formData.person2_day) {
        setError('Person 2 birth date is required for composite chart');
        setLoading(false);
        return;
      }
  
      if (!formData.person2_latitude || !formData.person2_longitude) {
        setError('Please select a valid location for Person 2');
        setLoading(false);
        return;
      }
  
      const payload = {
        person1_year: parseInt(formData.person1_year),
        person1_month: parseInt(formData.person1_month),
        person1_day: parseInt(formData.person1_day),
        person1_hour: parseInt(formData.person1_hour) || 0,
        person1_minute: parseInt(formData.person1_minute) || 0,
        person1_latitude: formData.person1_latitude,
        person1_longitude: formData.person1_longitude,
        person1_timezone: formData.person1_timezone,
       
        person2_year: parseInt(formData.person2_year),
        person2_month: parseInt(formData.person2_month),
        person2_day: parseInt(formData.person2_day),
        person2_hour: parseInt(formData.person2_hour) || 0,
        person2_minute: parseInt(formData.person2_minute) || 0,
        person2_latitude: formData.person2_latitude,
        person2_longitude: formData.person2_longitude,
        person2_timezone: formData.person2_timezone
      };
  
      const response = await fetch(`${BASE_URL}/chart/composite`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
  
      const result = await response.json();
   
    



      if (result.success) {
       
        const formattedData = {
          person1: {
            ...result.data.person1,
            aspects: result.data.person1?.aspects || result.data.aspects || {}
          },
          person2: result.data.person2 ? {
            ...result.data.person2,
            aspects: result.data.person2?.aspects || {}
          } : null,
          composite: result.data.composite ? {
            ...result.data.composite,
            aspects: result.data.composite?.aspects || result.data.aspects || {}
          } : null
        };
        
        setChartData(formattedData);
        setChartResponse(formattedData.person1 || formattedData.composite);
      } else {
        setError(result.error || 'Failed to generate chart');
      }
    } catch (err) {
      setError('Failed to connect to the server. Please try again.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  



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
  
  
  const handleRemoveChart = async(chartId) => {
   
    if (window.confirm('Are you sure you want to remove this chart?')) {
     
      try{
        let response=await axios.delete(`${BASE_URL}/composite-chart/${chartId}`)
        const updatedCharts = savedCharts.filter(chart => chart._id !== chartId);
        setSavedCharts(updatedCharts);
        
       
        if (selectedChart === chartId) {
          setSelectedChart(null);
          setChartData(null);
        }
        getCompositeChart();
      }catch(e){
if(e?.response?.data?.error){
  toast.error(e?.response?.data?.error,{containerId:"transitchart"})
}else{
  toast.error("Error occured while trying to delete chart",{containerId:"transitchart"})
}
      }
      
     
    }
  };

  const zodiacSigns = getZodiacSigns();

  const planetSymbols = {
    Sun: '☉', Moon: '☽', Mercury: '☿', Venus: '♀', Mars: '♂', Jupiter: '♃',
    Saturn: '♄', Uranus: '♅', Neptune: '♆', Pluto: '♇'
  };

  const planetColors = {
    Sun: '#FFD700', Moon: '#C0C0C0', Mercury: '#A0A0A0', Venus: '#FF69B4',
    Mars: '#FF4500', Jupiter: '#FF8C00', Saturn: '#8B4513', Uranus: '#00CED1',
    Neptune: '#4169E1', Pluto: '#8B008B'
  };
  
  const aspectColors = {
    Conjunction: '#000000',
    Opposition: '#FF0000',
    Square: '#FF4500',
    Trine: '#0000FF',
    Sextile: '#00CED1',
    Quincunx: '#8B008B',
    'Semi-sextile': '#808080',
    'Semi-square': '#FFA500'
  };
  
  const size = 700;

  const center = size / 2;
  const outerRadius = 330;
  const innerRadius = 210;
  const houseRadius = 190;
  const planetRadius = 260;

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
    
    return `M ${start1.x} ${start1.y} A ${outerR} ${outerR} 0 ${largeArc} 1 ${end1.x} ${end1.y} L ${end2.x} ${end2.y} A ${innerR} ${innerR} 0 ${largeArc} 0 ${start2.x} ${start2.y} Z`;
  };




  const describeArc = (x, y, radius, startAngle, endAngle) => {
    const start = polarToCartesian(x, y, radius, endAngle);
    const end = polarToCartesian(x, y, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
    
    const outerRadius = radius;
    const innerRadius = radius - 40;
    
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
  };
  
  const polarToCartesian = (centerX, centerY, radius, angleInDegrees) => {
    const angleInRadians = (angleInDegrees) * Math.PI / 180.0;
    return {
      x: centerX + (radius * Math.cos(angleInRadians)),
      y: centerY + (radius * Math.sin(angleInRadians))
    };
  };

 
const getDisplayPlanets = (planetsData) => {
  if (!planetsData) return null;
  
  const displayPlanets = settings?.wheelSettings?.displayPlanets;
  

  const shouldShowAllPlanets = !displayPlanets || displayPlanets === undefined;
  

  const shouldHideAllPlanets = Array.isArray(displayPlanets) && displayPlanets.length === 0;
  
  if (shouldHideAllPlanets) {
   
    return {};
  }
  
  if (shouldShowAllPlanets) {
    return planetsData;
  }
  

  const filtered = {};
  Object.keys(planetsData).forEach(planet => {
    if (displayPlanets.includes(planet)) {
      filtered[planet] = planetsData[planet];
    }
  });
  
  return filtered;
};

const displayData = chartData?.composite || chartData?.person1;


const displayPlanets = displayData?.planets ? getDisplayPlanets(displayData.planets) : null;

const debugPlanetNames = () => {
  const displayPlanets = settings?.wheelSettings?.displayPlanets;
  const displayData = chartData?.composite || chartData?.person1;
  const aspectsData = displayData?.aspects;
  
  if (displayPlanets && Array.isArray(aspectsData) && aspectsData.length > 0) {
   
    const uniqueAspectPlanets = new Set();
    aspectsData.forEach(aspect => {
      uniqueAspectPlanets.add(aspect.planet1);
      uniqueAspectPlanets.add(aspect.planet2);
    });
    

    
    uniqueAspectPlanets.forEach(planet => {
      const exists = Object.keys(displayPlanets).some(p => p.toLowerCase() === planet.toLowerCase());
     
    });
  }
};


const getDisplayAspects = (aspectsData) => {
  if (!aspectsData) return null;
  
  const enabledAspects = settings?.aspects?.enabledAspects;
  
  

  const shouldHideAllAspects = Array.isArray(enabledAspects) && enabledAspects.length === 0;
  
  if (shouldHideAllAspects) {
   
    return [];
  }
  
 
  if (Array.isArray(aspectsData)) {
    let filtered = aspectsData;
    
   
    if (enabledAspects && Array.isArray(enabledAspects) && enabledAspects.length > 0) {
      filtered = filtered.filter(aspect => enabledAspects.includes(aspect.aspect));
     
    }
    
  
    return filtered;
  }
  
 
  const filtered = {};
  Object.keys(aspectsData).forEach(aspectType => {
    if (enabledAspects && Array.isArray(enabledAspects) && !enabledAspects.includes(aspectType)) {
      return;
    }
    
    filtered[aspectType] = aspectsData[aspectType];
  });
  
  return filtered;
};


const displayAspects = displayData?.aspects ? getDisplayAspects(displayData.aspects, displayPlanets) : null;



const calculateHouse = (longitude, houses) => {
  if (!houses || houses.length === 0) return 1;
  
  for (let i = 0; i < houses.length; i++) {
    const currentHouse = houses[i];
    const nextHouse = houses[(i + 1) % houses.length];
    
    const currentCusp = parseFloat(currentHouse.longitude || 0);
    const nextCusp = parseFloat(nextHouse.longitude || 0);
    
    if (nextCusp > currentCusp) {
      if (longitude >= currentCusp && longitude < nextCusp) {
        return currentHouse.house;
      }
    } else {
      if (longitude >= currentCusp || longitude < nextCusp) {
        return currentHouse.house;
      }
    }
  }
  return 1;
};


const handleViewReport = () => {
  if (!chartData) {
    setError('Please calculate a chart first');
    return;
  }
  setShowReport(true);
};

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
        <title>${chartData.person2 ? 'Composite Chart' : 'Birth Chart'} - ${new Date().toLocaleDateString()}</title>
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
        <h1>${chartData.person2 ? 'Composite Chart' : 'Birth Chart'}</h1>
        <div class="info">
          ${chartData.person2 
            ? `<strong>Person 1:</strong> ${chartData.person1.birth_info?.date || 'N/A'} ${chartData.person1.birth_info?.time || 'N/A'}<br>
               <strong>Person 2:</strong> ${chartData.person2.birth_info?.date || 'N/A'} ${chartData.person2.birth_info?.time || 'N/A'}`
            : `<strong>Birth:</strong> ${chartData.person1?.birth_info?.date || 'N/A'} ${chartData.person1?.birth_info?.time || 'N/A'}`
          }
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
    
   
    const referenceHouses = chartData.composite?.houses && chartData.composite.houses.length > 0
      ? chartData.composite.houses
      : (chartData.person1?.houses && chartData.person1.houses.length > 0
        ? chartData.person1.houses
        : []);
    
    
    const transformAspectsToSchema = (aspectsArray) => {
      if (!Array.isArray(aspectsArray)) return {};
      
      const aspectsObject = {
        Conjunction: [],
        Opposition: [],
        Square: [],
        Trine: [],
        Sextile: [],
        Quincunx: [],
        'Semi-sextile': [],
        'Semi-square': []
      };
      
      aspectsArray.forEach(aspect => {
        const aspectType = aspect.aspect;
        if (aspectsObject[aspectType]) {
          aspectsObject[aspectType].push({
            planet1: aspect.planet1,
            planet2: aspect.planet2,
            angle: aspect.angle,
            orb: aspect.orb
          });
        }
      });
      
      return aspectsObject;
    };
    
    const rawAspects = chartData.composite?.aspects || chartData.person1?.aspects || [];
    const aspectsToSave = transformAspectsToSchema(rawAspects);

let saveChart = {
  chartName: formData.chartName,
  chartname: 'composite',
  chart_type: "Composite (Two Person)",
  
  person1: {
    planets: chartData.person1?.planets || {},
    ascendant: chartData.person1?.ascendant || {},
    birth_info: chartData.person1?.birth_info || {},
    houses: (chartData.person1?.houses && chartData.person1.houses.length > 0)
      ? chartData.person1.houses
      : referenceHouses
  },
  
  person2: {
    planets: chartData.person2?.planets || {},
    ascendant: chartData.person2?.ascendant || {},
    birth_info: chartData.person2?.birth_info || {},
    houses: (chartData.person2?.houses && chartData.person2.houses.length > 0)
      ? chartData.person2.houses
      : referenceHouses
  },
  
  composite: {
    planets: (chartData.composite?.planets || chartData.person1?.planets) || {},
    ascendant: (chartData.composite?.ascendant || chartData.person1?.ascendant) || {},
    houses: (chartData.composite?.houses && chartData.composite.houses.length > 0)
      ? chartData.composite.houses
      : referenceHouses
  },
  
  aspects: aspectsToSave
};



let response=await axios.post(`${BASE_URL}/saveChart`,saveChart,{
headers:{
  Authorization:`Bearer ${token}`
}
})

toast.success("Chart saved sucessfully",{containerId:"compositechart"})
setError(null)
setFormData({
  person1_year: '',
  person1_month: '',
  person1_day: '',
  person1_hour: '',
  person1_minute: '',
  person1_location: '',
  person1_latitude: null,
  person1_longitude: null,
  person1_timezone: 'UTC',
  person2_year: '',
  person2_month: '',
  person2_day: '',
  person2_hour: '',
  person2_minute: '',
  person2_location: '',
  person2_latitude: null,
  person2_longitude: null,
  person2_timezone: 'UTC',
  chartName: ''
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

  }catch(e){

  }
}




const getCompositeChart=async(pageNum = 1, append = false)=>{
  try{
    if (append) setLoadingMore(true);
    
    let token=localStorage.getItem('token')
    token=JSON.parse(token)
    let response=await axios.get(`${BASE_URL}/getCompositeChart?page=${pageNum}&limit=5`,{headers:{
      Authorization:`Bearer ${token}`
    }})
   
    
    if (append) {
      setSavedCharts(prev => [...prev, ...response.data.charts]);
    } else {
      setSavedCharts(response.data.charts);
    }
    
    setHasMore(response.data.hasMore);
    setPage(pageNum);
  }catch(e){
 
  } finally {
    setLoadingMore(false);
  }
}


useEffect(()=>{
  getCompositeChart();
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
  
 
  
  setSettings(response.data.data)
  }catch(e){
       
      }
    }
  
  return (
   <>
<ToastContainer containerId={"compositechart"}/>



<div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 lg:p-8">
  <div className="lg:max-w-6xl mx-auto">
     

        <div className=" rounded-lg shadow-sm p-6 mb-8">
        <div className="relative w-full max-w-xl mx-auto mb-6" style={{ aspectRatio: '1/1' }}>  
        {displayData ? (
            <>
              

              <div id="chart-content" className="w-full aspect-square max-w-full mb-6">
                <svg viewBox={`0 0 ${size} ${size}`} className="drop-shadow-lg w-full h-full">
                  {zodiacSigns.map((sign, idx) => {
                     const nextSign = zodiacSigns[(idx + 1) % zodiacSigns.length]; 
                    return (
                      <g key={sign.name}>
                        <path d={getArcPath(sign.start, nextSign.start, innerRadius, outerRadius)} fill={sign.color} stroke="white" strokeWidth="2" opacity="0.85" />
                        <text x={getPosition(sign.start + 15, (outerRadius + innerRadius) / 2).x} y={getPosition(sign.start + 15, (outerRadius + innerRadius) / 2).y} fontSize="32" fontWeight="bold" fill="white" textAnchor="middle" dominantBaseline="middle">{sign.symbol}</text>
                      </g>
                    );
                  })}

                  {Array.from({ length: 360 }, (_, i) => i).filter(i => i % 5 === 0).map(deg => {
                    const isMain = deg % 30 === 0;
                    const length = isMain ? 18 : 10;
                    const start = getPosition(deg, outerRadius);
                    const end = getPosition(deg, outerRadius - length);
                    return <line key={deg} x1={start.x} y1={start.y} x2={end.x} y2={end.y} stroke={isMain ? "#333" : "#999"} strokeWidth={isMain ? "2.5" : "1"} />;
                  })}

                  <circle cx={center} cy={center} r={innerRadius} fill="white" stroke="#333" strokeWidth="2" />
                  <circle cx={center} cy={center} r={houseRadius} fill="none" stroke="#8E44AD" strokeWidth="3" />

                  {displayData.houses?.map((house, idx) => {
  const houseDegree = parseFloat(house.longitude || 0); 
  const inner = getPosition(houseDegree, 0);
  const outer = getPosition(houseDegree, houseRadius);
  return (
    <g key={idx}>
      <line x1={inner.x} y1={inner.y} x2={outer.x} y2={outer.y} stroke="#8E44AD" strokeWidth="2" />
      <text x={getPosition(houseDegree + 15, houseRadius - 25).x} y={getPosition(houseDegree + 15, houseRadius - 25).y} fontSize="16" fontWeight="bold" fill="#8E44AD" textAnchor="middle" dominantBaseline="middle">{house.house}</text>
    </g>
  );
})}
{displayPlanets && Object.entries(displayPlanets).map(([planetName, planetData]) => {
  const pos = getPosition(parseFloat(planetData.longitude), planetRadius);
  const labelPos = getPosition(parseFloat(planetData.longitude), planetRadius + 35);
  

  const degreeFormat = settings?.wheelSettings?.planetDegrees || 'Whole';
  let degreeText;
  
  if (degreeFormat === 'Whole') {
    degreeText = `${Math.floor(parseFloat(planetData.degree))}°`;
  } else if (degreeFormat === 'Decimal') {
    degreeText = `${parseFloat(planetData.degree).toFixed(2)}°`;
  } else {
    degreeText = `${Math.floor(parseFloat(planetData.degree))}°`;
  }
  
  return (
    <g key={planetName}>
      <line x1={center} y1={center} x2={getPosition(parseFloat(planetData.longitude), innerRadius).x} y2={getPosition(parseFloat(planetData.longitude), innerRadius).y} stroke="#ddd" strokeWidth="1" opacity="0.5" />
      <circle cx={pos.x} cy={pos.y} r="18" fill="white" stroke={planetColors[planetName]} strokeWidth="2.5" />
      <text x={pos.x} y={pos.y} fontSize="20" fill={planetColors[planetName]} textAnchor="middle" dominantBaseline="middle" fontWeight="bold">{planetSymbols[planetName]}</text>
      <text x={labelPos.x} y={labelPos.y} fontSize="11" fill="#333" textAnchor="middle" dominantBaseline="middle" fontWeight="600">{degreeText}</text>
    </g>
  );
})}
               {displayData.ascendant && (
  <>
    {(() => {
      const ascDisplay = settings?.wheelSettings?.ascendantDisplay || 'AS';
      const displayPoints = settings?.wheelSettings?.displayPoints || ['AS', 'MC', 'DS', 'IC'];
      
      return (
        <>
          {displayPoints.includes('AS') && (
            <>
              <text x={getPosition(parseFloat(displayData.ascendant.longitude), houseRadius - 60).x} y={getPosition(parseFloat(displayData.ascendant.longitude), houseRadius - 60).y} fontSize="18" fill="#8E44AD" textAnchor="middle" dominantBaseline="middle" fontWeight="bold">{ascDisplay}</text>
              <text x={getPosition(parseFloat(displayData.ascendant.longitude), houseRadius - 80).x} y={getPosition(parseFloat(displayData.ascendant.longitude), houseRadius - 80).y} fontSize="12" fill="#666" textAnchor="middle" dominantBaseline="middle">{Math.floor(parseFloat(displayData.ascendant.degree))}° {displayData.ascendant.sign}</text>
            </>
          )}
          {displayPoints.includes('MC') && (
            <text x={getPosition(parseFloat(displayData.ascendant.longitude) + 90, outerRadius - 40).x} y={getPosition(parseFloat(displayData.ascendant.longitude) + 90, outerRadius - 40).y} fontSize="18" fill="#8E44AD" textAnchor="middle" dominantBaseline="middle" fontWeight="bold">MC</text>
          )}
        </>
      );
    })()}
  </>
)}

<line x1={center} y1={center - 12} x2={center} y2={center + 12} stroke="#8E44AD" strokeWidth="2.5" />
                  <line x1={center - 12} y1={center} x2={center + 12} y2={center} stroke="#8E44AD" strokeWidth="2.5" />
                  
               
               
                  {displayAspects && Array.isArray(displayAspects) && displayData?.planets && displayAspects
  .map((aspect, idx) => {
    
    const allPlanets = displayData.planets;
    const planet1 = allPlanets[aspect.planet1];
    const planet2 = allPlanets[aspect.planet2];
    
   
    if (!planet1?.longitude || !planet2?.longitude) {
      return null; 
    }
    
    const pos1 = getPosition(parseFloat(planet1.longitude), innerRadius - 10);
    const pos2 = getPosition(parseFloat(planet2.longitude), innerRadius - 10);
    const aspectType = aspect.aspect;
    
    return (
      <line
        key={`${aspect.planet1}-${aspect.planet2}-${idx}`}
        x1={pos1.x}
        y1={pos1.y}
        x2={pos2.x}
        y2={pos2.y}
        stroke={aspectColors[aspectType] || '#999'}
        strokeWidth={aspectType === 'Conjunction' || aspectType === 'Opposition' ? '2' : '1'}
        opacity="0.4"
        strokeDasharray={aspectType === 'Quincunx' || aspectType === 'Semi-sextile' ? '3,3' : 'none'}
      />
    );
  })
  .filter(element => element !== null)
}
                </svg>
              </div>

              

          

            </>
          ) : (
            <svg viewBox="0 0 600 600" className="w-full h-full">
       
            {zodiacSigns.map((sign, idx) => {
              const nextSign = zodiacSigns[(idx + 1) % 12];
              const startAngle = sign.start - 90;
              const endAngle = startAngle + 30;
              const path = describeArc(300, 300, 280, startAngle, endAngle);
              
              return (
                <g key={sign.name}>
                  <path d={path} fill={sign.color} stroke="#fff" strokeWidth="2" />
                  <text
                    x={300 + Math.cos((startAngle + 15) * Math.PI / 180) * 250}
                    y={300 + Math.sin((startAngle + 15) * Math.PI / 180) * 250}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize="24"
                    fontWeight="bold"
                    fill="white"
                  >
                    {sign.symbol}
                  </text>
                </g>
              );
            })}
        
            <circle cx="300" cy="300" r="240" fill="white" stroke="#ccc" strokeWidth="2" />
          
           
          </svg>
          )}
        </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6 lg:max-w-xl mx-auto">
  <h2 className="text-2xl font-bold text-center mb-6">COMPOSITE WHEEL</h2>
  
  <form onSubmit={handleSubmit} className="space-y-4">
    <div className="mb-6">
    <h3 className="font-semibold text-lg">Birth Details</h3>
            
   
      <div className="flex items-center gap-4 flex-col md:flex-row mb-4">
        <label className="w-48 md:text-right font-medium">Name:</label>
        <input
          type="text"
          name="person1_name"
          placeholder="Enter name"
          className="flex-1 border border-gray-300 rounded px-3 py-2"
        />
      </div>

     
      <div className="flex items-center gap-4 flex-col md:flex-row mb-4">
        <label className="w-48 md:text-right font-medium">Date (dd-month-yyyy):</label>
        <div className="flex-1 flex gap-2 flex-col md:flex-row">
        <input
  type="number"
  name="person1_day"
  value={formData.person1_day}
  onChange={(e) => {
    const val = parseInt(e.target.value);
    if (val >= 1 && val <= 31) {
      handleInputChange(e);
    } else if (e.target.value === '') {
      handleInputChange(e);
    }
  }}
  onBlur={(e) => {
    const val = parseInt(e.target.value);
    if (isNaN(val) || val < 1) {
      e.target.value = '1';
      handleInputChange(e);
    }
    if (val > 31) {
      e.target.value = '31';
      handleInputChange(e);
    }
  }}
  placeholder="Day"
  className="w-16 border border-gray-300 rounded px-3 py-2 text-center"
  required
  min="1"
  max="31"
/>
          <select
            name="person1_month"
            value={formData.person1_month}
            onChange={handleInputChange}
            className="flex-1 border border-gray-300 rounded px-3 py-2"
            required
          >
            <option value="">Month</option>
            <option value="1">January</option>
            <option value="2">February</option>
            <option value="3">March</option>
            <option value="4">April</option>
            <option value="5">May</option>
            <option value="6">June</option>
            <option value="7">July</option>
            <option value="8">August</option>
            <option value="9">September</option>
            <option value="10">October</option>
            <option value="11">November</option>
            <option value="12">December</option>
          </select>
          <input
  type="number"
  name="person1_year"
  value={formData.person1_year}
  onChange={(e) => {
    const val = parseInt(e.target.value);
    if (val >= 1900 && val <= 2100) {
      handleInputChange(e);
    } else if (e.target.value === '' || e.target.value.length < 4) {
      handleInputChange(e);
    }
  }}
  onBlur={(e) => {
    const val = parseInt(e.target.value);
    if (isNaN(val) || val < 1900) {
      e.target.value = '1900';
      handleInputChange(e);
    }
    if (val > 2100) {
      e.target.value = '2100';
      handleInputChange(e);
    }
  }}
  placeholder="Year"
  className="w-20 border border-gray-300 rounded px-3 py-2 text-center"
  required
  min="1900"
  max="2100"
/>
        </div>
      </div>

     
      <div className="flex items-center gap-4 flex-col md:flex-row mb-4">
        <label className="w-48 md:text-right font-medium">Time (hh-mm):</label>
        <div className="flex-1 flex items-center gap-2">
        <input
  type="number"
  name="person1_hour"
  value={formData.person1_hour}
  onChange={(e) => {
    const val = parseInt(e.target.value);
    if (val >= 0 && val <= 23) {
      handleInputChange(e);
    } else if (e.target.value === '') {
      handleInputChange(e);
    }
  }}
  onBlur={(e) => {
    const val = parseInt(e.target.value);
    if (isNaN(val) || val < 0) {
      e.target.value = '0';
      handleInputChange(e);
    }
    if (val > 23) {
      e.target.value = '23';
      handleInputChange(e);
    }
  }}
  placeholder="HH"
  className="w-16 border border-gray-300 rounded px-3 py-2 text-center"
  required
  min="0"
  max="23"
/>
          <span>:</span>
          <input
  type="number"
  name="person1_minute"
  value={formData.person1_minute}
  onChange={(e) => {
    const val = parseInt(e.target.value);
    if (val >= 0 && val <= 59) {
      handleInputChange(e);
    } else if (e.target.value === '') {
      handleInputChange(e);
    }
  }}
  onBlur={(e) => {
    const val = parseInt(e.target.value);
    if (isNaN(val) || val < 0) {
      e.target.value = '0';
      handleInputChange(e);
    }
    if (val > 59) {
      e.target.value = '59';
      handleInputChange(e);
    }
  }}
  placeholder="MM"
  className="w-16 border border-gray-300 rounded px-3 py-2 text-center"
  required
  min="0"
  max="59"
/>
          <span className="text-sm text-gray-600">(24-hour clock)</span>
        </div>
      </div>
      <div className="flex items-center gap-4 flex-col md:flex-row mb-4">
  <label className="w-48 md:text-right font-medium">Timezone:</label>
  <select
    name="person1_timezone"
    value={formData.person1_timezone}
    onChange={handleInputChange}
    className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-300"
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
    
      <div className="flex items-center gap-4 flex-col md:flex-row mb-4">
        <label className="w-48 md:text-right font-medium">Location (city, region, country):</label>
        <div ref={wrapper1Ref} className="flex-1 relative">
          <input
            type="text"
            name="person1_location"
            value={formData.person1_location}
            onChange={handleInputChange}
            onFocus={() => suggestions1.length > 0 && setShowSuggestions1(true)}
            className="w-full border border-gray-300 rounded px-3 py-2"
            placeholder="New York City, New York, United States"
            required
            autoComplete="off"
          />
          {loadingLocation1 && (
            <div className="absolute right-3 top-3 text-gray-400">
              <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          )}
          {showSuggestions1 && suggestions1.length > 0 && (
            <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-b shadow-lg max-h-60 overflow-y-auto mt-1">
              {suggestions1.map((suggestion, index) => (
                <li
                  key={index}
                  onClick={() => handleLocationSelect(1, suggestion)}
                  className="px-3 py-2 hover:bg-indigo-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                >
                  <div className="text-sm text-gray-900">{suggestion.name}</div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

    
    
    </div>


     
  

    <div className="mb-6 border-t pt-6">
  <h3 className="text-xl font-semibold text-purple-900">Person 2 (Required)</h3>
  <p className="text-sm text-gray-600 mb-4">Composite charts require two people's birth data</p>


  <div className="flex items-center gap-4 flex-col md:flex-row mb-4">
    <label className="w-48 md:text-right font-medium">Name:</label>
    <input
      type="text"
      name="person2_name"
      placeholder="Enter name"
      className="flex-1 border border-gray-300 rounded px-3 py-2"
    />
  </div>

  <div className="flex items-center gap-4 flex-col md:flex-row mb-4">
    <label className="w-48 md:text-right font-medium">Date (dd-month-yyyy):</label>
    <div className="flex-1 flex gap-2 flex-col md:flex-row">
      <input
        type="number"
        name="person2_day"
        value={formData.person2_day}
        onChange={(e) => {
          const val = parseInt(e.target.value);
          if ((val >= 1 && val <= 31) || e.target.value === '') {
            handleInputChange(e);
          }
        }}
        onBlur={(e) => {
          const val = parseInt(e.target.value);
          if (isNaN(val) || val < 1) e.target.value = '1';
          if (val > 31) e.target.value = '31';
          handleInputChange(e);
        }}
        placeholder="Day"
        className="w-16 border border-gray-300 rounded px-3 py-2 text-center"
        required
        min="1"
        max="31"
      />
      <select
        name="person2_month"
        value={formData.person2_month}
        onChange={handleInputChange}
        className="flex-1 border border-gray-300 rounded px-3 py-2"
        required
      >
        <option value="">Month</option>
        <option value="1">January</option>
        <option value="2">February</option>
        <option value="3">March</option>
        <option value="4">April</option>
        <option value="5">May</option>
        <option value="6">June</option>
        <option value="7">July</option>
        <option value="8">August</option>
        <option value="9">September</option>
        <option value="10">October</option>
        <option value="11">November</option>
        <option value="12">December</option>
      </select>
      <input
        type="number"
        name="person2_year"
        value={formData.person2_year}
        onChange={(e) => {
          const val = parseInt(e.target.value);
          if ((val >= 1900 && val <= 2100) || e.target.value === '' || e.target.value.length < 4) {
            handleInputChange(e);
          }
        }}
        onBlur={(e) => {
          const val = parseInt(e.target.value);
          if (isNaN(val) || val < 1900) e.target.value = '1900';
          if (val > 2100) e.target.value = '2100';
          handleInputChange(e);
        }}
        placeholder="Year"
        className="w-20 border border-gray-300 rounded px-3 py-2 text-center"
        required
        min="1900"
        max="2100"
      />
    </div>
  </div>

 
  <div className="flex items-center gap-4 flex-col md:flex-row mb-4">
    <label className="w-48 md:text-right font-medium">Time (hh-mm):</label>
    <div className="flex-1 flex items-center gap-2">
      <input
        type="number"
        name="person2_hour"
        value={formData.person2_hour}
        onChange={(e) => {
          const val = parseInt(e.target.value);
          if ((val >= 0 && val <= 23) || e.target.value === '') {
            handleInputChange(e);
          }
        }}
        onBlur={(e) => {
          const val = parseInt(e.target.value);
          if (isNaN(val) || val < 0) e.target.value = '0';
          if (val > 23) e.target.value = '23';
          handleInputChange(e);
        }}
        placeholder="HH"
        className="w-16 border border-gray-300 rounded px-3 py-2 text-center"
        min="0"
        max="23"
      />
      <span>:</span>
      <input
        type="number"
        name="person2_minute"
        value={formData.person2_minute}
        onChange={(e) => {
          const val = parseInt(e.target.value);
          if ((val >= 0 && val <= 59) || e.target.value === '') {
            handleInputChange(e);
          }
        }}
        onBlur={(e) => {
          const val = parseInt(e.target.value);
          if (isNaN(val) || val < 0) e.target.value = '0';
          if (val > 59) e.target.value = '59';
          handleInputChange(e);
        }}
        placeholder="MM"
        className="w-16 border border-gray-300 rounded px-3 py-2 text-center"
        min="0"
        max="59"
      />
      <span className="text-sm text-gray-600">(24-hour clock)</span>
    </div>
  </div>

 
  <div className="flex items-center gap-4 flex-col md:flex-row mb-4">
    <label className="w-48 md:text-right font-medium">Timezone:</label>
    <select
      name="person2_timezone"
      value={formData.person2_timezone}
      onChange={handleInputChange}
      disabled={true}
      className="flex-1 border border-gray-300 rounded px-3 py-2"
    >
      {timezoneList.map((tz) => (
        <option key={tz} value={tz}>
          {tz}
        </option>
      ))}
    </select>
  </div>


<div className="flex items-center gap-4 flex-col md:flex-row mb-4">
  <label className="w-48 md:text-right font-medium">Location (city, region, country):</label>
  <div ref={wrapper2Ref} className="flex-1 relative">
    <input
      type="text"
      name="person2_location"
      value={formData.person2_location}
      onChange={handleInputChange}
      onFocus={() => suggestions2.length > 0 && setShowSuggestions2(true)}
      className="w-full border border-gray-300 rounded px-3 py-2"
      placeholder="New York City, New York, United States"
      required
      autoComplete="off"
    />
    {loadingLocation2 && (
      <div className="absolute right-3 top-3 text-gray-400">
        <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
    )}
    {showSuggestions2 && suggestions2.length > 0 && (
      <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-b shadow-lg max-h-60 overflow-y-auto mt-1">
        {suggestions2.map((suggestion, index) => (
          <li
            key={index}
            onClick={() => handleLocationSelect(2, suggestion)}
            className="px-3 py-2 hover:bg-purple-50 cursor-pointer border-b border-gray-100 last:border-b-0"
          >
            <div className="text-sm text-gray-900">{suggestion.name}</div>
          </li>
        ))}
      </ul>
    )}
  </div>
</div>
</div>


<h3 className="font-semibold mb-3">Chart Name</h3>

<div className="flex items-center gap-4 flex-col md:flex-row">
 
  <div className="flex-1 flex gap-2">
 <input
 type="text"
 value={formData.chartName}
 onChange={(e) => {
setFormData({
  ...formData,
  chartName:e.target.value
})
 }}
 className="flex-1 border border-gray-300 rounded px-3 py-2"/> 
  </div>
</div>

    {error && (
      <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700">
        {error}
      </div>
    )}

    <div className="flex justify-center pt-2">
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-purple-100 hover:bg-purple-200 text-gray-800 font-medium py-3 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Generating Chart...' : 'Calculate'}
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
      getCompositeChart(page + 1, true);
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
        
  
        const transformAspectsToArray = (aspectsObject) => {
          if (!aspectsObject || typeof aspectsObject !== 'object') return [];
          
          const aspectsArray = [];
          Object.entries(aspectsObject).forEach(([aspectType, aspectsList]) => {
            if (Array.isArray(aspectsList)) {
              aspectsList.forEach(aspect => {
                aspectsArray.push({
                  ...aspect,
                  aspect: aspectType
                });
              });
            }
          });
          return aspectsArray;
        };
        
        const formattedChartData = {
          person1: {
            ...val.person1,
            aspects: val.person1?.aspects ? transformAspectsToArray(val.person1.aspects) : []
          },
          person2: val.person2 ? {
            ...val.person2,
            aspects: val.person2?.aspects ? transformAspectsToArray(val.person2.aspects) : []
          } : null,
          composite: {
            ...(val.composite || val),
            aspects: val.aspects ? transformAspectsToArray(val.aspects) : []
          }
        };
        
        setChartData(formattedChartData);
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

    <div className="flex justify-center">
      <button
        onClick={subscribed?handleViewReport:checkOut}
        type="button"
       className="w-full bg-purple-100 hover:bg-purple-200 text-gray-800 font-medium py-3 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        View Report {subscribed?'⌘':'🔒'}
      </button>
    </div>
  </form>




  

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
          <h2 className="text-2xl font-bold">
            {chartData.person2 ? 'Composite Chart Report' : 'Birth Chart Report'}
          </h2>
          
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
          <div className="relative w-full max-w-lg mx-auto" style={{ aspectRatio: '1/1' }}>
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

           
                {chartData.person2 && displayPlanets && Object.entries(chartData.person2.planets || {}).map(([planetName, planetData], index) => {
                  const angle = parseFloat(planetData.longitude) - 90;
                  const radius = 247;
                  const x = 300 + Math.cos(angle * Math.PI / 180) * radius;
                  const y = 300 + Math.sin(angle * Math.PI / 180) * radius;
                  const planetInfo = { symbol: planetSymbols[planetName], color: planetColors[planetName] };

                  return (
                    <g key={`p2-${planetName}-${index}`}>
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
                        2
                      </text>
                    </g>
                  );
                })}

        
                <circle cx="300" cy="300" r="230" fill="white" stroke="#ccc" strokeWidth="2" />

               
                {displayAspects && Array.isArray(displayAspects) && displayAspects.map((aspect, index) => {
                  const allPlanets = displayData?.planets || {};
                  const planet1 = allPlanets[aspect.planet1];
                  const planet2 = allPlanets[aspect.planet2];
                  
                  if (!planet1?.longitude || !planet2?.longitude) return null;
                  
                  const angle1 = parseFloat(planet1.longitude) - 90;
                  const angle2 = parseFloat(planet2.longitude) - 90;
                  const x1 = 300 + Math.cos(angle1 * Math.PI / 180) * 205;
                  const y1 = 300 + Math.sin(angle1 * Math.PI / 180) * 205;
                  const x2 = 300 + Math.cos(angle2 * Math.PI / 180) * 205;
                  const y2 = 300 + Math.sin(angle2 * Math.PI / 180) * 205;

                  return (
                    <line
                      key={`aspect-${index}`}
                      x1={x1} y1={y1} x2={x2} y2={y2}
                      stroke={aspectColors[aspect.aspect] || '#999'}
                      strokeWidth="1.5"
                      opacity="0.4"
                    />
                  );
                })}

               
                {displayData?.houses && Array.from({ length: 12 }).map((_, index) => {
                  const house = displayData.houses[index];
                  if (!house) return null;
                  const angle = parseFloat(house.longitude) - 90;
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

                {displayPlanets && Object.entries(displayPlanets).map(([planetName, planetData]) => {
                  const angle = parseFloat(planetData.longitude) - 90;
                  const radius = 205;
                  const x = 300 + Math.cos(angle * Math.PI / 180) * radius;
                  const y = 300 + Math.sin(angle * Math.PI / 180) * radius;
                  const planetInfo = { symbol: planetSymbols[planetName], color: planetColors[planetName] };

                  return (
                    <text
                      key={`p1-${planetName}`}
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

             
                {displayData?.ascendant && settings?.graphSettings?.displayPoints?.includes('AS') && (
                  <>
                    <line 
                      x1="300" y1="300" 
                      x2={300 + Math.cos((parseFloat(displayData.ascendant.longitude) - 90) * Math.PI / 180) * 225} 
                      y2={300 + Math.sin((parseFloat(displayData.ascendant.longitude) - 90) * Math.PI / 180) * 225} 
                      stroke="#000" 
                      strokeWidth="3" 
                    />
                    <text 
                      x={300 + Math.cos((parseFloat(displayData.ascendant.longitude) - 90) * Math.PI / 180) * 200} 
                      y={300 + Math.sin((parseFloat(displayData.ascendant.longitude) - 90) * Math.PI / 180) * 200} 
                      fontSize="20" 
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      {settings.wheelSettings?.ascendantDisplay || 'AS'}
                    </text>
                  </>
                )}

                {displayData?.ascendant && settings?.graphSettings?.displayPoints?.includes('MC') && (
                  <>
                    <line 
                      x1="300" y1="300" 
                      x2={300 + Math.cos((parseFloat(displayData.ascendant.longitude)) * Math.PI / 180) * 225} 
                      y2={300 + Math.sin((parseFloat(displayData.ascendant.longitude)) * Math.PI / 180) * 225} 
                      stroke="#000" 
                      strokeWidth="3" 
                    />
                    <text 
                      x={300 + Math.cos((parseFloat(displayData.ascendant.longitude)) * Math.PI / 180) * 195} 
                      y={300 + Math.sin((parseFloat(displayData.ascendant.longitude)) * Math.PI / 180) * 195} 
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
            {chartData.person2 ? (
              <>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-purple-900 mb-2">Person 1 Birth Information</h4>
                  <p className="text-sm text-gray-700">Date: {chartData.person1.birth_info?.date || 'N/A'}</p>
                  <p className="text-sm text-gray-700">Time: {chartData.person1.birth_info?.time || 'N/A'}</p>
                  <p className="text-sm text-gray-700">Timezone: {chartData.person1.birth_info?.timezone || 'N/A'}</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-purple-900 mb-2">Person 2 Birth Information</h4>
                  <p className="text-sm text-gray-700">Date: {chartData.person2.birth_info?.date || 'N/A'}</p>
                  <p className="text-sm text-gray-700">Time: {chartData.person2.birth_info?.time || 'N/A'}</p>
                  <p className="text-sm text-gray-700">Timezone: {chartData.person2.birth_info?.timezone || 'N/A'}</p>
                </div>
              </>
            ) : (
              <div className="bg-purple-50 p-4 rounded-lg">
                <h4 className="font-semibold text-purple-900 mb-2">Birth Information</h4>
                <p className="text-sm text-gray-700">Date: {chartData.person1?.birth_info?.date || 'N/A'}</p>
                <p className="text-sm text-gray-700">Time: {chartData.person1?.birth_info?.time || 'N/A'}</p>
                <p className="text-sm text-gray-700">Timezone: {chartData.person1?.birth_info?.timezone || 'N/A'}</p>
              </div>
            )}
          </div>
        </div>

        {displayData?.ascendant?.sign && (
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4 border-b-2 border-purple-500 pb-2">
              Ascendant in {displayData.ascendant.sign}
            </h3>
            <div className="bg-purple-50 p-4 rounded-lg">
              <p className="text-gray-700 leading-relaxed">
                {getAscendantInterpretation(displayData.ascendant.sign)}
              </p>
            </div>
          </div>
        )}

       
        {displayData?.planets?.Sun && displayData?.planets?.Moon && (
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4 border-b-2 border-purple-500 pb-2">
              Core Luminaries
            </h3>
            
            <div className="mb-6 bg-yellow-50 p-4 rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl" style={{ color: planetColors['Sun'] }}>☉</span>
                <div>
                  <h4 className="font-bold text-lg text-gray-800">
                    Sun in {displayData.planets.Sun.sign} - House {calculateHouse(parseFloat(displayData.planets.Sun.longitude), displayData.houses)}
                  </h4>
                  <p className="text-sm text-gray-600">{displayData.planets.Sun.position}</p>
                </div>
              </div>
              <div className="space-y-3">
                <p className="text-gray-700 leading-relaxed">
                  <strong>Sun in {displayData.planets.Sun.sign}:</strong> {getSunSignInterpretation(displayData.planets.Sun.sign)}
                </p>
                <p className="text-gray-700 leading-relaxed">
                  <strong>Sun in House {calculateHouse(parseFloat(displayData.planets.Sun.longitude), displayData.houses)}:</strong> {getSunHouseInterpretation(calculateHouse(parseFloat(displayData.planets.Sun.longitude), displayData.houses))}
                </p>
              </div>
            </div>

            <div className="mb-6 bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl" style={{ color: planetColors['Moon'] }}>☽</span>
                <div>
                  <h4 className="font-bold text-lg text-gray-800">
                    Moon in {displayData.planets.Moon.sign} - House {calculateHouse(parseFloat(displayData.planets.Moon.longitude), displayData.houses)}
                  </h4>
                  <p className="text-sm text-gray-600">{displayData.planets.Moon.position}</p>
                </div>
              </div>
              <div className="space-y-3">
                <p className="text-gray-700 leading-relaxed">
                  <strong>Moon in {displayData.planets.Moon.sign}:</strong> {getMoonSignInterpretation(displayData.planets.Moon.sign)}
                </p>
                <p className="text-gray-700 leading-relaxed">
                  <strong>Moon in House {calculateHouse(parseFloat(displayData.planets.Moon.longitude), displayData.houses)}:</strong> {getMoonHouseInterpretation(calculateHouse(parseFloat(displayData.planets.Moon.longitude), displayData.houses))}
                </p>
              </div>
            </div>
          </div>
        )}

    
        {displayPlanets && (
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4 border-b-2 border-purple-500 pb-2">
              Other Planetary Positions
            </h3>
            {Object.entries(displayPlanets)
              .filter(([name]) => name !== 'Sun' && name !== 'Moon')
              .filter(([planet]) => {
                const displayPlanetsSettings = settings?.wheelSettings?.displayPlanets;
                if (!displayPlanetsSettings || displayPlanetsSettings === undefined) return true;
                if (Array.isArray(displayPlanetsSettings) && displayPlanetsSettings.length === 0) return false;
                return displayPlanetsSettings.includes(planet);
              })
              .map(([planet, data]) => (
                <div key={planet} className="mb-6 bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-3xl" style={{ color: planetColors[planet] }}>
                      {planetSymbols[planet] || '●'}
                    </span>
                    <div>
                      <h4 className="font-bold text-lg text-gray-800">
                        {planet} in {data.sign} - House {calculateHouse(parseFloat(data.longitude), displayData.houses)}
                      </h4>
                      <p className="text-sm text-gray-600">{data.position}</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <p className="text-gray-700 leading-relaxed">
                      <strong>{planet} in {data.sign}:</strong> {getPlanetSignInterpretation(planet, data.sign)}
                    </p>
                    <p className="text-gray-700 leading-relaxed">
                      <strong>{planet} in House {calculateHouse(parseFloat(data.longitude), displayData.houses)}:</strong> {getPlanetHouseInterpretation(planet, calculateHouse(parseFloat(data.longitude), displayData.houses))}
                    </p>
                  </div>
                </div>
              ))}
          </div>
        )}

     
        {displayData?.houses?.[9]?.sign && (
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4 border-b-2 border-purple-500 pb-2">
              Midheaven in {displayData.houses[9].sign}
            </h3>
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-gray-700 leading-relaxed">
                {getMidheavenInterpretation(displayData.houses[9].sign)}
              </p>
            </div>
          </div>
        )}

       
        {displayData?.houses && displayData.houses.length > 0 && (
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4 border-b-2 border-purple-500 pb-2">
              House Cusps
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              {displayData.houses.map((house) => (
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

     
        {displayAspects && Array.isArray(displayAspects) && displayAspects.length > 0 && (
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4 border-b-2 border-green-500 pb-2">
              {chartData.person2 ? 'Composite' : 'Natal'} Aspects ({displayAspects.length})
            </h3>
            <div className="space-y-3">
              {displayAspects
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

export default CompositeChartWheel;