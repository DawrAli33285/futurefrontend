import React from 'react';
import { Link } from 'react-router-dom';

export default function NewsletterPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8 px-4">
      <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-xl overflow-hidden">
      
        <div className="bg-white px-8 py-6 border-b-2 border-gray-900">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-5xl font-bold mb-2">MTZ<br />INSIDERS</h1>
            </div>
            <div className="text-right">
              <div className="bg-black text-white px-4 py-1 text-sm mb-2">
                ISSUE #109
              </div>
              <h2 className="text-xl font-semibold">TRUE SIDEREAL ASTROLOGY</h2>
              <h3 className="text-xl font-semibold">WEEKLY NEWSLETTER</h3>
              <p className="text-lg mt-2">27 October 2025</p>
            </div>
          </div>
        </div>

  
        <div className="flex flex-col lg:flex-row">
    
          <div className="flex-1 px-8 py-8">
        
            <div className="mb-6">
              <img 
                src="https://images.unsplash.com/photo-1518066000714-58c45f1a2c0a?w=800&q=80" 
                alt="Wind chimes" 
                className="w-full h-64 object-cover rounded"
              />
            </div>

       
            <h2 className="text-[30px] font-bold mb-2">Mars Grand Trine</h2>
            <p className="text-sm text-gray-600 mb-6">Wednesday October 29<sup>th</sup> 2025</p>

            <div className="space-y-4 text-gray-800 leading-relaxed">
              <p>
                A grand trine is an astrological alignment formed when three planets create flowing 120-degree angles to one another, forming an equilateral triangle in the chart. This week, Mars in Libra, Jupiter in Gemini, and Saturn in Pisces are forming a rare grand trine, offering movement, clarity, and grounded insight. Mars and Jupiter are both in air signs, while Saturn anchors the formation from a water sign, giving this alignment a distinct blend of mental sharpness and emotional depth.
              </p>

              <p>
                Mars is the planet of energy, drive, and direction. In Libra, its assertiveness becomes more relational. You may feel called to act in ways that bring more balance, cooperation, or fairness to your environment. The trine to Jupiter in Gemini exacts on Tuesday and fuels this motion with ideas and curiosity. It brings confidence and vision to the choices we make, and encourages open dialogue that moves things forward.
              </p>

              <p>
                Jupiter in Gemini expands the realm of communication. It invites exploration of new ideas, learning, and a wider perspective. The trine from
              </p>
            </div>
          </div>

         
          <div className="lg:w-80 bg-gray-50 px-8 py-8 border-l border-gray-200">
            <div className="bg-white border-2 border-gray-900 p-6">
              <h3 className="text-2xl font-bold text-center mb-6 pb-4 border-b-2 border-gray-900">
                This Week
              </h3>

              <nav className="space-y-6">
                <Link 
                  to="/joinnewsletter" 
                  className="block text-center text-lg hover:text-blue-600 transition-colors"
                >
                  Mars Grand Trine
                </Link>

                <div className="border-t-2 border-gray-300"></div>

                <Link 
                  to="/joinnewsletter" 
                  className="block text-center text-lg hover:text-blue-600 transition-colors"
                >
                  1Q Moon in<br />Sag/Cap
                </Link>

                <div className="border-t-2 border-gray-300"></div>

                <Link 
                  to="/joinnewsletter" 
                  className="block text-center text-lg hover:text-blue-600 transition-colors"
                >
                  Mercury in<br />Scorpio
                </Link>

                <div className="border-t-2 border-gray-300"></div>

                <Link 
                  to="/joinnewsletter" 
                  className="block text-center text-lg hover:text-blue-600 transition-colors"
                >
                  Compatibility in<br />the Birth Chart
                </Link>

                <div className="border-t-2 border-gray-300"></div>

                <Link 
                  to="/joinnewsletter" 
                  className="block text-center text-lg hover:text-blue-600 transition-colors"
                >
                  Weekly<br />Horoscope
                </Link>

                <div className="border-t-2 border-gray-300"></div>

                <Link 
                  to="/joinnewsletter" 
                  className="block text-center text-lg hover:text-blue-600 transition-colors"
                >
                  Livestream
                </Link>
              </nav>
            </div>
          </div>
        </div>


        <div className="px-8 py-12 text-center border-t border-gray-200">
          <Link 
            to="/joinnewsletter"
            className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-8 py-3 rounded transition-colors"
          >
            JOIN NEWSLETTER
          </Link>
        </div>
      </div>
    </div>
  );
}