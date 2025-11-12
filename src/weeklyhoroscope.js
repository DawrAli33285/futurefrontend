import React, { useState } from 'react';

export default function HoroscopePage() {
  const [activeTab, setActiveTab] = useState('upcoming');

  const videos = {
    upcoming: {
      id: '4jQcGhRZZsM',
      title: 'Weekly Horoscope October 27th to November 2nd - True Sidereal Astrology'
    },
    previous: {
      id: 'dQw4w9WgXcQ',
      title: 'Weekly Horoscope October 20th to October 26th - True Sidereal Astrology'
    }
  };

  const currentVideo = videos[activeTab];

  return (
    <div className="min-h-screen bg-white py-12 px-4">
      <div className="max-w-6xl mx-auto">
     
        <h1 className="text-4xl font-bold text-center mb-8">WEEKLY SIDEREAL HOROSCOPE</h1>

     
        <div className="flex border-b border-gray-300 mb-8">
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`px-8 py-3 font-medium transition-colors ${
              activeTab === 'upcoming'
                ? 'border-b-2 border-gray-800 text-gray-800'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Upcoming Week
          </button>
          <button
            onClick={() => setActiveTab('previous')}
            className={`px-8 py-3 font-medium transition-colors ${
              activeTab === 'previous'
                ? 'border-b-2 border-gray-800 text-gray-800'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Previous Week
          </button>
        </div>

        
        <div className="border border-gray-300 p-8 mb-12">
       
          <div className="mb-8">
            <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
              <iframe
                key={currentVideo.id}
                className="absolute top-0 left-0 w-full h-full"
                src={`https://www.youtube.com/embed/${currentVideo.id}`}
                title={currentVideo.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            </div>
          </div>

        
          <div className="space-y-6">
            <h2 className="text-3xl font-bold">SIDEREAL HOROSCOPE</h2>

            <p className="text-gray-700 leading-relaxed">
              Join Athen while he discusses the weekly horoscope for this week. In this video, Athen talks about the position of the Sun, Moon, and other planets in the sky. As well as where we can put our intention and use the astrology toward our greatest potential.
            </p>

            <p className="text-gray-700 leading-relaxed">
              The key is balancing the qualities represented by each planet's sign placement and relationship to the other planets. It is through coming to this balance we unlock the greatest strength and potential of these collective energies.
            </p>

            <p className="text-gray-700 leading-relaxed">
              Also understanding the weaknesses and challenges of the week we find where strength and opportunity exist. With every experience that crosses our path, there is the potential for prosperity, enjoyment, and insight.
            </p>

            <p className="text-gray-700 leading-relaxed">
              This weekly horoscope shows you what you can do to maximize this potential. To help you actualize fulfillment and empowerment in your experiences.
            </p>

            <p className="text-gray-700 leading-relaxed">
              Join Athen in this adventure as he pierces through the collective veil and uncovers what the energies have in store for us all.
            </p>
          </div>
        </div>

    
        <div className="text-center mb-12">
          <p className="text-xl mb-2">
            GET THE WEEKLY HOROSCOPE SENT TO YOUR INBOX{' '}
            <a href="/joinnewsletter" className="text-indigo-600 hover:text-indigo-800 font-semibold">
              EVERY SUNDAY
            </a>
            .
          </p>
        </div>

      
        <div className="border-t border-gray-300 pt-8">
          <p className="text-xl mb-2">
            NEW TO{' '}
            <a href="/siderealastrology" className="text-indigo-600 hover:text-indigo-800 font-semibold">
              SIDEREAL ASTROLOGY
            </a>
            ?
          </p>
          
        </div>
      </div>
    </div>
  );
}