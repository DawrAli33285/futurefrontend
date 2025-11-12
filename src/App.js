import React, { useEffect } from 'react';
import './App.css';
import fst from "./images/first.png";
import scnd from "./images/second.png";
import thd from "./images/thrd.png";
import four from "./images/fourth.png";
import { Link } from 'react-router-dom';
function App() {

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/particles.js@2.0.0/particles.min.js';
    script.async = true;
    script.onload = () => {
      if (window.particlesJS) {
        window.particlesJS('particles-hero', {
          particles: {
            number: { value: 80, density: { enable: true, value_area: 800 } },
            color: { value: '#ffffff' },
            shape: { type: 'circle' },
            opacity: { value: 0.5, random: false },
            size: { value: 3, random: true },
            line_linked: {
              enable: true,
              distance: 150,
              color: '#ffffff',
              opacity: 0.4,
              width: 1
            },
            move: {
              enable: true,
              speed: 2,
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
              onhover: { enable: true, mode: 'grab' },
              onclick: { enable: true, mode: 'push' },
              resize: true
            },
            modes: {
              grab: { distance: 140, line_linked: { opacity: 1 } },
              push: { particles_nb: 4 }
            }
          },
          retina_detect: true
        });
      }
    };
    document.body.appendChild(script);

    return () => {
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
            SIDEREAL ASTROLOGY
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8">
            Using the visible constellations in the sky.
          </p>
          <button
  onClick={() => {
    const section = document.getElementById("true-sidereal-section");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
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
                Almost everything online and in the West uses a system called tropical astrology. Most people aren't aware that tropical astrology does not use the visible sky. Instead, it uses the seasons.
              </p>
              <p>
                Roughly 2000 years ago the constellations in the sky matched the seasons. The Sun was in Aries (the first sign of the zodiac) during the spring equinox. But, the stars have changed position since then. Today the Sun is in Pisces, not Aries, during the spring equinox. There is now a difference of up to two zodiac signs between tropical astrology and the visible sky.
              </p>
              <p>
                For example, mainstream astrology might say someone's Sun is in Leo, while the Sun is actually in Cancer. True sidereal astrology maintains the link between ourselves and the sky, by using the stars as they truly are.
              </p>
              <p>
                Thanks to technology we can now see the visible sky in astrological chart form. With the internet, true sidereal astrology is gaining widespread adoption. Many now believe this is the most accurate form of astrology because it uses what is actually in the sky. A system we have been using far longer than the past 2000 years.
              </p>
              <p className="text-gray-600">
                Read more about <a href="#" className="text-indigo-600 hover:underline">sidereal astrology</a>.
              </p>
              <p className="text-gray-600">
                Discover your <a href="#" className="text-indigo-600 hover:underline">true sidereal signs</a>.
              </p>
            </div>
            <div className="flex items-center justify-center">
  <div className="w-full max-w-2xl aspect-video">
    <iframe
      className="w-full h-full rounded-lg shadow-xl"
     src="https://www.youtube.com/embed/nAjbllpV_sw"
      title="What is True Sidereal Astrology?"
      frameBorder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
    ></iframe>
  </div>
</div>
          </div>
        </div>
      </section>

      <section className="py-[40px] px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-[26px] md:text-[30px] font-light text-center mb-16">
            IN THE MEDIA
          </h2>
          <hr className="border-gray-300 mb-16" />

          <div className="media-logos grid grid-cols-1 md:grid-cols-4 gap-8 items-center justify-around">
            <a href="https://www.refinery29.com/en-gb/stargazing-sky-watching-astrology-tips" target="_blank" rel="nofollow" className="grayscale hover:grayscale-0 py-[10px] px-[15px] transition-all flex justify-center items-center">
              <img src={fst} alt="Refinery29 logo" className="max-w-[150px]" />
            </a>
            <a href="https://www.womenshealthmag.com/life/a45468393/sidereal-astrology/" target="_blank" rel="nofollow" className="grayscale hover:grayscale-0 py-[10px] px-[15px] transition-all flex justify-center items-center">
              <img src={scnd} alt="Women's Health logo" className="max-w-[150px]" />
            </a>
            <a href="https://thoughtcatalog.com/january-nelson/2019/01/sidereal-astrology/" target="_blank" rel="nofollow" className="grayscale hover:grayscale-0 py-[10px] px-[15px] transition-all flex justify-center items-center">
              <img src={thd} alt="Thought Catalog logo" className="max-w-[150px]" />
            </a>
            <a href="https://en.wikipedia.org/wiki/Sidereal_and_tropical_astrology" target="_blank" rel="nofollow" className="grayscale hover:grayscale-0 py-[10px] px-[15px] transition-all flex justify-center items-center">
              <img src={four} alt="Wikipedia logo" className="max-w-[150px]" />
            </a>
          </div>
        </div>
      </section>

   

<section className="py-20 px-4 bg-gradient-to-b from-indigo-900 to-purple-900 text-white">
  <div className="max-w-7xl mx-auto">
    <h2 className="text-4xl md:text-5xl font-light text-center mb-4">
      THE 13TH ZODIAC SIGN
    </h2>
    <p className="text-center text-indigo-200 mb-12 text-lg">
      Meet Ophiuchus: The Serpent Bearer
    </p>
    <hr className="border-indigo-700 mb-16" />

    <div className="grid md:grid-cols-2 gap-12 items-center">
      <div className="space-y-6 text-justify leading-relaxed">
        <p className="text-lg">
          When you look at the actual sky, the Sun passes through 13 constellations, not 12. The missing sign is <span className="text-indigo-300 font-semibold">Ophiuchus</span>, the Serpent Bearer, which sits between Scorpio and Sagittarius.
        </p>
        <p>
          Ophiuchus occupies a significant portion of the ecliptic—the Sun's path across the sky. In fact, the Sun spends more time in Ophiuchus (about 18 days) than it does in Scorpio (only 7 days).
        </p>
        <p>
          Traditional tropical astrology ignores Ophiuchus because it was formalized over 2000 years ago when only 12 signs were recognized. But true sidereal astrology, which follows the actual positions of constellations, includes this forgotten sign.
        </p>
        <div className="bg-indigo-800 bg-opacity-50 p-6 rounded-lg border border-indigo-600">
          <h3 className="text-xl font-semibold mb-3 text-indigo-200">Ophiuchus Traits</h3>
          <ul className="space-y-2 text-indigo-100">
            <li>• <strong>Dates:</strong> November 29 - December 17</li>
            <li>• <strong>Element:</strong> Ethereal (transcendent)</li>
            <li>• <strong>Symbol:</strong> ⛎ The Serpent Bearer</li>
            <li>• <strong>Qualities:</strong> Healing, wisdom, transformation, knowledge-seeking</li>
          </ul>
        </div>
        <p className="text-indigo-200 italic">
          Could you be an Ophiuchus? Discover your true sidereal chart and explore all 13 signs.
        </p>
      </div>

      <div className="relative">
        <div className="bg-indigo-800 bg-opacity-30 rounded-lg p-8 backdrop-blur-sm border border-indigo-600">
          <div className="text-center mb-6">
            <div className="text-8xl mb-4">⛎</div>
            <h3 className="text-2xl font-light mb-2">Ophiuchus</h3>
            <p className="text-indigo-300">The Healer & Wisdom Keeper</p>
          </div>
          
          <div className="space-y-4 text-sm">
            <div className="flex items-start gap-3">
              <span className="text-2xl">🌟</span>
              <div>
                <h4 className="font-semibold mb-1">Natural Healers</h4>
                <p className="text-indigo-200">Drawn to medicine, therapy, and helping professions</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">🔮</span>
              <div>
                <h4 className="font-semibold mb-1">Truth Seekers</h4>
                <p className="text-indigo-200">Passionate about uncovering hidden knowledge</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">🐍</span>
              <div>
                <h4 className="font-semibold mb-1">Transformative</h4>
                <p className="text-indigo-200">Like the serpent, they shed old patterns and renew</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">✨</span>
              <div>
                <h4 className="font-semibold mb-1">Charismatic</h4>
                <p className="text-indigo-200">Natural magnetism and ability to inspire others</p>
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


<section className="py-20 px-4 bg-gray-50">
  <div className="max-w-7xl mx-auto">
    <h2 className="text-4xl md:text-5xl font-light text-center mb-4">
      WHY TRUE SIDEREAL ASTROLOGY?
    </h2>
    <p className="text-center text-gray-600 mb-12 text-lg">
      Reconnect with the cosmos as it truly exists
    </p>
    <hr className="border-gray-300 mb-16" />

    <div className="grid md:grid-cols-3 gap-8">
      <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
        <div className="text-5xl mb-4">🔭</div>
        <h3 className="text-2xl font-semibold mb-4">Astronomical Accuracy</h3>
        <p className="text-gray-700 leading-relaxed">
          True sidereal astrology aligns with actual astronomical observations. Your chart reflects the real positions of planets and constellations, not symbolic placeholders from 2000 years ago.
        </p>
      </div>

      <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
        <div className="text-5xl mb-4">🌍</div>
        <h3 className="text-2xl font-semibold mb-4">Ancient Wisdom</h3>
        <p className="text-gray-700 leading-relaxed">
          Used for thousands of years by Vedic astrologers and ancient civilizations worldwide. This system predates tropical astrology and maintains humanity's original connection to the stars.
        </p>
      </div>

      <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
        <div className="text-5xl mb-4">✨</div>
        <h3 className="text-2xl font-semibold mb-4">Deeper Insights</h3>
        <p className="text-gray-700 leading-relaxed">
          Many report that sidereal readings feel more accurate and resonate deeply with their true nature. Including all 13 signs provides a more complete cosmic picture.
        </p>
      </div>
    </div>

    <div className="mt-16 bg-indigo-50 border-l-4 border-indigo-600 p-6 rounded-r-lg">
      <h3 className="text-xl font-semibold mb-3 text-indigo-900">
        The Precession of the Equinoxes
      </h3>
      <p className="text-gray-700 leading-relaxed mb-3">
        Earth wobbles on its axis like a spinning top, completing one full cycle every 26,000 years. This phenomenon, called <strong>precession</strong>, means the backdrop of stars slowly shifts relative to Earth's seasons.
      </p>
      <p className="text-gray-700 leading-relaxed">
        Since tropical astrology was created around 2,000 years ago, the constellations have shifted by about 24 degrees—nearly one full zodiac sign. True sidereal astrology accounts for this shift, keeping your chart aligned with the current night sky.
      </p>
    </div>
  </div>
</section>
    
    </div>
  );
}

export default App;