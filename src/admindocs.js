import React, { useState, useRef } from 'react';

const AdminDocs = () => {
  const [openSection, setOpenSection] = useState(null);

 
  const sectionRefs = {
    gettingStarted: useRef(null),
    step1: useRef(null),
    step2: useRef(null),
    step3: useRef(null),
    step4: useRef(null),
    step5: useRef(null),
    step6: useRef(null),
    step7: useRef(null),
    step8: useRef(null),
    step9: useRef(null),
    technical: useRef(null),
    releases: useRef(null),
    terms: useRef(null),
    credits: useRef(null),
  };

  const scrollToSection = (sectionKey) => {
    sectionRefs[sectionKey]?.current?.scrollIntoView({ 
      behavior: 'smooth', 
      block: 'start' 
    });
  };

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  const sections = [
    { 
      id: 'gettingStarted',
      title: 'Getting Started & Installation',
      content: 'This section will guide you through the initial setup and installation process of True Sky astrology software. Download the software from our official website and follow the installation wizard.'
    },
    { 
      id: 'step1',
      title: 'Step 1: MAIN: Create Your First Chart',
      content: 'Learn how to create your first natal chart. Enter your birth date, time, and location. The software will automatically calculate planetary positions and house placements using your preferred house system.'
    },
    { 
      id: 'step2',
      title: 'Step 2: TRANSIT: See Current Influences',
      content: 'The Transit feature shows current planetary positions and how they aspect your natal chart. This helps you understand current energies and influences affecting your life. You can select different dates to see past or future transits.'
    },
    { 
      id: 'step3',
      title: 'Step 3: GRAPH: Plan Ahead with Graphs',
      content: 'Visualize planetary movements over time with interactive graphs. Track aspects forming and separating, see station points, and plan ahead for important astrological events. Customize which planets and aspects to display.'
    },
    { 
      id: 'step4',
      title: 'Step 4: RETURN: Annual And Monthly Forecasting',
      content: 'Calculate solar returns, lunar returns, and other planetary returns. These charts help forecast themes and events for the coming year or month. Compare return charts with your natal chart for deeper insights.'
    },
    { 
      id: 'step5',
      title: 'Step 5: SYNASTRY: Relationship Analysis',
      content: 'Compare two charts to understand relationship dynamics. See how planets from one chart aspect planets in another chart. Useful for romantic relationships, friendships, business partnerships, and family connections.'
    },
    { 
      id: 'step6',
      title: 'Step 6: COMPOSITE: Combined Charts',
      content: 'Create composite charts that blend two natal charts into one. This shows the essence of the relationship itself as a separate entity. Midpoint composites calculate the mathematical midpoints between corresponding planets.'
    },
    { 
      id: 'step7',
      title: 'Step 7: SETTINGS: Customize Your Experience',
      content: 'Customize wheel display, select which planets and aspects to show, choose orbs, select house systems (Placidus, Koch, Equal, Whole Sign), toggle between Tropical and Sidereal zodiac, and save your preferred settings.'
    },
    { 
      id: 'step8',
      title: 'Step 8: ACCOUNT: Manage Your Profile',
      content: 'Manage your saved charts, update profile information, change password, set notification preferences, and manage subscription settings. All your charts are securely stored in your account.'
    },
    { 
      id: 'step9',
      title: 'Step 9: CHAT: Join the Community',
      content: 'Connect with other users in the community chat. Ask questions, share insights, and learn from experienced astrologers. Moderators with badges are available to help with software-related questions.'
    },
    { 
      id: 'technical',
      title: 'Technical Specifications',
      content: 'True Sky uses Swiss Ephemeris for accurate planetary calculations. Supports Tropical and Sidereal zodiac systems. Multiple house systems available including Placidus, Koch, Equal, and Whole Sign. Geocentric and heliocentric coordinates. Accuracy: ±0.001 degrees for planets.'
    },
    { 
      id: 'releases',
      title: 'Latest Releases',
      content: 'Version 2.0.1 (Current): Added asteroid support, improved graph performance, bug fixes for composite charts. Version 2.0.0: Major UI overhaul, added graph feature, enhanced settings customization. Version 1.5.2: Added mean node positions, improved transit calculations.'
    },
    { 
      id: 'terms',
      title: 'Terms of Service & Privacy Policy',
      content: 'By using True Sky, you agree to our terms of service. We respect your privacy and do not share your personal data. Birth data is encrypted and stored securely. Charts are private by default. For full terms and privacy policy, visit truesky.masteringthezodiac.com/terms'
    },
    { 
      id: 'credits',
      title: 'Credits & Acknowledgments',
      content: 'True Sky is developed by the Mastering the Zodiac team. Special thanks to Swiss Ephemeris for astronomical calculations, our beta testers, and the astrology community. Astrological symbols and glyphs are based on traditional standards.'
    },
  ];

  return (
    <div className="max-w-4xl mx-auto">
  
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">True Sky Documentation</h1>
        <p className="text-gray-600 mb-6">
          Welcome! Let's take a step-by-step tour through True Sky astrology software.
        </p>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left">
          <p className="text-gray-700">
            <span className="font-semibold">Note:</span> For technical support please use the #software channel in{' '}
            <span className="font-semibold">CHAT</span> above. Admins will have an admin badge{' '}
            <span className="inline-block w-4 h-4 text-purple-600">✓</span>. For private support, or to report bugs, email{' '}
            <a href="mailto:truesky@masteringthezodiac.com" className="text-blue-600 hover:underline">
              truesky@masteringthezodiac.com
            </a>
          </p>
        </div>
      </div>

  
      <div className="bg-gray-50 rounded-lg p-6 mb-8">
        <div className="space-y-2">
          <button
            onClick={() => scrollToSection('gettingStarted')}
            className="block text-blue-600 hover:text-blue-700 hover:underline text-left"
          >
            Getting Started & Installation
          </button>
          <button
            onClick={() => scrollToSection('step1')}
            className="block text-blue-600 hover:text-blue-700 hover:underline text-left"
          >
            Step 1: MAIN: Create Your First Chart
          </button>
          <button
            onClick={() => scrollToSection('step2')}
            className="block text-blue-600 hover:text-blue-700 hover:underline text-left"
          >
            Step 2: TRANSIT: See Current Influences
          </button>
          <button
            onClick={() => scrollToSection('step3')}
            className="block text-blue-600 hover:text-blue-700 hover:underline text-left"
          >
            Step 3: GRAPH: Plan Ahead with Graphs
          </button>
          <button
            onClick={() => scrollToSection('step4')}
            className="block text-blue-600 hover:text-blue-700 hover:underline text-left"
          >
            Step 4: RETURN: Annual And Monthly Forecasting
          </button>
          <button
            onClick={() => scrollToSection('step5')}
            className="block text-blue-600 hover:text-blue-700 hover:underline text-left"
          >
            Step 5: SYNASTRY: Relationship Analysis
          </button>
          <button
            onClick={() => scrollToSection('step6')}
            className="block text-blue-600 hover:text-blue-700 hover:underline text-left"
          >
            Step 6: COMPOSITE: Combined Charts
          </button>
          <button
            onClick={() => scrollToSection('step7')}
            className="block text-blue-600 hover:text-blue-700 hover:underline text-left"
          >
            Step 7: SETTINGS: Customize Your Experience
          </button>
          <button
            onClick={() => scrollToSection('step8')}
            className="block text-blue-600 hover:text-blue-700 hover:underline text-left"
          >
            Step 8: ACCOUNT: Manage Your Profile
          </button>
          <button
            onClick={() => scrollToSection('step9')}
            className="block text-blue-600 hover:text-blue-700 hover:underline text-left"
          >
            Step 9: CHAT: Join the Community
          </button>
          <button
            onClick={() => scrollToSection('technical')}
            className="block text-blue-600 hover:text-blue-700 hover:underline text-left"
          >
            Technical Specifications
          </button>
          <button
            onClick={() => scrollToSection('releases')}
            className="block text-blue-600 hover:text-blue-700 hover:underline text-left"
          >
            Latest Releases
          </button>
          <button
            onClick={() => scrollToSection('terms')}
            className="block text-blue-600 hover:text-blue-700 hover:underline text-left"
          >
            Terms of Service & Privacy Policy
          </button>
          <button
            onClick={() => scrollToSection('credits')}
            className="block text-blue-600 hover:text-blue-700 hover:underline text-left"
          >
            Credits & Acknowledgments
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {sections.map((section) => (
          <div
            key={section.id}
            ref={sectionRefs[section.id]}
            className="bg-white border border-gray-200 rounded-lg overflow-hidden scroll-mt-4"
          >
            <button
              onClick={() => toggleSection(section.id)}
              className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
            >
              <h3 className="text-lg font-semibold text-gray-800">{section.title}</h3>
              <svg
                className={`w-5 h-5 text-gray-600 transform transition-transform ${
                  openSection === section.id ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {openSection === section.id && (
              <div className="p-4 border-t border-gray-200 bg-gray-50">
                <p className="text-gray-700 leading-relaxed">{section.content}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDocs;