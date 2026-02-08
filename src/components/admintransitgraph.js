import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { ToastContainer,toast } from "react-toastify";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import axios from "axios";
import { BASE_URL } from "../baseurl";

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
      if (!value || value.length < 3) {
        setSuggestions([]);
        return;
      }

      setLoading(true);
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(value)}&limit=5&addressdetails=1`,
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

  return (
    <div ref={wrapperRef} className="relative">
      <label className="block text-sm font-medium mb-1 text-gray-600">
        Location (city, region, country)
      </label>
      <input
        type="text"
        name={name}
        value={typeof value === 'string' ? value : value?.name || ''}
        onChange={handleInputChange}
        onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
        className="w-full border rounded-lg p-2"
        placeholder="e.g. New York City, New York"
        required={required}
        autoComplete="off"
      />
      
      {loading && (
        <div className="absolute right-3 top-9 text-gray-400">
          <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      )}

      {showSuggestions && suggestions.length > 0 && (
        <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-b shadow-lg max-h-60 overflow-y-auto mt-1">
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              onClick={() => handleSelectSuggestion(suggestion)}
              className="px-3 py-2 hover:bg-indigo-50 cursor-pointer border-b border-gray-100 last:border-b-0"
            >
              <div className="text-sm text-gray-900">{suggestion.name}</div>
            </li>
          ))}
        </ul>
      )}

      {showSuggestions && !loading && typeof value === 'string' && value.length >= 3 && suggestions.length === 0 && (
        <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-b shadow-lg mt-1 px-3 py-2 text-sm text-gray-500">
          No locations found
        </div>
      )}
    </div>
  );
};

const TransitGraph = () => {
  const [settings, setSettings] = useState({});
 


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
    Sun: '#FFD700',
    Moon: '#C0C0C0',
    Mercury: '#FFA500',
    Venus: '#00FF00',
    Mars: '#FF0000',
    Jupiter: '#FF1493',
    Saturn: '#4169E1',
    Uranus: '#00CED1',
    Neptune: '#9370DB',
    Pluto: '#8B4513'
  };
  
  const getPlanetsFromData = () => {
    const displayPlanets = settings?.wheelSettings?.displayPlanets;
    
    const shouldShowAllPlanets = !displayPlanets || displayPlanets === undefined;
    const shouldHideAllPlanets = Array.isArray(displayPlanets) && displayPlanets.length === 0;
    
   
    if (shouldHideAllPlanets) {
 
      return [];
    }
  
    const defaultPlanets = ["Sun", "Moon", "Mercury", "Venus", "Mars"];
    
    if (shouldShowAllPlanets) {
      return defaultPlanets;
    }
    
    return defaultPlanets.filter(planet => displayPlanets.includes(planet));
  };
  
  const dummyPlanets = useMemo(() => {
   
    return getPlanetsFromData();
  }, [settings]);
  const getPlanetSpeed = (planet) => {
    const speeds = {
      'Sun': 1,
      'Moon': 13,
      'Mercury': 1.5,
      'Venus': 1.2,
      'Mars': 0.5,
      'Jupiter': 0.08,
      'Saturn': 0.03,
      'Uranus': 0.01,
      'Neptune': 0.006,
      'Pluto': 0.004
    };
    return speeds[planet] || 1;
  };

  const [timezone, setTimezone] = useState('UTC');
  const [timezoneList, setTimezoneList] = useState([]);
  const [timezoneLoading, setTimezoneLoading] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [chartResponse,setChartResponse]=useState({})
  const [subscribed,setSubsribed]=useState(false)
  const [formData, setFormData] = useState({
    startDate: "",
    endDate: "",
    startTime: "",
    endTime: "",
    location: "",
    timezone: "UTC",
    chartName:''
  });
  
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
 
  const [savedCharts,setSavedCharts]=useState([])
  const [selectedChart,setSelectedChart]=useState()
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
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

  const handleLocationChange = (locationData) => {
    setFormData({ ...formData, location: locationData });
  };

  const generateTransitData = useCallback((startDate, endDate, startTime, endTime, selectedTimezone = 'UTC') => {
    const data = [];
    const start = new Date(`${startDate}T${startTime || '00:00'}`);
    const end = new Date(`${endDate}T${endTime || '23:59'}`);
    
   
    const daysDiff = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    const intervals = Math.min(daysDiff + 1, 30);
    
    for (let i = 0; i < intervals; i++) {
      const currentDate = new Date(start.getTime() + (i * (end - start) / (intervals - 1)));
      const dayData = { 
        day: currentDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      };
      
      const daysSinceStart = (currentDate - start) / (1000 * 60 * 60 * 24);
      
      dummyPlanets.forEach((planet, index) => {
        const speeds = {
          'Sun': 1,
          'Moon': 13,
          'Mercury': 1.5,
          'Venus': 1.2,
          'Mars': 0.5
        };
        
        const basePosition = (index * 60) % 360;
        const speed = speeds[planet] || 1;
        dayData[planet] = Math.round((basePosition + (speed * daysSinceStart)) % 360);
      });
      
      data.push(dayData);
    }
    return data;
  }, [dummyPlanets]);

  const handleCalculate = async () => {
    setErrors({});
    
    const newErrors = {};
    
    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }
    
    if (!formData.endDate) {
      newErrors.endDate = 'End date is required';
    }
    
    if (formData.startDate && formData.endDate) {
      const start = new Date(`${formData.startDate}T${formData.startTime || '00:00'}`);
      const end = new Date(`${formData.endDate}T${formData.endTime || '23:59'}`);
      
      if (end < start) {
        newErrors.endDate = 'End date must be after start date';
      }
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setLoading(true);
    
    try {
      setTimeout(() => {
        const transitData = generateTransitData(
          formData.startDate,
          formData.endDate,
          formData.startTime,
          formData.endTime,
          timezone
        );
        setChartData(transitData);
        setChartResponse({
          chart_type: "Transit Graph",
          form_data: formData,
          chart_data: transitData,
          calculation_info: {
            data_points: transitData.length,
            time_range_days: Math.ceil((new Date(`${formData.endDate}T${formData.endTime || '23:59'}`) - new Date(`${formData.startDate}T${formData.startTime || '00:00'}`)) / (1000 * 60 * 60 * 24)),
            planets_tracked: dummyPlanets
          }
        });
        
        setLoading(false);
      }, 800);
      

    } catch (error) {
      console.error('Error calculating transits:', error);
      setErrors({ general: 'An error occurred while calculating transits' });
      setLoading(false);
    }
  };

  const handleViewReport = () => {
    if (chartData.length === 0) {
      setErrors({ general: 'Please calculate transit data first' });
      return;
    }
    setShowReport(true);
  };

  const handleRemoveChart =async(chartId) => {
 
    if (window.confirm('Are you sure you want to remove this chart?')) {
    
      try{
    let response=await axios.delete(`${BASE_URL}/transit-graph/${chartId}`)
        const updatedCharts = savedCharts.filter(chart => chart._id !== chartId);
      setSavedCharts(updatedCharts);
      
     
      if (selectedChart === chartId) {
        setSelectedChart(null);
        setChartData(null);
      }
      
      getTransitGraph();
    
     }catch(e){
      if(e?.response?.data?.error){
        toast.error(e?.response?.data?.error,{containerId:"transitgraph"})
      }else{
        toast.error("Error occured while trying to delete chart",{containerId:"transitgraph"})
      }
     }
    
    }
  };


  const handleSave = async() => {
    try {
      if (Object.keys(chartResponse).length === 0) {
        setErrors({ general: 'Please calculate a chart first' });
        return;
      }
      if(formData.chartName.length == 0){
        setErrors({ general: 'Please enter chart name' });
        return;
      }
  
      let token = localStorage.getItem('token');
      token = JSON.parse(token);
      
   
      const startDateTime = new Date(`${formData.startDate}T${formData.startTime || '00:00'}`);
      const endDateTime = new Date(`${formData.endDate}T${formData.endTime || '23:59'}`);
      const timeDiff = Math.ceil((endDateTime - startDateTime) / (1000 * 60 * 60 * 24));
      
      let saveChart = {
        ...chartResponse,
        chartName: formData.chartName,
        chartname: 'graph',
        calculation_info: {
          data_points: chartData.length,
          time_range_days: timeDiff,
          time_range: {
            start: `${formData.startDate} ${formData.startTime || '00:00'}`,
            end: `${formData.endDate} ${formData.endTime || '23:59'}`,
            timezone: timezone
          },
          location: {
            name: formData.location?.name || 'Not specified',
            coordinates: formData.location?.latitude ? {
              latitude: formData.location.latitude,
              longitude: formData.location.longitude
            } : null,
            fullAddress: formData.location?.name || 'Not specified'
          },
          generated_at: new Date(),
          planets_tracked: dummyPlanets
        }
      };
      
      let response = await axios.post(`${BASE_URL}/saveChart`, saveChart, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
  
      toast.success("Chart saved successfully", { containerId: "transitgraph" });
      setErrors({});
      
   
      setFormData({
        startDate: "",
        endDate: "",
        startTime: "",
        endTime: "",
        location: "",
        timezone: "UTC",
        chartName: ''
      });
      setChartResponse({});
      setChartData([]);
      setSavedCharts([...savedCharts, response.data.chart])
      
    } catch(e) {
      if(e?.response?.data?.error) {
        setErrors({ general: e.response.data.error });
      } else {
        setErrors({ general: "Error occurred while saving chart" });
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
  
  const generatePDF = () => {
    if (chartData.length === 0) {
      setErrors({ general: 'Please calculate transit data first' });
      return;
    }
  
    const printWindow = window.open('', '', 'width=800,height=900');
  
    const dateRange = `${formData.startDate} to ${formData.endDate}`;
    const locationInfo = formData.location?.name || 'Location not specified';
  
    printWindow.document.write(`
      <html>
        <head>
          <meta charset="UTF-8">
          <title>Transit Graph - ${dateRange}</title>
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
              margin: 20px 0;
            }
            .summary {
              text-align: left;
              margin: 20px auto;
              max-width: 600px;
              padding: 15px;
              background: #f9fafb;
              border-radius: 8px;
            }
            .planet-item {
              display: flex;
              justify-content: space-between;
              padding: 8px 0;
              border-bottom: 1px solid #e5e7eb;
            }
            @media print {
              body { background-color: white; }
            }
          </style>
        </head>
        <body>
          <h1>Transit Graph Analysis</h1>
          <div class="info">
            <strong>Period:</strong> ${dateRange}<br>
            <strong>Time:</strong> ${formData.startTime || '00:00'} - ${formData.endTime || '23:59'}<br>
            <strong>Timezone:</strong> ${timezone}<br>
            <strong>Location:</strong> ${locationInfo}
          </div>
          
          <div class="chart-container">
            <p style="color: #666; font-style: italic;">
              Chart visualization - ${chartData.length} data points tracked
            </p>
          </div>
  
          <div class="summary">
            <h3 style="margin-top: 0;">Planetary Positions Summary</h3>
            ${dummyPlanets.map(planet => {
              const firstPoint = chartData[0]?.[planet];
              const lastPoint = chartData[chartData.length - 1]?.[planet];
              const movement = ((lastPoint - firstPoint + 360) % 360).toFixed(1);
              return `
                <div class="planet-item">
                  <span><strong>${planet}:</strong></span>
                  <span>${firstPoint}° → ${lastPoint}° (${movement}° movement)</span>
                </div>
              `;
            }).join('')}
          </div>
  
          <div class="info" style="margin-top: 30px; font-size: 12px;">
            Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}
          </div>
        </body>
      </html>
    `);
  
    printWindow.document.close();
    setTimeout(() => printWindow.print(), 500);
  };
  


  const getTransitGraph = async (pageNum = 1, append = false) => {
    try {
      if (append) setLoadingMore(true);
      
      let token = localStorage.getItem('token');
      token = JSON.parse(token);
      let response = await axios.get(`${BASE_URL}/getTransitGraph?page=${pageNum}&limit=5`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
   
      
      if (append) {
        setSavedCharts(prev => [...prev, ...(response.data.charts || [])]);
      } else {
        setSavedCharts(response.data.charts || []);
      }
      
      setHasMore(response.data.hasMore);
      setPage(pageNum);
    } catch (e) {
      
      setSavedCharts([]);
    } finally {
      setLoadingMore(false);
    }
  }



  useEffect(() => {
    getTransitGraph();
    getSubscribed();
    getActiveSettings();
  }, []);

  const getActiveSettings = async () => {
    try {
      let token = localStorage.getItem('token');
      token = JSON.parse(token);
      let response = await axios.get(`${BASE_URL}/active`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
     
      setSettings(response.data.data);
    } catch (e) {
    
    }
  };

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
  return (
    <>
    <ToastContainer containerId={"transitgraph"}/>
    


    <div className="lg:max-w-6xl mx-auto lg:p-8">
    <div className="relative w-full max-w-xl mx-auto mb-6" style={{ aspectRatio: '1/1' }}>

        {chartData.length > 0 ? (
          <div className="w-full h-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <XAxis dataKey="day" />
                <YAxis domain={[0, 360]} />
                <Tooltip />
                <Legend />
                {dummyPlanets.map((planet, i) => (
                  <Line
                    key={planet}
                    type="monotone"
                    dataKey={planet}
                    stroke={`hsl(${(i * 70) % 360}, 70%, 50%)`}
                    strokeWidth={2}
                    dot={false}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <svg viewBox="0 0 800 800" className="w-full h-full">
            <rect x="100" y="100" width="600" height="600" fill="white" stroke="#e5e7eb" strokeWidth="2" />
            
            {Array.from({ length: 6 }).map((_, i) => (
              <g key={i}>
                <line
                  x1="100"
                  y1={100 + (i * 100)}
                  x2="700"
                  y2={100 + (i * 100)}
                  stroke="#e5e7eb"
                  strokeWidth="1"
                />
                <line
                  x1={100 + (i * 100)}
                  y1="100"
                  x2={100 + (i * 100)}
                  y2="700"
                  stroke="#e5e7eb"
                  strokeWidth="1"
                />
              </g>
            ))}
            
            <line x1="100" y1="700" x2="700" y2="700" stroke="#333" strokeWidth="2" />
            <line x1="100" y1="100" x2="100" y2="700" stroke="#333" strokeWidth="2" />
            
            <text x="80" y="110" fontSize="14" fill="#666" textAnchor="end">360°</text>
            <text x="80" y="310" fontSize="14" fill="#666" textAnchor="end">270°</text>
            <text x="80" y="510" fontSize="14" fill="#666" textAnchor="end">180°</text>
            <text x="80" y="710" fontSize="14" fill="#666" textAnchor="end">0°</text>
            
            <text x="100" y="730" fontSize="14" fill="#666" textAnchor="middle">Start</text>
            <text x="400" y="730" fontSize="14" fill="#666" textAnchor="middle">Time</text>
            <text x="700" y="730" fontSize="14" fill="#666" textAnchor="middle">End</text>
            
            <text x="400" y="400" fontSize="20" fill="#9ca3af" textAnchor="middle" dominantBaseline="middle">
              Transit data will appear here
            </text>
          </svg>
        )}
      </div>
  
      <div className="bg-white rounded-lg shadow-sm p-6 lg:max-w-xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-6">TRANSIT GRAPH</h2>
  
        <div className="space-y-4">
          <div className="flex items-center gap-4 flex-col md:flex-row">
            <label className="w-48 md:text-right font-medium">Start Date:</label>
            <div className="flex-1">
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className={`w-full border ${errors.startDate ? 'border-red-500' : 'border-gray-300'} rounded px-3 py-2`}
              />
              {errors.startDate && (
                <p className="text-red-500 text-xs mt-1">{errors.startDate}</p>
              )}
            </div>
          </div>
  
          <div className="flex items-center gap-4 flex-col md:flex-row">
            <label className="w-48 md:text-right font-medium">End Date:</label>
            <div className="flex-1">
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className={`w-full border ${errors.endDate ? 'border-red-500' : 'border-gray-300'} rounded px-3 py-2`}
              />
              {errors.endDate && (
                <p className="text-red-500 text-xs mt-1">{errors.endDate}</p>
              )}
            </div>
          </div>
  
          <div className="flex items-center gap-4 flex-col md:flex-row">
            <label className="w-48 md:text-right font-medium">Start Time:</label>
            <input
              type="time"
              name="startTime"
              value={formData.startTime}
              onChange={handleChange}
              className="flex-1 border border-gray-300 rounded px-3 py-2"
            />
          </div>
  
          <div className="flex items-center gap-4 flex-col md:flex-row">
            <label className="w-48 md:text-right font-medium">End Time:</label>
            <input
              type="time"
              name="endTime"
              value={formData.endTime}
              onChange={handleChange}
              className="flex-1 border border-gray-300 rounded px-3 py-2"
            />
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
            <div className="flex-1">
              <LocationSuggestionField
                value={formData.location}
                onChange={handleLocationChange}
                name="location"
                required={false}
              />
              {formData.location?.latitude && (
                <div className="text-xs text-gray-500 mt-1">
                  Coordinates: {formData.location.latitude.toFixed(4)}, {formData.location.longitude.toFixed(4)}
                </div>
              )}
            </div>
          </div>

          <h3 className="font-semibold mb-3">Chart Name</h3>

<div className="flex items-center gap-4 flex-col md:flex-row">
 
  <div className="flex-1 flex gap-2">
 <input
 type="text"
 value={formData.chartName}
 name="chartName"
 onChange={handleChange}
 className="flex-1 border border-gray-300 rounded px-3 py-2"/> 
  </div>
</div>

          {errors.general && (
            <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {errors.general}
            </div>
          )}
          <div className="flex justify-center pt-2">
            <button
              onClick={handleCalculate}
              disabled={loading}
              className="w-full bg-purple-100 hover:bg-purple-200 disabled:bg-gray-200 disabled:cursor-not-allowed text-gray-800 font-medium py-3 rounded transition-colors"
            >
              {loading ? "Calculating..." : "Calculate"}
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
      getTransitGraph(page + 1, true);
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
        setChartData(val.chart_data);
        
       
        setChartResponse({
          chart_type: val.chart_type,
          form_data: val.form_data,
          chart_data: val.chart_data,
          calculation_info: val.calculation_info,
          chartName: val.chartName
        });
        
       
        setFormData({
          startDate: val.form_data?.startDate || "",
          endDate: val.form_data?.endDate || "",
          startTime: val.form_data?.startTime || "",
          endTime: val.form_data?.endTime || "",
          location: val.form_data?.location || "",
          timezone: val.form_data?.timezone || "UTC",
          chartName: val.chartName || ""
        });
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
              className="w-full bg-purple-100 hover:bg-purple-200 disabled:bg-gray-200 disabled:cursor-not-allowed text-gray-800 font-medium py-3 rounded transition-colors"
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
          <h2 className="text-2xl font-bold">Transit Graph Report</h2>
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
  <h3 className="text-xl font-bold text-gray-800 mb-4 border-b-2 border-purple-500 pb-2">
    Transit Movement Visualization
  </h3>
  <div className="bg-gray-50 p-4 rounded-lg">
  <div className="relative w-full max-w-lg mx-auto">
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={chartData}>
          <XAxis 
            dataKey="day" 
            stroke="#666"
            style={{ fontSize: '12px' }}
          />
          <YAxis 
            domain={[0, 360]} 
            stroke="#666"
            style={{ fontSize: '12px' }}
            label={{ value: 'Degrees', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              border: '1px solid #ccc',
              borderRadius: '8px'
            }}
          />
          <Legend 
            wrapperStyle={{ fontSize: '12px' }}
            iconType="line"
          />
          {dummyPlanets.map((planet) => (
            <Line
              key={planet}
              type="monotone"
              dataKey={planet}
              stroke={planetColors[planet]}
              strokeWidth={2}
              dot={false}
              name={`${planetSymbols[planet]} ${planet}`}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  </div>
</div>

        <div className="mb-8">
          <h3 className="text-xl font-bold text-gray-800 mb-4 border-b-2 border-purple-500 pb-2">
            Transit Period Overview
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-purple-50 p-4 rounded-lg">
              <h4 className="font-semibold text-purple-900 mb-2">Time Range</h4>
              <p className="text-sm text-gray-700">Start: {formData.startDate} {formData.startTime || '00:00'}</p>
              <p className="text-sm text-gray-700">End: {formData.endDate} {formData.endTime || '23:59'}</p>
              <p className="text-sm text-gray-700">Timezone: {timezone}</p>
              <p className="text-sm text-gray-700 mt-2">
                Duration: {Math.ceil((new Date(`${formData.endDate}T${formData.endTime || '23:59'}`) - new Date(`${formData.startDate}T${formData.startTime || '00:00'}`)) / (1000 * 60 * 60 * 24))} days
              </p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <h4 className="font-semibold text-purple-900 mb-2">Location Information</h4>
              <p className="text-sm text-gray-700">
                {formData.location?.name || 'Location not specified'}
              </p>
              {formData.location?.latitude && (
                <p className="text-xs text-gray-600 mt-1">
                  Coordinates: {formData.location.latitude.toFixed(4)}°, {formData.location.longitude.toFixed(4)}°
                </p>
              )}
              <p className="text-sm text-gray-700 mt-2">
                Data Points Tracked: {chartData.length}
              </p>
              <p className="text-sm text-gray-700">
                Planets Tracked: {dummyPlanets.length}
              </p>
            </div>
          </div>
        </div>

       
        <div className="mb-8">
          <h3 className="text-xl font-bold text-gray-800 mb-4 border-b-2 border-purple-500 pb-2">
            Understanding Transit Graphs
          </h3>
          <div className="bg-purple-50 p-4 rounded-lg space-y-3">
            <p className="text-gray-700 leading-relaxed">
              <strong>What are Transits?</strong> Transits are the current positions of planets in the sky. 
              Unlike your natal chart (which is fixed at birth), transits constantly change and represent 
              the cosmic weather affecting everyone. This graph shows how planetary positions evolved during your selected time period.
            </p>
            <p className="text-gray-700 leading-relaxed">
              <strong>How to Read This Graph:</strong> Each colored line represents a planet's movement through the zodiac. 
              The Y-axis shows degrees (0-360°), representing the complete zodiac circle. The X-axis shows the time progression 
              from your start date to end date. When lines cross or cluster, it suggests significant planetary interactions.
            </p>
            <p className="text-gray-700 leading-relaxed">
              <strong>Zodiac Reference:</strong> The 360° circle is divided into 12 zodiac signs of 30° each:
              0°-30° Aries, 30°-60° Taurus, 60°-90° Gemini, 90°-120° Cancer, 120°-150° Leo, 150°-180° Virgo,
              180°-210° Libra, 210°-240° Scorpio, 240°-270° Sagittarius, 270°-300° Capricorn, 300°-330° Aquarius, 330°-360° Pisces.
            </p>
          </div>
        </div>

      
        <div className="mb-8">
          <h3 className="text-xl font-bold text-gray-800 mb-4 border-b-2 border-purple-500 pb-2">
            Planetary Energies During This Period
          </h3>
          <div className="space-y-4">
            {dummyPlanets.map((planet) => {
              const firstPoint = chartData[0]?.[planet];
              const lastPoint = chartData[chartData.length - 1]?.[planet];
              const movement = ((lastPoint - firstPoint + 360) % 360).toFixed(1);
              const speed = getPlanetSpeed(planet);
              
             
              const startSign = Math.floor(firstPoint / 30);
              const endSign = Math.floor(lastPoint / 30);
              const zodiacNames = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 
                                  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
              
              return (
                <div key={planet} className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-3xl" style={{ color: planetColors[planet] }}>
                      {planetSymbols[planet]}
                    </span>
                    <div className="flex-1">
                      <h4 className="font-bold text-lg text-gray-800">{planet}</h4>
                      <p className="text-xs text-gray-600">
                        {zodiacNames[startSign]} ({firstPoint}°) → {zodiacNames[endSign]} ({lastPoint}°) | Movement: {movement}°
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <p className="text-sm text-gray-700 leading-relaxed">
                      <strong>Sign Interpretation:</strong> {getPlanetSignInterpretation(planet, zodiacNames[endSign])}
                    </p>
                    
                    <p className="text-sm text-gray-700 leading-relaxed">
                      <strong>Transit Meaning:</strong> {
                        planet === 'Sun' && 'The Sun\'s transit illuminates different areas of collective consciousness. It represents the vital energy and focus available to everyone during this period. Where the Sun transits, there is attention, warmth, and the potential for growth and self-expression.'
                      }
                      {planet === 'Moon' && 'The Moon\'s rapid transit reflects the changing emotional atmosphere and public mood. It shows the collective\'s emotional needs, instincts, and receptivity. Moon transits affect daily rhythms, emotional responses, and the general feeling tone of each day.'
                      }
                      {planet === 'Mercury' && 'Mercury\'s transit influences communication patterns, information flow, and mental activity. During this period, Mercury\'s position affects how ideas are exchanged, decisions are made, and connections are formed. Pay attention to Mercury\'s sign for the style of thinking and communication that prevails.'
                      }
                      {planet === 'Venus' && 'Venus transiting shows where collective values, relationships, and aesthetic preferences are focused. This transit influences social harmony, financial matters, and what brings pleasure or beauty during this time. Venus colors the quality of connections and what people find attractive or desirable.'
                      }
                      {planet === 'Mars' && 'Mars\' transit indicates where collective energy, drive, and action are directed. This planet\'s movement shows the areas of life that demand assertion, courage, and initiative. Mars transits can bring motivation and dynamism, but also potential for conflict or rushed action.'
                      }
                      {planet === 'Jupiter' && 'Jupiter\'s transit brings expansion, optimism, and opportunities to the areas it touches. As a slower-moving planet, its influence spans weeks or months, marking periods of growth, learning, and increased faith. Jupiter shows where luck and abundance may flow more freely.'
                      }
                      {planet === 'Saturn' && 'Saturn\'s transit represents lessons, structure, and maturation. Its slow movement creates long-term themes around responsibility, discipline, and mastery. Saturn transits often bring challenges that lead to wisdom and lasting achievements through perseverance and commitment.'
                      }
                      {planet === 'Uranus' && 'Uranus transiting brings sudden change, innovation, and liberation. Its extremely slow movement marks generational shifts in consciousness. Where Uranus transits, expect the unexpected—breakthroughs, disruptions, and awakenings that free us from old patterns.'
                      }
                      {planet === 'Neptune' && 'Neptune\'s transit dissolves boundaries and inspires spiritual awareness, creativity, and compassion. This planet\'s movement is so slow it marks era-defining shifts in collective dreams, illusions, and ideals. Neptune transits heighten sensitivity and imagination while potentially clouding clarity.'
                      }
                      {planet === 'Pluto' && 'Pluto\'s transit represents deep transformation, power dynamics, and regeneration. Moving extremely slowly, Pluto marks generational metamorphosis and evolution. Its transits bring intensity, revealing what\'s hidden and demanding profound change, death of old forms, and rebirth into new ones.'
                      }
                    </p>
                    
                    <div className="bg-white p-3 rounded border border-gray-200">
                      <p className="text-xs text-gray-600">
                        <strong>Movement Analysis:</strong> {planet} moved {movement}° over {Math.ceil((new Date(`${formData.endDate}T${formData.endTime || '23:59'}`) - new Date(`${formData.startDate}T${formData.startTime || '00:00'}`)) / (1000 * 60 * 60 * 24))} days 
                        at an average speed of {speed}° per day.
                        {parseFloat(movement) < speed * 7 && ' This relatively slow movement suggests a period of consolidation and deepening in this planetary energy.'}
                        {parseFloat(movement) >= speed * 7 && ' This significant movement indicates dynamic shifts and evolution in this planetary influence.'}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-xl font-bold text-gray-800 mb-4 border-b-2 border-purple-500 pb-2">
            Understanding Planetary Speeds
          </h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h4 className="font-semibold text-yellow-900 mb-3">Fast-Moving Planets</h4>
              <div className="space-y-2">
                {dummyPlanets.filter(p => ['Moon', 'Mercury'].includes(p)).map(planet => (
                  <div key={planet} className="flex items-center gap-2">
                    <span style={{ color: planetColors[planet] }} className="text-xl">
                      {planetSymbols[planet]}
                    </span>
                    <div className="text-sm">
                      <div className="font-medium">{planet}</div>
                      <div className="text-xs text-gray-600">{getPlanetSpeed(planet)}° per day</div>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-600 mt-3 leading-relaxed">
                Fast movers create daily influences and fluctuations. They affect immediate circumstances and short-term energy.
              </p>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-semibold text-green-900 mb-3">Medium-Moving Planets</h4>
              <div className="space-y-2">
                {dummyPlanets.filter(p => ['Sun', 'Venus', 'Mars'].includes(p)).map(planet => (
                  <div key={planet} className="flex items-center gap-2">
                    <span style={{ color: planetColors[planet] }} className="text-xl">
                      {planetSymbols[planet]}
                    </span>
                    <div className="text-sm">
                      <div className="font-medium">{planet}</div>
                      <div className="text-xs text-gray-600">{getPlanetSpeed(planet)}° per day</div>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-600 mt-3 leading-relaxed">
                Medium movers indicate weekly themes and moderate-term influences on relationships, action, and vitality.
              </p>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-3">Slow-Moving Planets</h4>
              <div className="space-y-2">
                {dummyPlanets.filter(p => ['Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto'].includes(p)).map(planet => (
                  <div key={planet} className="flex items-center gap-2">
                    <span style={{ color: planetColors[planet] }} className="text-xl">
                      {planetSymbols[planet]}
                    </span>
                    <div className="text-sm">
                      <div className="font-medium">{planet}</div>
                      <div className="text-xs text-gray-600">{getPlanetSpeed(planet)}° per day</div>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-600 mt-3 leading-relaxed">
                Slow movers mark significant life chapters, long-term growth, and generational themes spanning months or years.
              </p>
            </div>
          </div>
        </div>

    
        <div className="mb-8">
          <h3 className="text-xl font-bold text-gray-800 mb-4 border-b-2 border-purple-500 pb-2">
            How to Use This Information
          </h3>
          <div className="bg-blue-50 p-4 rounded-lg">
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-purple-600 font-bold mt-1">•</span>
                <span><strong>Compare to Your Natal Chart:</strong> These transit positions show where planets are now. Compare them to your birth chart to see which areas of your life are being activated.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600 font-bold mt-1">•</span>
                <span><strong>Daily Energy (Fast Movers):</strong> Moon and Mercury change rapidly, showing day-to-day energy fluctuations and communication patterns.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600 font-bold mt-1">•</span>
                <span><strong>Weekly Themes (Medium Movers):</strong> Sun, Venus, and Mars indicate weekly themes around vitality, relationships, and action.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600 font-bold mt-1">•</span>
                <span><strong>Long-term Patterns (Slow Movers):</strong> Jupiter, Saturn, and outer planets mark significant life chapters spanning months or years.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600 font-bold mt-1">•</span>
                <span><strong>Track Line Crossings:</strong> When two planetary lines intersect on the graph, it indicates those planets are at the same degree—a conjunction aspect with powerful combined energy.</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg">
          <h4 className="font-semibold text-gray-800 mb-3">Practical Applications</h4>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-700">
            <div>
              <h5 className="font-semibold mb-2">Planning & Timing:</h5>
              <ul className="space-y-1 text-xs">
                <li>• Use fast-moving planets for daily scheduling</li>
                <li>• Track Venus for relationship timing</li>
                <li>• Follow Mars for action and initiative</li>
                <li>• Monitor Mercury for communication and contracts</li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-2">Personal Growth:</h5>
              <ul className="space-y-1 text-xs">
                <li>• Jupiter transits show growth opportunities</li>
                <li>• Saturn transits indicate lessons and structure</li>
                <li>• Outer planets bring transformation</li>
                <li>• Moon cycles affect emotional patterns</li>
              </ul>
            </div>
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

export default TransitGraph;