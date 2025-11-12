import React from 'react';
import fst from "./images/first.png";
import scnd from "./images/second.png";
import thd from "./images/thrd.png";
import four from "./images/fourth.png";
const MediaAppearancesPage = () => {

  
  const strangePlanetImg = "/api/placeholder/300/400";
  const earthAncientsImg = "/api/placeholder/300/200";
  const skepticImg = "/api/placeholder/300/400";
  const crrowImg = "/api/placeholder/300/400";

  return (
    <div className="min-h-screen bg-white">
   
      <div className="py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-normal text-center mb-8">
            RECENT MEDIA APPEARANCES
          </h1>
          <hr className="border-gray-300 mb-8" />
          
          <p className="text-center text-base md:text-lg italic mb-12">
            "Mainstream astrology does not use the visible sky, and more people need to know this." - Athen Chimenti
          </p>
        </div>
      </div>

   
      <section className="py-10 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-items-center mb-16">
            <a 
              href="https://www.refinery29.com/en-gb/stargazing-sky-watching-astrology-tips" 
              target="_blank" 
              rel="nofollow" 
              className="grayscale hover:grayscale-0 transition-all"
            >
              <img src={fst} alt="Refinery29" className="max-w-[150px]" />
            </a>
            <a 
              href="https://www.womenshealthmag.com/life/a45468393/sidereal-astrology/" 
              target="_blank" 
              rel="nofollow" 
              className="grayscale hover:grayscale-0 transition-all"
            >
              <img src={scnd} alt="Women's Health" className="max-w-[150px]" />
            </a>
            <a 
              href="https://thoughtcatalog.com/january-nelson/2019/01/sidereal-astrology/" 
              target="_blank" 
              rel="nofollow" 
              className="grayscale hover:grayscale-0 transition-all"
            >
              <img src={thd} alt="Thought Catalog" className="max-w-[150px]" />
            </a>
            <a 
              href="https://en.wikipedia.org/wiki/Sidereal_and_tropical_astrology" 
              target="_blank" 
              rel="nofollow" 
              className="grayscale hover:grayscale-0 transition-all"
            >
              <img src={four} alt="Wikipedia" className="max-w-[150px]" />
            </a>
          </div>
        </div>
      </section>

    
      <div className="max-w-5xl mx-auto px-4 py-8">
        
   
        <div className="mb-16">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="md:w-1/3">
              <img 
                src="./strange-planet.png"
                alt="Strange Planet Podcast" 
                className="w-full"
              />
            </div>
            <div className="md:w-2/3">
              <h2 className="text-xl md:text-2xl font-bold mb-4">
                STRANGE PLANET - SIDEREAL ASTROLOGY
              </h2>
              <p className="text-sm md:text-base leading-relaxed mb-4 text-justify">
                Richard speaks with an expert in Sidereal Astrology who reveals the hidden flaw in mainstream astrology and the significance of using the visible sky in astrology. He also explains the limitations of mainstream astrology and its impact on individuals and society as a whole, as well as how to find your true signs and apply it to your daily life.
              </p>
            
            </div>
          </div>
        </div>

    
        <div className="mb-16">
          <div className="flex flex-col md:flex-row-reverse gap-6 items-start">
            <div className="md:w-1/3">
              <img 
                src="./earth-ancients.png" 
                alt="Earth Ancients" 
                className="w-full"
              />
            </div>
            <div className="md:w-2/3">
              <h2 className="text-xl md:text-2xl font-bold mb-4">
                EARTH ANCIENTS - ASTROLOGICAL PREDICTIONS FOR 2024 AND BEYOND
              </h2>
              <p className="text-sm md:text-base leading-relaxed mb-4 text-justify">
                Athen Chimenti is an astrologer, educator, and leading expert in the field of true sidereal astrology. He is passionate about helping others gain clarity and direction in their lives using this nature-based form of astrology. After over a decade of working with true sidereal, he now teaches astrology to audiences around the world alongside his online contributions.
              </p>
            
            </div>
          </div>
        </div>

       
        <div className="mb-16">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="md:w-1/3">
              <img 
                src="./skeptic.png"
                alt="Skeptic Metaphysicians" 
                className="w-full"
              />
            </div>
            <div className="md:w-2/3">
              <h2 className="text-xl md:text-2xl font-bold mb-4">
                SKEPTIC METAPHYSICIANS - DISCOVERING YOUR TRUE ASTROLOGICAL IDENTITY
              </h2>
              <p className="text-sm md:text-base leading-relaxed mb-4 text-justify">
                Prepare to have your beliefs about astrology challenged in the most unexpected way! Witness the misalignment so profound that it has shattered the very essence of what we thought we knew about who we are. It turns out we may be unknowingly following the wrong path by solely relying on tropical astrology, which aligns with the seasons, rather than the actual position of the stars.
              </p>
           
            </div>
          </div>
        </div>

    
        <div className="mb-16">
          <div className="flex flex-col md:flex-row-reverse gap-6 items-start">
            <div className="md:w-1/3">
              <img 
                src="./crrow777.png"
                alt="CRROW777 Radio" 
                className="w-full"
              />
            </div>
            <div className="md:w-2/3">
              <h2 className="text-xl md:text-2xl font-bold mb-4">
                CRROW777 RADIO - CONSIDERING STARS, LUMINARIES & ENERGIES IN REAL-TIME
              </h2>
              <p className="text-sm md:text-base leading-relaxed mb-4 text-justify">
                It was not that long ago that the words astronomy and astrology meant the same thing. Interest in the energies from above have been a specialized branch of spiritual science in every major civilization we are aware of, to include the now lost practice of orienting buildings and temples to equinoxes, solstices and other astronomical energies. This was done for a reason, and that reason is now back on the table of rediscovery as we shift into a new era.
              </p>
            
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default MediaAppearancesPage;