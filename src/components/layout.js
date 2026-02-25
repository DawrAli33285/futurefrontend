import React, { useState, useEffect, useRef } from 'react';
import { Link, Outlet } from 'react-router-dom';
import ScrollMiddleware from '../scrollMiddleware';

function Layout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState(null);
  const submenuRefs = useRef({});

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (openSubmenu) {
        const submenuElement = submenuRefs.current[openSubmenu];
        if (submenuElement && !submenuElement.contains(event.target)) {
          setOpenSubmenu(null);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openSubmenu]);


  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/particles.js@2.0.0/particles.min.js';
    script.async = true;
    script.onload = () => {
      if (window.particlesJS) {
        window.particlesJS('particles-js', {
          particles: {
            number: {
              value: 80,
              density: {
                enable: true,
                value_area: 800
              }
            },
            color: {
              value: '#ffffff'
            },
            shape: {
              type: 'circle'
            },
            opacity: {
              value: 0.5,
              random: false
            },
            size: {
              value: 3,
              random: true
            },
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
              onhover: {
                enable: true,
                mode: 'grab'
              },
              onclick: {
                enable: true,
                mode: 'push'
              },
              resize: true
            },
            modes: {
              grab: {
                distance: 140,
                line_linked: {
                  opacity: 1
                }
              },
              push: {
                particles_nb: 4
              }
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

  const menuItems = [
    { name: 'ABOUT', path: '/about', hasSubmenu: true },
    { name: 'CHARTS', path: '/charts', hasSubmenu: true },
    { name: 'LEARN', path: '/learn', hasSubmenu: true },
    { name: 'RESEARCH', path: '/research', hasSubmenu: false },
    { name: 'LOGIN', path: '/login', hasSubmenu: false },
    { name: 'CONTACT', path: '/contact', hasSubmenu: false },
  ];

  const submenuItems = {
    ABOUT: [
      { name: 'Sidereal Astrology', path: '/sidereal-astrology' },
      { name: 'Meet Andrea', path: '/team' },
      {name:'Sacred Psychology',path:'/sacred'}
    ],
    CHARTS: [
      { name: 'Chart Calculator', path: '/chart-calculator' },
      { name: 'Natal Weekly Report', path: '/chart-report' },
    ],
    LEARN:[

      {name:"Ophiuchus Astrology",path:'/ophiuchus-in-astrology'},
      {name:"Soul System",path:'/soul-system'},
      {name:"Sacred Psychology",path:'/sacredpsychology'},
      {name:"True Sky Framework",path:'/trueskyframework'},
      {name:"Astrology101",path:'/astrology101'}
    ],
    MORE:[
        {name:'Latest NewsLetter', path:'/newsletter'},
        {name:'Weekly Horoscope', path:'/horoscope'},
        {name:'Media Appearances', path:'/appearance'}
    ],
  };

  const handleSubmenuClick = () => {
    setOpenSubmenu(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-900">
   <ScrollMiddleware/>
  
      <header className="bg-white shadow-md relative z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center">
  <img 
    src="https://res.cloudinary.com/dbjwbveqn/image/upload/v1771845069/astrologylogo-removebg-preview_ug2cet.png" 
    alt="Logo"
    className="h-12 sm:h-14 md:h-16 object-contain"
  />
</Link>

      
            <nav className="hidden lg:flex items-center space-x-8">
              {menuItems.map((item) => (
                <div 
                  key={item.name} 
                  className="relative" 
                  ref={el => submenuRefs.current[item.name] = el}
                >
                  {item.hasSubmenu ? (
                    <button
                      onClick={() => setOpenSubmenu(openSubmenu === item.name ? null : item.name)}
                      className="text-gray-600 hover:text-gray-900 font-medium text-sm tracking-wide"
                    >
                      {item.name}
                    </button>
                  ) : (
                    <Link
                      to={item.path}
                      className="text-gray-600 hover:text-gray-900 font-medium text-sm tracking-wide"
                    >
                      {item.name}
                    </Link>
                  )}
        
                  {item.hasSubmenu && openSubmenu === item.name && (
                    <div className="absolute top-full left-0 mt-2 bg-white shadow-lg rounded-md py-2 w-48">
                      {submenuItems[item.name]?.map((subItem) => (
                        <Link 
                          key={subItem.path}
                          to={subItem.path} 
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={handleSubmenuClick}
                        >
                          {subItem.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>

            <Link
              to="/sidereal-signs"
              className="hidden lg:block bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-md text-sm font-medium transition-colors"
            >
              VIEW YOUR TRUE SIGNS
            </Link>

          
            <button
              onClick={toggleMenu}
              className="lg:hidden p-2 text-gray-600 hover:text-gray-900"
            >
              {isMenuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

   
        {isMenuOpen && (
          <div className="lg:hidden bg-white border-t">
            <nav className="container mx-auto px-4 py-4 space-y-2">
              {menuItems.map((item) => (
                <div key={item.name}>
                  {item.hasSubmenu ? (
                    <div>
                      <button
                        onClick={() => setOpenSubmenu(openSubmenu === item.name ? null : item.name)}
                        className="block w-full text-left py-2 text-gray-700 hover:text-gray-900 font-medium"
                      >
                        {item.name}
                      </button>
                      {openSubmenu === item.name && (
                        <div className="pl-4 space-y-1">
                          {submenuItems[item.name]?.map((subItem) => (
                            <Link
                              key={subItem.path}
                              to={subItem.path}
                              className="block py-2 text-gray-600 hover:text-gray-900"
                              onClick={() => {
                                setIsMenuOpen(false);
                                setOpenSubmenu(null);
                              }}
                            >
                              {subItem.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      to={item.path}
                      className="block py-2 text-gray-700 hover:text-gray-900 font-medium"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  )}
                </div>
              ))}
              <Link
                to="/true-signs"
                className="block bg-indigo-600 text-white px-6 py-2 rounded-md text-center font-medium mt-4"
                onClick={() => setIsMenuOpen(false)}
              >
                VIEW YOUR TRUE SIGNS
              </Link>
            </nav>
          </div>
        )}
      </header>

    
      <main className="flex-grow">
        <Outlet />
      </main>

     
      <footer className="bg-black text-white py-12 relative overflow-hidden">
        
        <div id="particles-js" className="absolute inset-0"></div>
        
        <div className="container mx-auto px-4 relative z-10">
         
          <div className="hidden md:flex justify-evenly items-center">
        
            <div className="flex items-center space-x-8 flex-col gap-[20px]">
            
             
             
              <div className="text-sm text-gray-400">
                © 2025 True Sky Psychology
              </div>
            </div>

          
         
          </div>

         
          <div className="md:hidden flex flex-col items-center space-y-6">
         
          
         

            <div className="text-center text-sm text-gray-400">
              © 2025 True Sky Psychology
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Layout;