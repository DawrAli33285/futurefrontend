import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { BASE_URL } from './baseurl';

const CLIENT_ID = '90321078061-0170dr3h7mknf595o674b7ctu70av45u.apps.googleusercontent.com';
const REDIRECT_URI = 'https://trueskypsychology.com/software';

const HexIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="4.2 68.8 1016.3 886.6" overflow="visible" style={{ display: 'inline-block', marginRight: 4 }}>
    <g fill="none" stroke="currentColor" strokeWidth="55" strokeLinecap="round" strokeLinejoin="round">
      <path d="M28,577 A101,101 0 0,1 28,446" />
      <path d="M27,578 L76,663" />
      <path d="M28,445 L212,117" />
      <path d="M212,117 A91,91 0 0,1 307,70" />
      <path d="M308,69 L719,69" />
      <path d="M719,69 A92,92 0 0,1 810,131" />
      <path d="M811,130 L1007,461" />
      <path d="M1007,461 C1032,510 1020,535 992,583" />
      <path d="M992,583 L806,910" />
      <path d="M807,910 A86,86 0 0,1 715,954" />
      <path d="M715,955 L296,955" />
      <path d="M296,955 A90,90 0 0,1 208,892" />
      <path d="M206,893 L24,573" />
    </g>
  </svg>
);

const screenshots = [
  {
    title: "Interactive Natal Chart Wheel",
    desc: "Visualize your complete birth chart with planetary positions and house placements. Accessible anywhere, anytime, on any device.",
    img: "https://cdn.gamma.app/qa4n4ax3lz884ht/b7d35bbe6880439592c7524721896402/original/Screen-Shot-2026-02-23-at-12.43.31-PM.png",
  },
  {
    title: "Full Chart Report Generator",
    desc: "Access your complete True Sidereal chart with detailed planet, house, and aspect analysis. Free tier includes your Big 3 — premium unlocks the full report with PDF export.",
    img: "https://cdn.gamma.app/qa4n4ax3lz884ht/ac463d27d0f741f29de077c546082535/original/Screen-Shot-2026-02-23-at-11.29.46-AM.png",
  },
  {
    title: "Personalized Weekly Transit Reports",
    desc: "Detailed breakdowns of your dominant transits, aspects, and planetary influences — delivered to your inbox every week.",
    img: "https://cdn.gamma.app/qa4n4ax3lz884ht/ba512d1ef9ea429eb36dd525a3d88e83/original/Screen-Shot-2026-02-23-at-12.46.51-PM.png",
  },
];

export default function TrueSkyLanding() {
  const navigate = useNavigate();
  const location = useLocation();
  const [userInfo, setUserInfo] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const hash = location.hash;
    if (hash && hash.includes('error')) return;
    if (hash && hash.includes('access_token')) {
      const params = new URLSearchParams(hash.substring(1));
      const accessToken = params.get('access_token');
      if (accessToken) {
        fetchUserInfo(accessToken);
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }
  }, [location]);

  const fetchUserInfo = async (accessToken) => {
    try {
      const response = await fetch('https://www.googleapis.com/oauth2/v1/userinfo?alt=json', {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      if (response.ok) {
        const userData = await response.json();
        const info = {
          id: userData.id,
          name: userData.name,
          email: userData.email,
          imageUrl: userData.picture ? userData.picture.replace('=s96-c', '=s200-c') : null,
          accessToken,
        };
        const loginOrCreate = await axios.post(`${BASE_URL}/googleLogin`, info);
        if (loginOrCreate.data.newuser) localStorage.setItem('newuser', true);
        localStorage.setItem('userInfo', JSON.stringify(info));
        localStorage.setItem('token', JSON.stringify(loginOrCreate.data.token));
        setUserInfo(info);
        setTimeout(() => navigate('/admin/main'), 500);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const saved = localStorage.getItem('userInfo');
    if (saved) setUserInfo(JSON.parse(saved));
  }, []);

  const handleGoogleLogin = () => {
    try {
      const params = new URLSearchParams({
        client_id: CLIENT_ID,
        redirect_uri: REDIRECT_URI,
        response_type: 'token',
        scope: 'email profile',
        prompt: 'select_account',
      });
      window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
    } catch (err) {
      setError('Error initiating login: ' + err.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    setUserInfo(null);
    setError(null);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f5f4f0', fontFamily: "'Outfit', sans-serif", color: '#2a2742' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; }

      .ts-card {
  background: #fff;
  border-radius: 20px;
 
  width:100%;
  padding: 40px;
  box-shadow: 0 2px 24px rgba(42,39,66,0.07);
 
}
        .ts-btn-primary {
          background: #5E4CE6;
          color: #fff;
          border: none;
          border-radius: 10px;
          padding: 14px 32px;
          font-weight: 700;
          font-size: 15px;
          font-family: 'Outfit', sans-serif;
          cursor: pointer;
          transition: background 0.2s, transform 0.1s;
          display: inline-block;
          text-decoration: none;
        }
        .ts-btn-primary:hover { background: #4a3ad4; transform: translateY(-1px); }
        .ts-btn-outline {
          background: transparent;
          border: 1.5px solid #5E4CE6;
          color: #5E4CE6;
          border-radius: 10px;
          padding: 13px 32px;
          font-weight: 700;
          font-size: 15px;
          font-family: 'Outfit', sans-serif;
          cursor: pointer;
          transition: background 0.2s;
          display: inline-block;
          text-decoration: none;
        }
        .ts-btn-outline:hover { background: #ede9fd; }
        .ts-grid-cell {
          background: #f0eefb;
          border-radius: 14px;
          padding: 22px 24px;
        }
        .ts-feature-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 16px;
        }
        .ts-step-circle {
          width: 42px; height: 42px; border-radius: 50%;
          background: #5E4CE6; color: #fff;
          display: flex; align-items: center; justify-content: center;
          font-weight: 800; font-size: 16px; flex-shrink: 0;
          font-family: 'Outfit', sans-serif;
        }
        .ts-callout {
          background: #f0eefb;
          border: 1.5px solid #c7bef7;
          border-radius: 14px;
          padding: 20px 24px;
        }
        .ts-divider { border: none; border-top: 1.5px solid #e0ddf5; margin: 28px 0; }
        .ts-label-badge {
          display: inline-flex; align-items: center; gap: 6px;
          border: 1.5px solid #5E4CE6; color: #5E4CE6;
          border-radius: 999px; padding: 6px 18px;
          font-size: 13px; font-weight: 700;
          font-family: 'Outfit', sans-serif;
        }
        .ts-compare-table { width: 100%; border-collapse: collapse; }
        .ts-compare-table td, .ts-compare-table th { padding: 14px 20px; }
        .ts-compare-table tbody tr { border-bottom: 1px solid #e9e7f5; }
        .ts-compare-table tbody tr:last-child { border-bottom: none; }

        .ts-screenshot-row {
          display: flex;
          gap: 64px;
          align-items: center;
          flex-wrap: wrap;
          padding: 20px 0;
          margin-bottom: 48px;
        }
        .ts-screenshot-text { flex: 1 1 300px; }
        .ts-screenshot-img {
          flex: 1 1 400px;
          border-radius: 16px;
          overflow: hidden;
          border: 1.5px solid #e0ddf5;
          box-shadow: 0 4px 24px rgba(42,39,66,0.10);
        }
        .ts-screenshot-img img { width: 100%; height: auto; display: block; }

        .ts-weekly-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 20px;
        }
        .ts-weekly-card {
          background: #f0eefb;
          border-radius: 16px;
          padding: 28px 24px;
          text-align: center;
        }
      `}</style>

     
      <div style={{  margin: '0 auto', padding: '0 24px' }}>

       
<div style={{ paddingTop: 64, paddingBottom: 16 }}>
  <div className="ts-card" style={{ textAlign: 'center', padding: '56px 40px' }}>

  
    <div style={{ marginBottom: 16 }}>
      <span className="ts-label-badge"><HexIcon /> True Sky</span>
    </div>

  
    <div style={{ marginBottom: 20 }}>
      <span style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        fontSize: 14, fontWeight: 700,
        border: '1.5px solid #5E4CE6', color: '#5E4CE6',
        borderRadius: 10, padding: '8px 20px',
        fontFamily: "'Outfit', sans-serif",
      }}>
        ⬡ Premium Membership
      </span>
    </div>

    
    <h1 style={{
      fontSize: 'clamp(36px, 6vw, 56px)',
      fontWeight: 900,
      lineHeight: 1.06,
      letterSpacing: '-0.03em',
      marginBottom: 16,
      color: '#2a2742',
    }}>
      <strong>One Subscription.</strong><br />
      <strong>Everything Included.</strong>
    </h1>

  
    <h2 style={{ fontSize: 18, fontWeight: 700, color: '#2a2742', marginBottom: 6 }}>
      <strong>Professional Birth Chart Reports for the Metaphysical Field</strong>
    </h2>

  
    <h2 style={{ fontSize: 17, fontWeight: 500, color: '#5E4CE6', marginBottom: 28 }}>
      True Sidereal · 13 Signs · Instant Generation
    </h2>

   
    <h3 style={{ fontSize: 32, fontWeight: 800, color: '#5E4CE6', marginBottom: 6, fontFamily: "'Outfit', sans-serif" }}>
      $15 / month
    </h3>

   
    <p style={{ color: '#6b6989', marginBottom: 36, fontSize: 15 }}>
      Full access to all astrology tools, reports, and resources.
    </p>

   
    {userInfo ? (
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', alignItems: 'center' }}>
        <span style={{ fontSize: 15, color: '#2a2742', fontWeight: 600 }}>Welcome, {userInfo.name}</span>
        <button className="ts-btn-primary" onClick={() => navigate('/admin/main')}>Go to Dashboard</button>
        <button className="ts-btn-outline" onClick={handleLogout}>Log Out</button>
      </div>
    ) : (
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
        <button className="ts-btn-primary" style={{ padding: '14px 36px', fontSize: 16 }} onClick={handleGoogleLogin}>
          Subscribe for $15/month
        </button>
        <button className="ts-btn-outline" style={{ padding: '13px 36px', fontSize: 16 }} onClick={handleGoogleLogin}>
          Log In
        </button>
      </div>
    )}

    {error && <p style={{ color: '#c0392b', marginTop: 12, fontSize: 13 }}>{error}</p>}
  </div>
</div>

      
        <div className="ts-card" style={{ marginBottom: 24 }}>
          <div className="ts-card">
            <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 6 }}>For Astrologers · Psychics · Spiritual Practitioners</h2>
            <p style={{ color: '#6b6989', marginBottom: 24, fontSize: 15 }}>You need accurate, detailed charts for yourself and your clients. True Sky delivers:</p>
            <div className="ts-feature-grid">
              {[
                { t: 'True Sidereal zodiac', d: 'Accounts for precession (unlike tropical systems)' },
                { t: '13-sign system', d: 'Includes Ophiuchus' },
                { t: 'Full interpretations', d: 'Planets, houses, aspects, nodes, Chiron, Ceres' },
                { t: 'PDF export', d: 'Give clean reports to clients or keep for your records' },
              ].map(({ t, d }) => (
                <div key={t} className="ts-grid-cell">
                  <p style={{ fontWeight: 700, color: '#5E4CE6', marginBottom: 4, fontSize: 14 }}>{t}</p>
                  <p style={{ fontSize: 13, color: '#6b6989', lineHeight: 1.5 }}>{d}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

       
        <div style={{ paddingTop: 40 }}>
          {screenshots.map((item, i) => (
            <div key={i} className="ts-screenshot-row" style={{ flexDirection: i % 2 === 1 ? 'row-reverse' : 'row' }}>
              <div className="ts-screenshot-text">
                <h3 style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 12, color: '#2a2742' }}>{item.title}</h3>
                <p style={{ fontSize: 15, color: '#6b6989', lineHeight: 1.7 }}>{item.desc}</p>
              </div>
              <div className="ts-screenshot-img">
                <img src={item.img} alt={item.title} />
              </div>
            </div>
          ))}
        </div>

     
        <div style={{ paddingBottom: 32 }}>
          <div className="ts-card">
            <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 28 }}>How It Works</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[
                { title: 'Subscribe', desc: '$15/month — cancel anytime' },
                { title: 'Log in', desc: 'Access your dashboard instantly' },
                { title: 'Enter birth data', desc: 'Date, time, location' },
                { title: 'Generate full report', desc: 'True Sidereal + interpretations' },
                { title: 'Download PDF', desc: 'For you or your clients' },
              ].map(({ title, desc }, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div className="ts-step-circle">{i + 1}</div>
                  <div>
                    <p style={{ fontWeight: 700, color: '#2a2742', marginBottom: 2, fontSize: 15 }}>{title}</p>
                    <p style={{ fontSize: 13, color: '#6b6989' }}>{desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="ts-callout" style={{ marginTop: 28 }}>
              <p style={{ fontWeight: 700, color: '#2a2742', fontSize: 15 }}>No setup. No waiting. No inbox clutter. Just reports.</p>
            </div>
          </div>
        </div>

        
        <div style={{ paddingBottom: 32 }}>
          <div className="ts-card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: '32px 40px 24px' }}>
              <h2 style={{ fontSize: 22, fontWeight: 800 }}>Free vs Premium</h2>
            </div>
            <table className="ts-compare-table">
              <thead>
                <tr style={{ background: '#f8f7fe' }}>
                  <th style={{ textAlign: 'left', fontSize: 12, fontWeight: 700, color: '#6b6989', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Feature</th>
                  <th style={{ textAlign: 'center', fontSize: 12, fontWeight: 700, color: '#6b6989', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Free</th>
                  <th style={{ textAlign: 'center', fontSize: 12, fontWeight: 700, color: '#5E4CE6', textTransform: 'uppercase', letterSpacing: '0.08em', background: '#f0eefb' }}>Premium $15/mo</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { f: 'Astrology 101 basics', free: true, paid: true, h: false },
                  { f: 'True Sky Framework overview', free: true, paid: true, h: false },
                  { f: 'Planet-chakra correspondence', free: true, paid: true, h: false },
                  { f: 'Full Chart Report Generator', free: false, paid: true, h: true },
                  { f: 'Personalized Natal Weekly Reports', free: false, paid: true, h: true },
                  { f: 'Save unlimited charts', free: false, paid: true, h: true },
                  { f: 'PDF exports', free: false, paid: true, h: true },
                  { f: 'Integration Practices Library', free: false, paid: true, h: true },
                  { f: 'Transit & progression reports', free: false, paid: true, h: true },
                  { f: 'Synastry/compatibility reports', free: false, paid: true, h: true },
                ].map(({ f, free, paid, h }) => (
                  <tr key={f} style={{ background: h ? '#faf9ff' : 'transparent' }}>
                    <td style={{ fontSize: 14, color: h ? '#5E4CE6' : '#2a2742', fontWeight: h ? 600 : 400 }}>{f}</td>
                    <td style={{ textAlign: 'center', fontSize: 16 }}>{free ? '✅' : '❌'}</td>
                    <td style={{ textAlign: 'center', fontSize: 16, background: '#f0eefb' }}>{paid ? '✅' : '❌'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

       
        <div style={{ paddingBottom: 32 }}>
          <div className="ts-card">
            <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 8 }}>What's in Your Weekly Natal Report</h2>
            <p style={{ color: '#6b6989', fontSize: 15, marginBottom: 28 }}>Each week, subscribers receive a personalized email covering:</p>
            <div className="ts-weekly-grid">
              {[
                { emoji: '🪐', title: 'Your Dominant Transits', desc: 'A breakdown of the most impactful planetary transits affecting your natal chart this week' },
                { emoji: '💬', title: 'Plain-Language Interpretations', desc: 'Clear, accessible explanations of what each transit means for you personally' },
                { emoji: '🧭', title: 'True Sky Psychology Guidance', desc: 'Actionable insights rooted in the True Sky Psychology Framework to support your growth' },
              ].map((item, i) => (
                <div key={i} className="ts-weekly-card">
                  <div style={{ fontSize: 36, marginBottom: 14 }}>{item.emoji}</div>
                  <p style={{ fontWeight: 700, fontSize: 15, color: '#2a2742', marginBottom: 8 }}>{item.title}</p>
                  <p style={{ fontSize: 13, color: '#6b6989', lineHeight: 1.6 }}>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

      
        <div style={{ paddingBottom: 32 }}>
          <div className="ts-card">
            <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 6 }}>Free Learning Resources</h2>
            <p style={{ color: '#6b6989', fontSize: 14, marginBottom: 28 }}>Available to all users, no subscription required:</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 24, marginBottom: 24 }}>
              {[
                { icon: '⭐', title: 'Astrology 101', desc: 'Build a solid foundation in astrological concepts and terminology' },
                { icon: '🌀', title: 'True Sky Framework', desc: 'Explore connections between planetary influences, chakra systems, and aspect patterns' },
                { icon: '🔮', title: 'Planet-Chakra Correspondence', desc: 'A comprehensive guide mapping each planet to its corresponding chakra' },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <div style={{ fontSize: 22, flexShrink: 0 }}>{item.icon}</div>
                  <div>
                    <p style={{ fontWeight: 700, fontSize: 14, color: '#2a2742', marginBottom: 4 }}>{item.title}</p>
                    <p style={{ fontSize: 13, color: '#6b6989', lineHeight: 1.5 }}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="ts-callout">
              <p style={{ fontSize: 13, color: '#5E4CE6', fontWeight: 600 }}>📎 These resources are free for all users — no subscription required.</p>
            </div>
          </div>
        </div>

     
        <div style={{ paddingBottom: 32 }}>
          <div className="ts-card" style={{ background: '#5E4CE6', textAlign: 'center' }}>
            <h2 style={{ fontSize: 28, fontWeight: 900, color: '#fff', marginBottom: 8, letterSpacing: '-0.02em' }}>Start Your Journey</h2>
            <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 15, marginBottom: 32 }}>Full access to all tools, reports, and resources. Cancel anytime.</p>
            <button
              onClick={handleGoogleLogin}
              style={{ background: '#fff', color: '#5E4CE6', border: 'none', borderRadius: 10, padding: '14px 40px', fontWeight: 800, fontSize: 16, fontFamily: "'Outfit', sans-serif", cursor: 'pointer', transition: 'transform 0.15s' }}
              onMouseEnter={e => e.target.style.transform = 'scale(1.03)'}
              onMouseLeave={e => e.target.style.transform = 'scale(1)'}
            >
              Subscribe for $15/month
            </button>
          </div>
        </div>

       
        <div style={{ paddingBottom: 64, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20 }}>
          <div className="ts-card">
            <h3 style={{ fontSize: 17, fontWeight: 800, marginBottom: 20, color: '#2a2742' }}>Log In to Your Account</h3>
            <button className="ts-btn-primary" onClick={handleGoogleLogin}>Log in →</button>
          </div>
          <div className="ts-card">
            <h3 style={{ fontSize: 17, fontWeight: 800, marginBottom: 8, color: '#2a2742' }}>Get in Touch</h3>
            <Link to="/contact">
              <span className="ts-btn-outline" style={{ marginTop: 12, display: 'inline-block' }}>Contact us →</span>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}