import React, { useEffect } from 'react';
import './App.css';
import fst from "./images/first.png";
import scnd from "./images/second.png";
import thd from "./images/thrd.png";
import four from "./images/fourth.png";
import { Link } from 'react-router-dom';

function App() {

  useEffect(() => {
    if (window.particlesJS) {
      window.particlesJS('particles-hero', {
        particles: {
          number: { value: 40, density: { enable: true, value_area: 800 } },
          color: { value: '#ffffff' },
          shape: { type: 'circle' },
          opacity: { value: 0.4, random: false },
          size: { value: 2, random: true },
          line_linked: {
            enable: true,
            distance: 120,
            color: '#ffffff',
            opacity: 0.3,
            width: 1
          },
          move: {
            enable: true,
            speed: 1,
            direction: 'none',
            random: false,
            straight: false,
            out_mode: 'out',
            bounce: false
          }
        },
        interactivity: {
          detect_on: 'canvas',
          events: {
            onhover: { enable: false },
            onclick: { enable: false },
            resize: true
          }
        },
        retina_detect: false
      });
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/particles.js@2.0.0/particles.min.js';
    script.async = true;
    script.onload = () => {
      if (window.particlesJS) {
        window.particlesJS('particles-hero', {
          particles: {
            number: { value: 40, density: { enable: true, value_area: 800 } },
            color: { value: '#ffffff' },
            shape: { type: 'circle' },
            opacity: { value: 0.4, random: false },
            size: { value: 2, random: true },
            line_linked: {
              enable: true,
              distance: 120,
              color: '#ffffff',
              opacity: 0.3,
              width: 1
            },
            move: {
              enable: true,
              speed: 1,
              direction: 'none',
              random: false,
              straight: false,
              out_mode: 'out',
              bounce: false
            }
          },
          interactivity: {
            detect_on: 'canvas',
            events: {
              onhover: { enable: false },
              onclick: { enable: false },
              resize: true
            }
          },
          retina_detect: false
        });
      }
    };
    document.body.appendChild(script);

    return () => {
      if (window.pJSDom && window.pJSDom[0]) {
        window.pJSDom[0].pJS.fn.vendors.destroypJS();
        window.pJSDom = [];
      }
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  return (
    <div className="App">
      
      <section className="relative min-h-screen bg-black text-white overflow-hidden">
        <div id="particles-hero" className="absolute inset-0"></div>
        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
          <h1 className="text-5xl md:text-7xl font-light text-center mb-6 tracking-wide">
            TRUE SKY PSYCHOLOGY
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8">
          The Sacred Integration of True Sidereal Astrology, Alchemical Psychology, and Biofield Energetics.
          </p>
          <button
            onClick={() => {
              const section = document.getElementById("true-sidereal-section");
              if (section) {
                const top = section.offsetTop;
                window.scrollTo({ top, behavior: "smooth" });
              }
            }}
            className="border-2 border-white px-8 py-3 text-lg hover:bg-white hover:text-black transition-colors duration-300"
          >
            LEARN MORE
          </button>
        </div>
      </section>

      <section id="true-sidereal-section" className="py-[40px] px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-light text-center mb-4">
            WHAT IS TRUE SIDEREAL ASTROLOGY?
          </h2>
          <p className="text-center text-gray-600 mb-12 text-lg">
            Using the visible sky, as it really is.
          </p>
          <hr className="border-gray-300 mb-16" />

          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div className="space-y-6 text-justify text-gray-800 leading-relaxed">
              <p>
                Most astrology used online and in Western culture is based on a system called tropical astrology. What many people don't realize is that tropical astrology does not use the actual positions of the stars in the sky. Instead, it is based on the seasons.
              </p>
              <p>
                About 2,000 years ago, the zodiac signs aligned with the constellations. The Sun rose in the constellation Aries at the spring equinox. But over time, the Earth's axis slowly shifted — a movement known as precession. Because of this shift, the stars no longer line up with the seasons the way they once did.
              </p>
              <p>
                Today, during the spring equinox, the Sun is in Pisces, not Aries. This means there can now be a difference of up to one to two zodiac signs between tropical astrology and the visible sky.
              </p>
              <p>
                For example, mainstream astrology may say someone's Sun sign is Leo, while in the real sky the Sun is actually in Cancer.
              </p>
              <p>
                True sidereal astrology keeps astrology connected to the real heavens by using the actual positions of the stars and constellations. It is based on what is truly in the sky, not a fixed seasonal system.
              </p>
              <p>
                Thanks to modern technology, we can now map the visible sky into astrological charts with precision. With the internet spreading this knowledge, true sidereal astrology is gaining wider attention. Many believe it is the most accurate form of astrology because it reflects the sky as it exists today — a system humanity relied on long before the last 2,000 years.
              </p>
            </div>

            
            <div className="flex items-center justify-center">
              <div className="w-full max-w-2xl aspect-video">
                <iframe
                  className="w-full h-full rounded-lg shadow-xl"
                  src="https://www.youtube.com/embed/nAjbllpV_sw"
                  title="What is True Sidereal Astrology?"
                  frameBorder="0"
                  loading="lazy"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-20 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg shadow-lg p-8 md:p-12">
<h2 className="text-3xl font-semibold text-center text-indigo-900 mb-8">
  The Power of Planetary Transits
</h2>

<div className="space-y-6 text-gray-700 leading-relaxed">
  <p>
    Planets don't stop moving after you're born. As they continue their celestial dance through the zodiac, they form relationships (aspects) with the planets in your birth chart. These transits are the cosmic weather patterns of your life.
  </p>

  <div className="bg-white rounded-lg p-6 my-6">
    <h3 className="font-bold text-xl text-purple-900 mb-4">Major Transit Cycles:</h3>
    <div className="space-y-4">
      <div className="border-l-4 border-indigo-500 pl-4">
        <p className="font-semibold text-indigo-900">Saturn Return (ages 28-30, 58-60)</p>
        <p className="text-sm">A profound maturation period where you're asked to step into authentic adult responsibility and shed what no longer serves your soul's growth.</p>
      </div>
      <div className="border-l-4 border-purple-500 pl-4">
        <p className="font-semibold text-purple-900">Jupiter Cycle (every 12 years)</p>
        <p className="text-sm">Opportunities for expansion, growth, and good fortune. Jupiter's journey through your chart brings blessings to different life areas annually.</p>
      </div>
      <div className="border-l-4 border-pink-500 pl-4">
        <p className="font-semibold text-pink-900">Uranus Opposition (age 38-42)</p>
        <p className="text-sm">The classic "midlife awakening" where you're called to break free from limiting patterns and embrace your unique authentic self.</p>
      </div>
    </div>
  </div>

  <p>
    Understanding your transits is like having a weather forecast for your life. You wouldn't plan an outdoor wedding without checking the weather, so why navigate major life decisions without consulting your cosmic climate?
  </p>
</div>
</section>
     

      <section className="py-20 px-4 bg-gradient-to-b from-indigo-900 to-purple-900 text-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-light text-center mb-4">
            TRUE SIDEREAL SUN SIGN DATES
          </h2>
          <p className="text-center text-indigo-200 mb-12 text-lg">
            Including the 13th Sign: Ophiuchus
          </p>
          <hr className="border-indigo-700 mb-16" />

          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div className="space-y-6 text-justify leading-relaxed">
              <p className="text-lg">
                True Sidereal astrology honors the uneven astronomical sizes of constellations. Some signs span short time periods, while others are much longer. True Sidereal also includes <span className="text-indigo-300 font-semibold">Ophiuchus</span>, the 13th constellation the Sun visibly travels through.
              </p>
              
              <div className="bg-indigo-800 bg-opacity-50 p-6 rounded-lg border border-indigo-600">
                <h3 className="text-xl font-semibold mb-4 text-indigo-200">True Sidereal Sun Sign Dates:</h3>
                <div className="space-y-2 text-indigo-100">
                  <p><strong>Aries:</strong> Apr 21 — May 11</p>
                  <p><strong>Taurus:</strong> May 12 — Jun 18</p>
                  <p><strong>Gemini:</strong> Jun 19 — Jul 19</p>
                  <p><strong>Cancer:</strong> Jul 20 — Aug 6</p>
                  <p><strong>Leo:</strong> Aug 7 — Sep 15</p>
                  <p><strong>Virgo:</strong> Sep 16 — Nov 4 <span className="text-indigo-300 italic text-sm">(spans entire month of October)</span></p>
                  <p><strong>Libra:</strong> Nov 5 — Nov 23</p>
                  <p><strong>Scorpio:</strong> Nov 24 — Dec 6</p>
                  <p><strong>Ophiuchus ⛎:</strong> Dec 7 — Dec 18</p>
                  <p><strong>Sagittarius:</strong> Dec 19 — Jan 20</p>
                  <p><strong>Capricorn:</strong> Jan 21 — Feb 14</p>
                  <p><strong>Aquarius:</strong> Feb 15 — Mar 9</p>
                  <p><strong>Pisces:</strong> Mar 10 — Apr 20</p>
                </div>
              </div>

              <p className="text-indigo-200 italic">
                Discover your true sidereal chart and explore all 13 signs.
              </p>
            </div>

            <div className="relative">
              <div className="bg-indigo-800 bg-opacity-30 rounded-lg p-8 backdrop-blur-sm border border-indigo-600">
                <div className="text-center mb-6">
                  <div className="text-8xl mb-4">⛎</div>
                  <h3 className="text-2xl font-light mb-2">Ophiuchus</h3>
                  <p className="text-indigo-300">The 13th Zodiac Sign</p>
                </div>
                
                <div className="space-y-4 text-sm">
                  <p className="text-indigo-100 leading-relaxed">
                    Ophiuchus is the 13th zodiac constellation located along the ecliptic. It expresses transformation, healing, death-rebirth cycles, and deep psychological insight.
                  </p>
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">🌟</span>
                    <div>
                      <h4 className="font-semibold mb-1">Transformation</h4>
                      <p className="text-indigo-200">Deep cycles of rebirth and renewal</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">🔮</span>
                    <div>
                      <h4 className="font-semibold mb-1">Healing</h4>
                      <p className="text-indigo-200">Natural connection to healing arts</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">🐍</span>
                    <div>
                      <h4 className="font-semibold mb-1">Wisdom</h4>
                      <p className="text-indigo-200">Deep psychological understanding</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">✨</span>
                    <div>
                      <h4 className="font-semibold mb-1">Insight</h4>
                      <p className="text-indigo-200">Profound spiritual awareness</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-16 text-center">
            <Link to='/chart-calculator'>
              <button className="bg-white text-indigo-900 px-8 py-3 text-lg font-semibold rounded-lg hover:bg-indigo-100 transition-colors duration-300 shadow-lg">
                Calculate Your True Chart
              </button>
            </Link>
          </div>
        </div>
      </section>

   

      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-light text-center mb-4">
            WHY TRUE SKY PSYCHOLOGY?
          </h2>
          <p className="text-center text-gray-600 mb-12 text-lg">
            Reconnect with the cosmos as it truly exists
          </p>
          <hr className="border-gray-300 mb-16" />

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow border border-gray-200">
              <div className="text-5xl mb-4">🔭</div>
              <h3 className="text-2xl font-semibold mb-4">Astronomical Accuracy</h3>
              <p className="text-gray-700 leading-relaxed">
                True sidereal astrology aligns with actual astronomical observations. Your chart reflects the real positions of planets and constellations, not symbolic placeholders from 2000 years ago.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow border border-gray-200">
              <div className="text-5xl mb-4">💫</div>
              <h3 className="text-2xl font-semibold mb-4">Sacred Integration</h3>
              <p className="text-gray-700 leading-relaxed">
                By integrating astrology with psychology, energy work, and somatic practices, we provide a holistic framework for understanding your consciousness, nervous system, and life path.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow border border-gray-200">
              <div className="text-5xl mb-4">✨</div>
              <h3 className="text-2xl font-semibold mb-4">Deeper Transformation</h3>
              <p className="text-gray-700 leading-relaxed">
                Many report that sidereal readings combined with Sacred Psychology feel more accurate and resonate deeply with their true nature, leading to profound healing and self-understanding.
              </p>
            </div>
          </div>

          <div className="mt-16 bg-indigo-50 border-l-4 border-indigo-600 p-6 rounded-r-lg max-w-4xl mx-auto">
            <h3 className="text-xl font-semibold mb-3 text-indigo-900">
              "As Above, So Below"
            </h3>
            <p className="text-gray-700 leading-relaxed mb-3">
              This ancient principle reminds us that reality is holographic. The sky mirrors the psyche. When we understand how the sky above us shapes the energy within us, everything becomes clearer.
            </p>
            <p className="text-gray-700 leading-relaxed">
              The real sky expanded our understanding of consciousness, and our purpose is to help others experience that same alignment and clarity.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default App;