import React, { useState } from 'react';
import { ArrowRight, X } from 'lucide-react';

const teamMembers = [
  {
    id: 'andrea-buchan',
    name: 'ANDREA BUCHAN',
    title: 'Founder of True Sky Psychology',
    subtitle: '13-Sign Sidereal Astrologer • Sacred Psychology Practitioner • Energy & Consciousness Coach',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
    bio: "Andrea Buchan is the founder of True Sky Psychology™, an emerging educational and energetic system that integrates 13-Sign True Sidereal astrology with modern psychology, ancestral wisdom, and energy work. Her mission is to help people understand themselves through the real sky — the actual astronomical positions of the Sun, Moon, and planets — and to translate that truth into emotional, psychological, and energetic healing. For most of her life, Andrea worked within the framework of Western astrology, using it as a lens to understand personality and spiritual development. But in 2025, she encountered 13-Sign True Sidereal Astrology and immediately recognized its alignment with everything she already understood about the energetic biofield, somatics, nervous system regulation, and the fundamental principle: \"As above, so below.\" This awakening arrived during a profound chapter — new motherhood. Becoming a mother amplified her intuition, sensitivity, and awareness of how consciousness shapes the body, the environment, and human development."
  }
];

const TeamPage = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);

  const handleReadMore = (member) => {
    setSelectedMember(member);
    setShowModal(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedMember(null);
    document.body.style.overflow = 'unset';
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-5xl mx-auto px-6 py-16">
        <h1 className="text-[26px] md:text-[30px] font-light text-center mb-12 text-gray-800 tracking-wide">
          MEET THE TRUE SKY PSYCHOLOGY TEAM
        </h1>
        
        <div className="border-t border-gray-300 mb-16"></div>

        <div className="space-y-20">
          {teamMembers.map((member) => (
            <div key={member.id} className="flex flex-col md:flex-row gap-8 items-start">
              <div className="flex-shrink-0">
             
              </div>
              
              <div className="flex-1">
                <h2 className="text-2xl font-normal mb-2 text-gray-800 tracking-wide">
                  {member.name}
                </h2>
                {member.title && (
                  <p className="text-lg text-gray-700 mb-1 font-medium">
                    {member.title}
                  </p>
                )}
                {member.subtitle && (
                  <p className="text-sm text-gray-600 mb-6 italic">
                    {member.subtitle}
                  </p>
                )}
                <p className="text-gray-700 leading-relaxed text-justify mb-6">
                  {member.bio}
                </p>
                <button 
                  onClick={() => handleReadMore(member)}
                  className="text-purple-600 hover:text-purple-800 flex items-center gap-2 transition-colors font-normal"
                >
                  Read Full Bio <ArrowRight size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showModal && selectedMember && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={closeModal}
        >
          <div 
            className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeModal}
              className="sticky top-4 float-right mr-4 mt-4 p-2 hover:bg-gray-100 rounded-full transition-colors z-10"
              aria-label="Close modal"
            >
              <X size={24} className="text-gray-600" />
            </button>

            <div className="px-8 py-12">
              <div className="text-center mb-12">
                <h1 className="text-[30px] md:text-[36px] font-light mb-4 text-gray-800 tracking-wide">
                  {selectedMember.name}
                </h1>
                <p className="text-xl text-gray-700 mb-2 font-medium">
                  {selectedMember.title}
                </p>
                <p className="text-sm text-gray-600 italic">
                  {selectedMember.subtitle}
                </p>
              </div>

              <div className="border-t border-gray-300 mb-12"></div>

             
              <div className="mb-12">
                <div className="flex flex-col md:flex-row gap-8 mb-8">
                  <div className="flex-shrink-0 mx-auto md:mx-0">
                    
                  </div>
                  
                  <div className="flex-1">
                    <p className="text-gray-700 leading-relaxed mb-4 text-justify">
                      Andrea Buchan is the founder of True Sky Psychology™, an emerging educational and energetic system that integrates 13-Sign True Sidereal astrology with modern psychology, ancestral wisdom, and energy work. Her mission is to help people understand themselves through the real sky — the actual astronomical positions of the Sun, Moon, and planets — and to translate that truth into emotional, psychological, and energetic healing.
                    </p>
                    
                    <p className="text-gray-700 leading-relaxed mb-4 text-justify">
                      For most of her life, Andrea worked within the framework of Western astrology, using it as a lens to understand personality and spiritual development. But in 2025, she encountered 13-Sign True Sidereal Astrology and immediately recognized its alignment with everything she already understood about the energetic biofield, somatics, nervous system regulation, and the fundamental principle: <em>"As above, so below."</em>
                    </p>
                    
                    <p className="text-gray-700 leading-relaxed text-justify">
                      This awakening arrived during a profound chapter — new motherhood. Becoming a mother amplified her intuition, sensitivity, and awareness of how consciousness shapes the body, the environment, and human development. It clarified how deeply the sky interacts with our inner world and how important accurate cosmic information is for healing and self-understanding.
                    </p>
                  </div>
                </div>
                
                <p className="text-gray-700 leading-relaxed text-justify">
                  Andrea's work now unites energy healing, somatic awareness, psychology, social work, and real-sky astrology into a living framework that empowers people to understand their blueprint, regulate their frequency, and transform their lives.
                </p>
              </div>

              <div className="mb-12">
                <h2 className="text-2xl font-light mb-6 text-gray-800 tracking-wide flex items-center gap-2">
                  <span className="text-2xl">🌙</span> Professional Training & Credentials
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Andrea brings together both scientific and spiritual disciplines:
                </p>
                <ul className="space-y-2 text-gray-700 ml-6">
                  <li className="leading-relaxed">• Reiki Master / Instructor (January 18, 2018)</li>
                  <li className="leading-relaxed">• Registered Social Worker & Spiritual Coach</li>
                  <li className="leading-relaxed">• Psychic Intuition & Clairvoyance Development Training</li>
                  <li className="leading-relaxed">• SHERPA Breath & Cold Exposure Certified Coach Level 1</li>
                  <li className="leading-relaxed">• Yoga Teacher (YTT-200) — Prenatal & Restorative training included</li>
                  <li className="leading-relaxed">• Business & Entrepreneurship Studies</li>
                  <li className="leading-relaxed">• Research in Real-Sky Astronomy, the human biofield, planetary frequencies, and chakra–planet correspondences</li>
                </ul>
                <p className="text-gray-700 leading-relaxed mt-4 text-justify">
                  This multidisciplinary foundation allows her to understand people through psychological, energetic, ancestral, somatic, and cosmic dimensions.
                </p>
              </div>

              <div className="mb-12">
                <h2 className="text-2xl font-light mb-6 text-gray-800 tracking-wide flex items-center gap-2">
                  <span className="text-2xl">☀️</span> Her Work & Vision
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4 text-justify">
                  Andrea believes that healing is full-spectrum — the body, mind, energy field, environment, and sky all influence one another.
                </p>
                <p className="text-gray-700 leading-relaxed mb-4">
                  She is designing an evolving ecosystem within True Sky Psychology™, including:
                </p>
                <ul className="space-y-2 text-gray-700 ml-6 mb-4">
                  <li className="leading-relaxed">• A True Sidereal (13-Sign) Chart Generator grounded in astronomy</li>
                  <li className="leading-relaxed">• Weekly Natal-to-Transit Energy Updates</li>
                  <li className="leading-relaxed">• Courses in consciousness, energy work, sidereal astrology, and Sacred Psychology</li>
                  <li className="leading-relaxed">• Future software that integrates astrology, psychology, and biofield mapping</li>
                </ul>
                <p className="text-gray-700 leading-relaxed text-justify">
                  Her vision is to make the real sky accessible, empowering, and scientifically aligned, while honoring the ancient global traditions that understood the relationship between the heavens and human consciousness.
                </p>
              </div>

              <div className="mb-12">
                <h2 className="text-2xl font-light mb-6 text-gray-800 tracking-wide flex items-center gap-2">
                  <span className="text-2xl">💫</span> Andrea's Mission
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Andrea is committed to helping people:
                </p>
                <ul className="space-y-2 text-gray-700 ml-6">
                  <li className="leading-relaxed">• understand their true chart using the real 13-sign sky</li>
                  <li className="leading-relaxed">• deepen emotional and psychological self-awareness</li>
                  <li className="leading-relaxed">• improve nervous system regulation for healing and manifestation</li>
                  <li className="leading-relaxed">• decondition outdated belief systems</li>
                  <li className="leading-relaxed">• reconnect with natural and cosmic cycles</li>
                  <li className="leading-relaxed">• live in alignment with their authentic energetic blueprint</li>
                  <li className="leading-relaxed">• and ultimately, master their consciousness</li>
                </ul>
                <p className="text-gray-700 leading-relaxed mt-4 text-justify">
                  Her work brings astrology into a new era — grounded in astronomy, elevated by psychology, and alive with energetic intelligence.
                </p>
              </div>

              <div className="bg-purple-50 border-l-4 border-purple-600 p-8">
                <h2 className="text-2xl font-light mb-4 text-gray-800 tracking-wide flex items-center gap-2">
                  <span className="text-2xl">✧</span> A Note From Andrea
                </h2>
                <p className="text-gray-700 leading-relaxed italic text-justify">
                  "I'm not here to define anyone — I'm here to help them remember. When we understand how the sky above us shapes the energy within us, everything becomes clearer. The real sky expanded my understanding of consciousness in an instant, and now my purpose is to help others experience that same alignment and clarity."
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamPage;