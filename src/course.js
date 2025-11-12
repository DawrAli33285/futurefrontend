import React from 'react';

const CoursesPage = () => {
  return (
    <div className="min-h-screen bg-white py-8 md:py-12 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        
        <h1 className="text-[26px] md:text-[30px] font-normal text-center mb-8 md:mb-12 uppercase tracking-wide">
          Sidereal Astrology Courses
        </h1>

        <div className="border-t border-gray-300 mb-12"></div>


        <section className="mb-16 md:mb-20">
          <div className="grid md:grid-cols-2 gap-6 md:gap-8 items-start">
          
            <div className="w-full">
              <div className="bg-gray-100 rounded-lg overflow-hidden shadow-lg">
                <iframe 
                  className="w-full aspect-video"
                  src="https://www.youtube.com/embed/CjBLipurd7M"
                  title="Sidereal Astrology Video Course"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </div>

          
            <div>
              <h2 className="text-lg md:text-xl font-semibold mb-3 md:mb-4">
                VIDEO COURSE (8 VIDEO LESSONS) - $195
              </h2>
              
              <p className="text-sm md:text-base text-gray-700 mb-4 text-justify">
                Master the full spectrum of sidereal astrology with Athen's comprehensive eight-lesson video course. Whether you're brand new to astrology or looking to deepen your practice, this self-paced program will guide you step-by-step from beginner to professional. Each lesson includes a 30–60 minute video, chart analysis assignments, and reading materials carefully designed to build your skills progressively. You'll learn everything from foundational birth chart interpretation to advanced predictive techniques. Athen is available via email to personally support you throughout your journey. Move at the pace that's right for you, revisit lessons anytime, and fully integrate each topic before advancing. With lifetime access to all materials, this course empowers you to master sidereal astrology on your own terms.
              </p>

              <p className="text-sm md:text-base text-gray-700 italic mb-3">
                Includes full access to True Sky online astrology software for the full length of study.
              </p>

              <p className="text-sm md:text-base text-gray-700 mb-4">
                Have questions? <a href="#" className="text-indigo-600 hover:underline">Contact Athen</a>.
              </p>

              <div className="mb-4">
                <a href="#" className="text-indigo-600 hover:underline text-sm md:text-base">
                  Video Course Preview
                </a>
                <span className="mx-2 text-gray-400">/</span>
                <a href="#" className="text-indigo-600 hover:underline text-sm md:text-base">
                  Video Course Outline
                </a>
              </div>

              <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded transition-colors text-sm md:text-base">
                ORDER NOW
              </button>
            </div>
          </div>
        </section>

      
        <section className="mb-16">
          <div className="grid md:grid-cols-2 gap-6 md:gap-8 items-start">
      
            <div className="w-full">
              <div className="rounded-lg overflow-hidden shadow-lg">
                <img 
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=700&fit=crop"
                  alt="Athen - Astrology Instructor"
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>

        
            <div>
              <h2 className="text-lg md:text-xl font-semibold mb-3 md:mb-4">
                ONE-ON-ONE COURSE (10 SESSIONS) - $1495
              </h2>
              
              <p className="text-sm md:text-base text-gray-700 mb-4 text-justify">
                Master the art and science of sidereal astrology through personalized one-on-one mentorship with Athen. Whether you're starting from scratch or building on what you already know, this course will take you from beginner to professional astrologer. Tailor your learning experience to your unique style and pace, with ten 1-hour Zoom sessions scheduled weekly or at your convenience. You'll also have direct access to Athen between sessions via email and text for ongoing support and guidance. One-on-one mentorship has been the gold standard for studying astrology for thousands of years — and remains the most effective path to true mastery.
              </p>

              <p className="text-sm md:text-base text-gray-700 italic mb-3">
                Includes video course above and full access to True Sky online astrology software for the full length of study. Sessions are recorded for easy playback.
              </p>

              <p className="text-sm md:text-base text-gray-700 mb-4">
                Have questions? <a href="#" className="text-indigo-600 hover:underline">Contact Athen</a>.
              </p>

              <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded transition-colors text-sm md:text-base mb-3">
                ORDER NOW
              </button>

              <p className="text-sm md:text-base text-indigo-600">
                Prefer to pay as you go? ($150 per session)
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default CoursesPage;