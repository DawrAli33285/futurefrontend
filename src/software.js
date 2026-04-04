import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { BASE_URL } from './baseurl';

const CLIENT_ID = '90321078061-0170dr3h7mknf595o674b7ctu70av45u.apps.googleusercontent.com';
const REDIRECT_URI = 'https://trueskypsychology.com/software';
// const REDIRECT_URI = 'http://localhost:3000/software';


const StarField = () => (
  <div style={{ position: "fixed", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 0 }}>
    {[...Array(60)].map((_, i) => (
      <div key={i} style={{
        position: "absolute", width: i % 5 === 0 ? "2px" : "1px", height: i % 5 === 0 ? "2px" : "1px",
        background: "white", borderRadius: "50%",
        top: `${(i * 137.5) % 100}%`, left: `${(i * 97.3) % 100}%`,
        opacity: (i % 7) * 0.1 + 0.2,
        animation: `twinkle ${2 + (i % 4)}s ease-in-out infinite`,
        animationDelay: `${(i % 5) * 0.6}s`,
      }} />
    ))}
  </div>
);

const Btn = ({ children, onClick, variant = "primary", style = {} }) => {
  const [hov, setHov] = useState(false);
  const base = {
    border: "none", cursor: "pointer", fontFamily: "'Outfit', sans-serif",
    fontWeight: 700, fontSize: "15px", borderRadius: "12px",
    padding: "14px 32px", transition: "all 0.2s ease", display: "inline-block",
  };
  const variants = {
    primary: {
      background: hov ? "linear-gradient(135deg,#6a59ff,#8b7fff)" : "linear-gradient(135deg,#5E4CE6,#7B6FF0)",
      color: "#fff", boxShadow: hov ? "0 12px 30px rgba(94,76,230,0.4)" : "none",
      transform: hov ? "translateY(-2px)" : "none",
    },
    secondary: {
      background: hov ? "rgba(94,76,230,0.15)" : "transparent", color: "#fff",
      border: `1px solid ${hov ? "rgba(94,76,230,0.8)" : "rgba(255,255,255,0.25)"}`,
    },
    white: {
      background: hov ? "#f0edff" : "#fff", color: "#5E4CE6",
      transform: hov ? "scale(1.03)" : "scale(1)",
      boxShadow: hov ? "0 20px 40px rgba(0,0,0,0.3)" : "none",
    },
  };
  return (
    <button onClick={onClick} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ ...base, ...variants[variant], ...style }}>
      {children}
    </button>
  );
};

const FeatureCard = ({ icon, title, description }) => {
  const [hov, setHov] = useState(false);
  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} style={{
      background: hov ? "linear-gradient(135deg,rgba(94,76,230,0.3),rgba(94,76,230,0.1))" : "rgba(255,255,255,0.04)",
      border: `1px solid ${hov ? "rgba(94,76,230,0.6)" : "rgba(255,255,255,0.08)"}`,
      borderRadius: "16px", padding: "28px 24px", transition: "all 0.3s ease",
      transform: hov ? "translateY(-4px)" : "none",
      boxShadow: hov ? "0 20px 40px rgba(94,76,230,0.2)" : "none",
    }}>
      <div style={{ fontSize: "32px", marginBottom: "14px" }}>{icon}</div>
      <div style={{ fontSize: "15px", fontWeight: 700, color: "#fff", marginBottom: "8px", fontFamily: "'Outfit',sans-serif" }}>{title}</div>
      <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.55)", lineHeight: 1.6 }}>{description}</div>
    </div>
  );
};

const StepRow = ({ number, title, description }) => {
  const [hov, setHov] = useState(false);
  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ display: "flex", gap: "16px", alignItems: "flex-start", padding: "20px", borderRadius: "12px", background: hov ? "rgba(94,76,230,0.12)" : "transparent", transition: "all 0.2s" }}>
      <div style={{ width: "36px", height: "36px", borderRadius: "50%", flexShrink: 0, background: "linear-gradient(135deg,#5E4CE6,#9B8FFF)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", fontWeight: 800, color: "#fff", fontFamily: "'Outfit',sans-serif" }}>{number}</div>
      <div>
        <div style={{ fontSize: "14px", fontWeight: 700, color: "#fff", marginBottom: "4px", fontFamily: "'Outfit',sans-serif" }}>{title}</div>
        <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)", lineHeight: 1.5 }}>{description}</div>
      </div>
    </div>
  );
};

const TableRow = ({ feature, free, paid, highlight }) => (
  <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", background: highlight ? "rgba(94,76,230,0.06)" : "transparent" }}>
    <td style={{ padding: "14px 20px", fontSize: "13px", color: highlight ? "#c4beff" : "rgba(255,255,255,0.7)", fontWeight: highlight ? 600 : 400 }}>{feature}</td>
    <td style={{ padding: "14px 20px", textAlign: "center", fontSize: "18px" }}>{free ? "✅" : "❌"}</td>
    <td style={{ padding: "14px 20px", textAlign: "center", fontSize: "18px", background: "rgba(94,76,230,0.1)" }}>{paid ? "✅" : "❌"}</td>
  </tr>
);

export default function TrueSkyLanding() {
  const navigate = useNavigate();
  const location = useLocation();
  const [userInfo, setUserInfo] = useState(null);
  const [error, setError] = useState(null);


  useEffect(() => {
    const handleOAuthRedirect = () => {
      const hash = location.hash;
    
      if (hash && hash.includes('error')) {
        const params = new URLSearchParams(hash.substring(1));
        const error = params.get('error');
        const errorDescription = params.get('error_description');
       
        console.error('OAuth error:', error, errorDescription);
        return;
      }

   
      if (hash && hash.includes('access_token')) {
        const params = new URLSearchParams(hash.substring(1));
        const accessToken = params.get('access_token');
        
        if (accessToken) {
          fetchUserInfo(accessToken);
          window.history.replaceState({}, document.title, window.location.pathname);
        }
      }
    };

    handleOAuthRedirect();
  }, [location]);

  const fetchUserInfo = async (accessToken) => {
    try {
      const response = await fetch('https://www.googleapis.com/oauth2/v1/userinfo?alt=json', {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      
      if (response.ok) {
        const userData = await response.json();
        
        const userInfo = {
          id: userData.id,
          name: userData.name,
          email: userData.email,
         
          imageUrl: userData.picture ? userData.picture.replace('=s96-c', '=s200-c') : null,
          accessToken: accessToken
        };
        
        
        let loginOrCreate=await axios.post(`${BASE_URL}/googleLogin`,userInfo)
   
       
       if(loginOrCreate.data.newuser){
        localStorage.setItem('newuser',true)
       }
        localStorage.setItem('userInfo', JSON.stringify(userInfo));
        localStorage.setItem('token',JSON.stringify(loginOrCreate.data.token))
        setUserInfo(userInfo);
        
 
        setTimeout(() => {
          navigate('/admin/main');
        }, 500);
      } else {
        const errorData = await response.json();
       
      
      }
    } catch (error) {
    
     
    }
  };


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


  const handleGoogleLogin = () => {
    try {
      const params = new URLSearchParams({
        client_id: CLIENT_ID,
        redirect_uri: REDIRECT_URI, 
        response_type: 'token',
        scope: 'email profile',
        prompt: 'select_account'
      });
    
      const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
     
      window.location.href = authUrl;
    } catch (error) {
      setError('Error initiating login: ' + error.message);
      console.error('Login error:', error);
    }
  };

 
  useEffect(() => {
    const savedUserInfo = localStorage.getItem('userInfo');
  
    if (savedUserInfo) {
      setUserInfo(JSON.parse(savedUserInfo));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    setUserInfo(null);
    setError(null);
  };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(160deg,#0a0818 0%,#0f0d2a 40%,#0d0b1e 100%)", color: "#fff", fontFamily: "'Arimo',sans-serif", position: "relative", overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;800;900&family=Arimo:wght@400;500;600;700&display=swap');
        @keyframes twinkle { 0%,100%{opacity:0.2} 50%{opacity:1} }
        *{box-sizing:border-box;margin:0;padding:0;}
      `}</style>

      <StarField />
      <div style={{ position: "fixed", top: "-200px", right: "-200px", width: "600px", height: "600px", borderRadius: "50%", background: "radial-gradient(circle,rgba(94,76,230,0.15) 0%,transparent 70%)", pointerEvents: "none", zIndex: 0 }} />
      <div style={{ position: "fixed", bottom: "-100px", left: "-100px", width: "400px", height: "400px", borderRadius: "50%", background: "radial-gradient(circle,rgba(155,143,255,0.1) 0%,transparent 70%)", pointerEvents: "none", zIndex: 0 }} />

      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "0 24px", position: "relative", zIndex: 1 }}>

       
        <section style={{ textAlign: "center", padding: "100px 0 80px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(94,76,230,0.15)", border: "1px solid rgba(94,76,230,0.3)", borderRadius: "100px", padding: "6px 16px 6px 10px", fontSize: "12px", fontWeight: 600, color: "#9B8FFF", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "32px" }}>
            ⬡ Premium Membership
          </div>
          <h1 style={{ fontSize: "clamp(42px,7vw,72px)", fontWeight: 900, lineHeight: 1.05, fontFamily: "'Outfit',sans-serif", letterSpacing: "-0.04em", marginBottom: "20px", background: "linear-gradient(135deg,#fff 30%,#9B8FFF 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            One Subscription.<br />Everything Included.
          </h1>
          <p style={{ fontSize: "18px", color: "rgba(255,255,255,0.55)", maxWidth: "480px", margin: "0 auto 12px", lineHeight: 1.6 }}>
            Full access to all astrology tools, reports, and resources.
          </p>
          <p style={{ fontSize: "22px", fontWeight: 700, color: "#9B8FFF", marginBottom: "40px", fontFamily: "'Outfit',sans-serif" }}>$15 / month</p>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
            <Btn onClick={handleGoogleLogin} variant="primary" style={{ padding: "16px 40px", fontSize: "16px" }}>Subscribe for $15/month</Btn>
            <Btn onClick={handleGoogleLogin} variant="secondary" style={{ padding: "16px 32px", fontSize: "16px" }}>Log In</Btn>
          </div>
        </section>

     
        <section style={{ padding: "60px 0" }}>
          <p style={{ textAlign: "center", fontSize: "13px", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#5E4CE6", marginBottom: "16px" }}>WHAT YOU GET</p>
          <h2 style={{ textAlign: "center", fontSize: "clamp(28px,4vw,40px)", fontWeight: 800, fontFamily: "'Outfit',sans-serif", letterSpacing: "-0.03em", marginBottom: "48px", color: "#fff" }}>Get full access with Premium</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: "16px" }}>
            <FeatureCard icon="📊" title="Chart Report Generator" description="Unlimited birth charts, synastry, transits, PDF exports, save unlimited charts" />
            <FeatureCard icon="📬" title="Natal Weekly Reports" description="Personalized emails based on YOUR birthday, delivered every week" />
            <FeatureCard icon="📚" title="True Sky Framework" description="Planet-chakra correspondence, aspect guides, how to read your transits" />
            <FeatureCard icon="🌐" title="Astrology 101" description="Foundations for beginners — build your base from the ground up" />
            <FeatureCard icon="🔗" title="Integration Library" description="Past embodiment practices for deeper self-knowledge" />
            <FeatureCard icon="💾" title="Save Unlimited Charts" description="Access your saved charts anywhere, on any device, anytime" />
          </div>
        </section>

      
        {screenshots.map((item, i) => (
          <div key={i} style={{ display: "flex", gap: "48px", alignItems: "center", flexDirection: i % 2 === 1 ? "row-reverse" : "row", marginBottom: "80px", flexWrap: "wrap", padding: "20px 0" }}>
            <div style={{ flex: "1 1 280px" }}>
              <h3 style={{ fontSize: "clamp(22px,3vw,30px)", fontWeight: 800, fontFamily: "'Outfit',sans-serif", letterSpacing: "-0.03em", marginBottom: "16px", color: "#fff" }}>{item.title}</h3>
              <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.55)", lineHeight: 1.7 }}>{item.desc}</p>
            </div>
            <div style={{ flex: "1 1 300px", borderRadius: "16px", overflow: "hidden", border: "1px solid rgba(94,76,230,0.3)", boxShadow: "0 20px 60px rgba(0,0,0,0.4)" }}>
              <img src={item.img} alt={item.title} style={{ width: "100%", height: "auto", display: "block" }} />
            </div>
          </div>
        ))}

      
        <section style={{ padding: "60px 0" }}>
          <p style={{ textAlign: "center", fontSize: "13px", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#5E4CE6", marginBottom: "16px" }}>PROCESS</p>
          <h2 style={{ textAlign: "center", fontSize: "clamp(28px,4vw,40px)", fontWeight: 800, fontFamily: "'Outfit',sans-serif", letterSpacing: "-0.03em", marginBottom: "48px", color: "#fff" }}>How It Works</h2>
          <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "20px", overflow: "hidden" }}>
            {[
              { title: "Subscribe", desc: "Start your premium membership for $15/month" },
              { title: "Enter your birthday", desc: "We generate your natal chart instantly" },
              { title: "Receive Weekly Reports", desc: "Personalized natal reports delivered to your inbox each week" },
              { title: "Explore Your Charts", desc: "Use the Chart Report Generator to dive deeper anytime" },
              { title: "Access the Full Library", desc: "Explore all True Sky Framework resources at your own pace" },
            ].map((step, i, arr) => (
              <div key={i}>
                <StepRow number={i + 1} title={step.title} description={step.desc} />
                {i < arr.length - 1 && <div style={{ height: "1px", background: "rgba(255,255,255,0.06)", margin: "0 20px" }} />}
              </div>
            ))}
          </div>
        </section>

       
        <section style={{ padding: "60px 0" }}>
          <p style={{ textAlign: "center", fontSize: "13px", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#5E4CE6", marginBottom: "16px" }}>PLANS</p>
          <h2 style={{ textAlign: "center", fontSize: "clamp(28px,4vw,40px)", fontWeight: 800, fontFamily: "'Outfit',sans-serif", letterSpacing: "-0.03em", marginBottom: "48px", color: "#fff" }}>Free vs Premium</h2>
          <div style={{ borderRadius: "20px", overflow: "hidden", border: "1px solid rgba(255,255,255,0.08)" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "rgba(255,255,255,0.04)" }}>
                  <th style={{ padding: "16px 20px", textAlign: "left", fontSize: "13px", fontWeight: 700, color: "rgba(255,255,255,0.5)", fontFamily: "'Outfit',sans-serif", textTransform: "uppercase", letterSpacing: "0.05em" }}>Feature</th>
                  <th style={{ padding: "16px 20px", textAlign: "center", fontSize: "13px", fontWeight: 700, color: "rgba(255,255,255,0.5)", fontFamily: "'Outfit',sans-serif", textTransform: "uppercase", letterSpacing: "0.05em" }}>Free</th>
                  <th style={{ padding: "16px 20px", textAlign: "center", fontSize: "13px", fontWeight: 700, color: "#9B8FFF", fontFamily: "'Outfit',sans-serif", textTransform: "uppercase", letterSpacing: "0.05em", background: "rgba(94,76,230,0.1)" }}>Premium $15/mo</th>
                </tr>
              </thead>
              <tbody>
                <TableRow feature="Astrology 101 basics" free paid />
                <TableRow feature="True Sky Framework overview" free paid />
                <TableRow feature="Planet-chakra correspondence" free paid />
                <TableRow feature="Full Chart Report Generator" free={false} paid highlight />
                <TableRow feature="Personalized Natal Weekly Reports" free={false} paid highlight />
                <TableRow feature="Save unlimited charts" free={false} paid highlight />
                <TableRow feature="PDF exports" free={false} paid highlight />
                <TableRow feature="Integration Practices Library" free={false} paid highlight />
                <TableRow feature="Transit & progression reports" free={false} paid highlight />
                <TableRow feature="Synastry/compatibility reports" free={false} paid highlight />
              </tbody>
            </table>
          </div>
        </section>

     
        <section style={{ padding: "60px 0" }}>
          <p style={{ textAlign: "center", fontSize: "13px", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#5E4CE6", marginBottom: "16px" }}>WEEKLY REPORTS</p>
          <h2 style={{ textAlign: "center", fontSize: "clamp(28px,4vw,40px)", fontWeight: 800, fontFamily: "'Outfit',sans-serif", letterSpacing: "-0.03em", marginBottom: "16px", color: "#fff" }}>What's in Your Weekly Natal Report</h2>
          <p style={{ textAlign: "center", color: "rgba(255,255,255,0.55)", marginBottom: "40px", fontSize: "15px" }}>Each week, subscribers receive a personalized email covering:</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: "20px" }}>
            {[
              { emoji: "🪐", title: "Your Dominant Transits", desc: "A breakdown of the most impactful planetary transits affecting your natal chart this week" },
              { emoji: "💬", title: "Plain-Language Interpretations", desc: "Clear, accessible explanations of what each transit means for you personally" },
              { emoji: "🧭", title: "True Sky Psychology Guidance", desc: "Actionable insights rooted in the True Sky Psychology Framework to support your growth" },
            ].map((item, i) => (
              <div key={i} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px", padding: "28px 24px", textAlign: "center" }}>
                <div style={{ fontSize: "40px", marginBottom: "16px" }}>{item.emoji}</div>
                <div style={{ fontSize: "15px", fontWeight: 700, color: "#fff", marginBottom: "10px", fontFamily: "'Outfit',sans-serif" }}>{item.title}</div>
                <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)", lineHeight: 1.6 }}>{item.desc}</div>
              </div>
            ))}
          </div>
        </section>

        
        <section style={{ padding: "60px 0" }}>
          <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "20px", padding: "40px" }}>
            <h2 style={{ fontSize: "clamp(24px,3vw,32px)", fontWeight: 800, fontFamily: "'Outfit',sans-serif", letterSpacing: "-0.03em", marginBottom: "8px", color: "#fff" }}>Free Learning Resources</h2>
            <p style={{ color: "rgba(255,255,255,0.5)", marginBottom: "32px", fontSize: "14px" }}>Available to all users, no subscription required:</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: "24px", marginBottom: "28px" }}>
              {[
                { icon: "⭐", title: "Astrology 101", desc: "Build a solid foundation in astrological concepts and terminology" },
                { icon: "🌀", title: "True Sky Framework", desc: "Explore connections between planetary influences, chakra systems, and aspect patterns" },
                { icon: "🔮", title: "Planet-Chakra Correspondence", desc: "A comprehensive guide mapping each planet to its corresponding chakra" },
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                  <div style={{ fontSize: "24px", flexShrink: 0 }}>{item.icon}</div>
                  <div>
                    <div style={{ fontSize: "14px", fontWeight: 700, color: "#fff", marginBottom: "4px", fontFamily: "'Outfit',sans-serif" }}>{item.title}</div>
                    <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.45)", lineHeight: 1.5 }}>{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ background: "rgba(94,76,230,0.12)", border: "1px solid rgba(94,76,230,0.25)", borderRadius: "10px", padding: "14px 18px", fontSize: "13px", color: "#c4beff", fontStyle: "italic" }}>
              📎 These resources are free for all users — no subscription required.
            </div>
          </div>
        </section>

       
        <section style={{ margin: "20px 0 60px", background: "linear-gradient(135deg,rgba(94,76,230,0.3),rgba(94,76,230,0.1))", border: "1px solid rgba(94,76,230,0.4)", borderRadius: "24px", padding: "60px 40px", textAlign: "center", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at center,rgba(94,76,230,0.2) 0%,transparent 70%)", pointerEvents: "none" }} />
          <h2 style={{ fontSize: "clamp(28px,4vw,44px)", fontWeight: 900, fontFamily: "'Outfit',sans-serif", letterSpacing: "-0.03em", color: "#fff", marginBottom: "12px", position: "relative" }}>Start Your Journey</h2>
          <p style={{ color: "rgba(255,255,255,0.65)", marginBottom: "36px", fontSize: "16px", position: "relative" }}>Full access to all tools, reports, and resources. Cancel anytime.</p>
          <div style={{ position: "relative" }}>
            <Btn onClick={handleGoogleLogin} variant="white" style={{ padding: "16px 48px", fontSize: "16px" }}>Subscribe for $15/month</Btn>
          </div>
        </section>

      
        <section style={{ padding: "0 0 80px", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: "20px" }}>
          <div style={{ background: "linear-gradient(135deg,rgba(94,76,230,0.25),rgba(94,76,230,0.1))", border: "1px solid rgba(94,76,230,0.35)", borderRadius: "20px", padding: "32px" }}>
            <h3 style={{ fontSize: "18px", fontWeight: 800, fontFamily: "'Outfit',sans-serif", marginBottom: "20px", color: "#fff" }}>Log In to Your Account</h3>
            <Btn onClick={handleGoogleLogin} variant="white">Log in →</Btn>
          </div>
          <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "20px", padding: "32px" }}>
            <h3 style={{ fontSize: "18px", fontWeight: 800, fontFamily: "'Outfit',sans-serif", marginBottom: "8px", color: "#fff" }}>Get in Touch</h3>

         <Link to='/contact'>
         
         <p  style={{ display: "inline-block", border: "1px solid rgba(94,76,230,0.5)", color: "#9B8FFF", padding: "12px 28px", borderRadius: "10px", fontSize: "14px", fontWeight: 600, textDecoration: "none", fontFamily: "'Outfit',sans-serif" }}>
              Contact us →
            </p>
         </Link>
          </div>
        </section>

      </div>
    </div>
  );
}

