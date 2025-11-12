import React from 'react';
import { ArrowRight } from 'lucide-react';


const teamMembers = [
  {
    id: 'annamaria-rajko',
    name: 'ANNAMARIA RAJKO',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
    bio: "Annamaria is a certified astrologer specializing in Evolutionary Astrology who works with true sidereal astrology, a system that aligns with the actual constellations in the sky. Her work is deeply rooted in the philosophy that the soul carries both the desire to individuate and the longing to return to its divine source. Drawing inspiration from Bhakti traditions and Platonic philosophy, she views astrology as a sacred tool for understanding the inner conflicts that shape our evolution, helping clients navigate their subconscious patterns and soul purpose."
  },
  {
    id: 'athen-chimenti',
    name: 'ATHEN CHIMENTI',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    bio: "Athen Chimenti is the founder of Mastering the Zodiac and leading expert in the field of true sidereal astrology. He is passionate about helping others gain clarity and direction in their lives using this nature-based form of astrology. Athen pioneered the return to sky-based astrology, reintroducing this timeless system that aligns with the actual constellations. He regularly appears on podcasts and other media channels to help spread the word about true sidereal astrology."
  }
];

const TeamPage = () => {
  const handleReadMore = (memberId) => {
   
    window.location.href = `/team/${memberId}`;
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-5xl mx-auto px-6 py-16">
        <h1 className="text-[26px] md:text-[30px] font-light text-center mb-12 text-gray-800 tracking-wide">
          MEET THE SIDEREAL TEAM
        </h1>
        
        <div className="border-t border-gray-300 mb-16"></div>

        <div className="space-y-20">
          {teamMembers.map((member) => (
            <div key={member.id} className="flex flex-col md:flex-row gap-8 items-start">
              <div className="flex-shrink-0">
                <img 
                  src={member.image} 
                  alt={member.name}
                  className="w-32 h-32 object-cover"
                />
              </div>
              
              <div className="flex-1">
                <h2 className="text-2xl font-normal mb-6 text-gray-800 tracking-wide">
                  {member.name}
                </h2>
                <p className="text-gray-700 leading-relaxed text-justify mb-6">
                  {member.bio}
                </p>
                <button 
                  onClick={() => handleReadMore(member.id)}
                  className="text-purple-600 hover:text-purple-800 flex items-center gap-2 transition-colors font-normal"
                >
                  Read Full Bio <ArrowRight size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TeamPage;