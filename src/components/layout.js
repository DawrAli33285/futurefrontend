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
    { name: 'READINGS', path: '/readings', hasSubmenu: false },
    { name: 'SOFTWARE', path: '/software', hasSubmenu: false },
    { name: 'MORE', path: '/more', hasSubmenu: true },
    { name: 'CONTACT', path: '/contact', hasSubmenu: false },
  ];

  const submenuItems = {
    ABOUT: [
      { name: 'Sidereal Astrology', path: '/sidereal-astrology' },
      { name: 'FAQ', path: '/faq' },
      { name: 'The Team', path: '/team' },
      {name:'Sacred Psychology',path:'/sacred'}
    ],
    CHARTS: [
      { name: 'Chart Calculator', path: '/chart-calculator' },
      { name: 'Chart Report', path: '/chart-report' },
    ],
    LEARN:[
      { name: 'Chart Dictionary', path: '/chart-dictionary' },
      { name: 'Sidereal Courses', path: '/chart-course' },
      {name:"Ophiuchus Astrology",path:'/ophiuchus-in-astrology'}
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
    src="./logo.png" 
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
              <div className="flex space-x-4">
                <button className="bg-red-600 p-2 rounded hover:bg-red-700 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </button>
                <button className="bg-blue-600 p-2 rounded hover:bg-blue-700 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </button>
                <button className="bg-pink-600 p-2 rounded hover:bg-pink-700 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/>
                  </svg>
                </button>
              </div>
              
              <Link to="/terms" className="hover:text-gray-300 transition-colors text-sm">
                TERMS AND PRIVACY
              </Link>
              
              <div className="text-sm text-gray-400">
                © 2025 Truesky Psychology
              </div>
            </div>

          
            <div className="flex flex-col items-end space-y-3 text-sm">
              <Link to="/free-report" className="hover:text-gray-300 transition-colors">
                GET FREE REPORT
              </Link>
              <Link to="/newsletter" className="hover:text-gray-300 transition-colors">
                JOIN NEWSLETTER
              </Link>
              <Link to="/partner" className="hover:text-gray-300 transition-colors">
                PARTNER WITH US
              </Link>
            </div>
          </div>

         
          <div className="md:hidden flex flex-col items-center space-y-6">
         
            <div className="flex space-x-4">
              <button className="bg-red-600 p-2 rounded hover:bg-red-700 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </button>
              <button className="bg-blue-600 p-2 rounded hover:bg-blue-700 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </button>
              <button className="bg-pink-600 p-2 rounded hover:bg-pink-700 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/>
                </svg>
              </button>
            </div>

            <div className="flex flex-col items-center space-y-3 text-sm">
              <Link to="/terms" className="hover:text-gray-300 transition-colors">
                TERMS AND PRIVACY
              </Link>
              <Link to="/free-report" className="hover:text-gray-300 transition-colors">
                GET FREE REPORT
              </Link>
              <Link to="/newsletter" className="hover:text-gray-300 transition-colors">
                JOIN NEWSLETTER
              </Link>
              <Link to="/partner" className="hover:text-gray-300 transition-colors">
                PARTNER WITH US
              </Link>
            </div>

            <div className="text-center text-sm text-gray-400">
              © 2025 Truesky Psychology
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Layout;