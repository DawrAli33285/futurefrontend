import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { BASE_URL } from './baseurl';

const CLIENT_ID = '90321078061-0170dr3h7mknf595o674b7ctu70av45u.apps.googleusercontent.com';
const REDIRECT_URI = 'http://localhost:3000/software';

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
        console.log(loginOrCreate)
        console.log("LOGIN")
       
       if(loginOrCreate.data.newuser){
        localStorage.setItem('newuser',true)
       }
        localStorage.setItem('userInfo', JSON.stringify(userInfo));
        localStorage.setItem('token',JSON.stringify(loginOrCreate.data.token))
        setUserInfo(userInfo);
        
        console.log('Login successful!', userInfo);
        
       
        setTimeout(() => {
          navigate('/admin/main');
        }, 500);
      } else {
        const errorData = await response.json();
       
      
      }
    } catch (error) {
    
     
    }
  };

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
      console.log('Redirecting to:', authUrl);
      console.log('Redirect URI:', REDIRECT_URI);
      
      window.location.href = authUrl;
    } catch (error) {
      setError('Error initiating login: ' + error.message);
      console.error('Login error:', error);
    }
  };

 
  useEffect(() => {
    const savedUserInfo = localStorage.getItem('userInfo');
    console.log(savedUserInfo)
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
    <div className="min-h-screen bg-white">
      <header className="py-6 px-4 text-center border-b border-gray-200 relative">
        <h2 className="text-sm tracking-widest text-gray-600 uppercase">
          Online Astrology Software
        </h2>
        {userInfo && (
          <div className="absolute top-4 right-4 flex items-center space-x-4">
          
            <span className="text-gray-700">Welcome, {userInfo.name}</span>
            <button 
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
            >
              Logout
            </button>
          </div>
        )}
      </header>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mx-4 mt-4" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
          <button 
            onClick={() => setError(null)}
            className="absolute top-0 bottom-0 right-0 px-4 py-3"
          >
            <span className="text-2xl">&times;</span>
          </button>
        </div>
      )}

      <section className="py-12 px-4 text-center">
        <h1 className="text-[30px] md:text-5xl font-bold text-gray-900 mb-2">
          TRUE SKY
        </h1>
        <p className="text-base md:text-lg text-gray-600 mb-8">
          ONLINE ASTROLOGY SOFTWARE
        </p>

        {userInfo ? (
          <button 
            onClick={() => navigate('/admin/main')}
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded font-medium transition"
          >
            GO TO SOFTWARE
          </button>
        ) : (
          <button 
            onClick={handleGoogleLogin}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded font-medium transition flex items-center justify-center mx-auto space-x-2"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span>LOGIN WITH GOOGLE</span>
          </button>
        )}

        <div className="max-w-5xl mx-auto my-8 px-4">
          <img 
            src="./true-sky-01.png" 
            alt="Astrology Chart"
            className="w-full rounded-full"
          />
        </div>
      </section>

    
      <section className="py-16 px-4 bg-gray-50">
        <h2 className="text-[30px] md:text-4xl font-bold text-center mb-12">
          Accessible anywhere, anytime, on any device.
        </h2>
        <div className="max-w-6xl mx-auto">
          <img 
            src="./true-sky-02.png" 
            alt="Multiple device view"
            className="w-full rounded-lg shadow-xl"
          />
        </div>
        <p className="text-center text-lg text-gray-700 mt-8">
          No astrology knowledge needed. Info, graphs, and reports all in one click.
        </p>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <img 
            src="./true-sky-04.png" 
            alt="Chart with information"
            className="w-full rounded-lg shadow-xl mb-8"
          />
          <p className="text-center text-lg text-gray-700 mb-8">
            Full chart configuration at your fingertips...
          </p>
        </div>
      </section>

      <section className="py-16 px-4 bg-gray-50">
        <h2 className="text-[30px] md:text-4xl font-bold text-center mb-16">
          FEATURES
        </h2>
        
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8 mb-16">
          <div className="space-y-4">
            <FeatureItem text="All Charts Calculated with One Click" highlight="One Click" />
            <FeatureItem text="Save up to 5K Charts Accessible Anywhere" highlight="5K Charts" />
            <FeatureItem text="Access on Any Device with an Internet Connection" highlight="Any Device" />
            <FeatureItem text="One Account for all your Devices" highlight="all your Devices" />
            <FeatureItem text="One-click Info, Graphs, and Reports" highlight="Info, Graphs, and Reports" />
            <FeatureItem text="Print, Download, and Share Quickly and Easily" highlight="Print, Download, and Share" />
          </div>
          
          <div className="space-y-4">
            <FeatureItem text="Natal, Progressed, Transit, and Return" highlight="Natal, Progressed, Transit, and Return" />
            <FeatureItem text="Highly Visual Progression and Transit Graph" highlight="Progression and Transit Graph" />
            <FeatureItem text="Synastry and Combined for Compatibility" highlight="Synastry and Combined" />
            <FeatureItem text="Easily Upload all your Existing Charts" highlight="Existing Charts" />
            <FeatureItem text="Built-in Chat for Sharing and Support" highlight="Built-in Chat" />
            <FeatureItem text="Advanced Settings: Sidereal, Asteroids, and more..." highlight="Advanced Settings" />
          </div>
        </div>

        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold mb-4">FREE TIER OR</h3>
          <h3 className="text-3xl font-bold mb-6">$15/MONTH</h3>
          {userInfo ? (
            <button 
            onClick={() => navigate('/admin/main')}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded font-medium transition"
            >
              GO TO SOFTWARE
            </button>
          ) : (
            <button 
              onClick={handleGoogleLogin}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded font-medium transition"
            >
              LOGIN WITH GOOGLE
            </button>
          )}
        </div>

        <div className="max-w-4xl mx-auto">
          <table className="w-full bg-white rounded-lg shadow overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-4 text-left font-semibold">Feature</th>
                <th className="px-6 py-4 text-center font-semibold">Free</th>
                <th className="px-6 py-4 text-center font-semibold bg-indigo-50">$15/mo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <TableRow feature="All charts with one click" free={true} paid={true} />
              <TableRow feature="Access on any device" free={true} paid={true} />
              <TableRow feature="Advanced settings (sidereal, asteroids...)" free={true} paid={true} />
              <TableRow feature="Natal, Progressed, Transit, Return" free={true} paid={true} />
              <TableRow feature="Synastry & Combined" free={true} paid={true} />
              <TableRow feature="One-click planet info" free={true} paid={true} />
              <TableRow feature="Print and share charts" free={true} paid={true} />
              <TableRow feature="Save up to 5K charts" free={false} paid={true} />
              <TableRow feature="Save advanced settings" free={false} paid={true} />
              <TableRow feature="One-click chart reports" free={false} paid={true} />
              <TableRow feature="Progression & Transit graph" free={false} paid={true} />
              <TableRow feature="Import & Export charts" free={false} paid={true} />
              <TableRow feature="Community chat" free={false} paid={true} />
            </tbody>
          </table>
        </div>
      </section>

      <section className="py-16 px-4 text-center">
        <h2 className="text-[30px] md:text-4xl font-bold mb-8">
          Astrology for everyone, anywhere
        </h2>
        {userInfo ? (
          <button 
          onClick={() => navigate('/admin/main')}
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded font-medium transition"
          >
            GO TO SOFTWARE
          </button>
        ) : (
          <button 
            onClick={handleGoogleLogin}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded font-medium transition"
          >
            LOGIN WITH GOOGLE
          </button>
        )}
      </section>

      <footer className="py-8 px-4 text-center border-t border-gray-200">
        <p className="text-gray-600">
          HAVE QUESTIONS ABOUT TRUE SKY?{' '}
          <a href="#contact" className="text-indigo-600 hover:text-indigo-700 font-medium">
            CONTACT US
          </a>
        </p>
      </footer>
    </div>
  );
}

function FeatureItem({ text, highlight }) {
  const parts = text.split(highlight);
  return (
    <p className="text-gray-700">
      {parts[0]}
      <span className="font-bold">{highlight}</span>
      {parts[1]}
    </p>
  );
}

function TableRow({ feature, free, paid }) {
  return (
    <tr>
      <td className="px-6 py-4 text-gray-700">{feature}</td>
      <td className="px-6 py-4 text-center">
        {free && (
          <svg className="w-5 h-5 text-green-600 mx-auto" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        )}
      </td>
      <td className="px-6 py-4 text-center bg-indigo-50">
        {paid && (
          <svg className="w-5 h-5 text-green-600 mx-auto" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        )}
      </td>
    </tr>
  );
}