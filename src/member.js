import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const teamData = {
  'annamaria-rajko': {
    name: 'ANNAMARIA RAJKO',
    nickname: 'ANNE',
    title: 'EVOLUTIONARY ASTROLOGER',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
    fullBio: [
      "Annamaria is a certified astrologer specializing in Evolutionary Astrology. She works with true sidereal astrology, a system that aligns with the actual constellations in the sky, offering an astronomically precise perspective on the soul's journey of growth and transformation.",
      "Her work is deeply rooted in the philosophy that the soul carries both the desire to individuate and the longing to return to its divine source - a dynamic beautifully reflected in the interplay between Pluto and the personal chart.",
      "Drawing inspiration from Bhakti traditions and Platonic philosophy, Annamaria views astrology as a sacred tool for understanding the inner conflicts that shape our evolution. She helps clients navigate their subconscious patterns, deep-seated desires, and soul purpose, guiding them toward deeper self-awareness, spiritual growth, and integration.",
      "Through her readings, Annamaria provides insight into the soul's evolutionary path, revealing how personal struggles, relationships, and life experiences are all part of a greater journey toward authenticity and wholeness. Her approach is both intuitive and analytical, blending astrological wisdom with a deep understanding of spiritual longing, devotion, and transformation.",
      "Whether you are seeking clarity on your life's direction, relationship dynamics, or deeper self-exploration, Annamaria's work offers a transformative perspective - one that illuminates the soul's path with wisdom, depth, and compassion"
    ],
    hasLinks: true
  },
  'athen-chimenti': {
    name: 'ATHEN CHIMENTI',
    nickname: '',
    title: 'FOUNDER & SIDEREAL ASTROLOGY EXPERT',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    fullBio: [
      "Athen Chimenti is the founder of Mastering the Zodiac and leading expert in the field of true sidereal astrology. He is passionate about helping others gain clarity and direction in their lives using this nature-based form of astrology.",
      "Athen pioneered the return to sky-based astrology, reintroducing this timeless system that aligns with the actual constellations. He regularly appears on podcasts and other media channels to help spread the word about true sidereal astrology.",
      "His approach combines ancient wisdom with modern understanding, helping clients connect with their authentic path through precise astronomical calculations and deep spiritual insight.",
      "Through his work at Mastering the Zodiac, Athen has helped thousands of people discover the accuracy and transformative power of working with the true positions of the stars and planets."
    ],
    hasLinks: false
  }
};

const MemberBioPage = () => {
  const { name } = useParams();
  const navigate = useNavigate();
  const member = teamData[name];

  if (!member) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-5xl mx-auto px-6 py-16">
          <button 
            onClick={() => navigate('/team')}
            className="text-purple-600 hover:text-purple-800 mb-8 flex items-center gap-2"
          >
            <ArrowLeft size={18} /> Back to Team
          </button>
          <p className="text-gray-700">Member not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-5xl mx-auto px-6 py-16">
        <button 
          onClick={() => navigate('/team')}
          className="text-purple-600 hover:text-purple-800 mb-12 flex items-center gap-2 transition-colors"
        >
          <ArrowLeft size={18} /> Back to Team
        </button>

        <div className="flex flex-col md:flex-row gap-12 items-start">
          <div className="flex-1 order-2 md:order-1">
            <h1 className="text-3xl font-light mb-2 text-gray-800 tracking-wide">
              {member.name} {member.nickname && `(${member.nickname})`} – {member.title}
            </h1>
            
            <div className="space-y-6 mt-8">
              {member.fullBio.map((paragraph, index) => (
                <p key={index} className="text-gray-700 leading-relaxed text-justify">
                  {paragraph}
                </p>
              ))}
            </div>

            {member.hasLinks && (
              <div className="mt-8 text-gray-700">
                <p className="leading-relaxed">
                  If you are new to true sidereal astrology, we recommend{' '}
                  <a 
                    href="/true-signs" 
                    className="text-purple-600 hover:text-purple-800 underline"
                  >
                    viewing your signs
                  </a>{' '}
                  to see where the planets were in the sky when you were born. For greater clarity, book a{' '}
                  <a 
                    href="/readings" 
                    className="text-purple-600 hover:text-purple-800 underline"
                  >
                    true sidereal reading
                  </a>{' '}
                  with her to dive deep into your soul's evolution.
                </p>
              </div>
            )}
          </div>

          <div className="flex-shrink-0 order-1 md:order-2">
            <img 
              src={member.image} 
              alt={member.name}
              className="w-full md:w-72 h-auto object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberBioPage;