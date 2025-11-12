import React, { useState, useEffect } from 'react';
import { X, Calendar } from 'lucide-react';
import { BASE_URL } from '../baseurl';

export default function BirthdateModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [birthdate, setBirthdate] = useState('');
  const [savedDate, setSavedDate] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user has birth_date on mount
  useEffect(() => {

    checkUserBirthDate();
  }, []);


  const checkUserBirthDate = async () => {
       
    try {
      let token = localStorage.getItem('token');
      token = JSON.parse(token);
      console.log("CALLING")
      const response = await fetch(`${BASE_URL}/getUser`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log(response.data)
      console.log("HEY")

      if (response.ok) {
        const data = await response.json();
        console.log('User data:', data);
        
        // If user doesn't have birth_date, show modal
        if (!data.birth_date) {
          setIsOpen(true);
        } else {
          setSavedDate(data.birth_date);
        }
      } else {
        console.error('Failed to fetch user:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching user:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (birthdate) {
      try {
        let token = localStorage.getItem('token');
        token = JSON.parse(token);
        
        const response = await fetch(`${BASE_URL}/saveBirthDate`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ birth_date: birthdate })
        });

        if (response.ok) {
          const data = await response.json();
          console.log('Birth date saved successfully:', data);
          setSavedDate(birthdate);
          setIsOpen(false);
        } else {
          console.error('Failed to save birth date:', response.statusText);
          alert('Failed to save birth date. Please try again.');
        }
      } catch (error) {
        console.error('Error saving birth date:', error);
        alert('Error saving birth date. Please try again.');
      }
    }
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  // Don't render anything while loading
  if (loading) {
    return null;
  }

  // If modal is not open and we have a saved date, don't show anything
  if (!isOpen && savedDate) {
    return null;
  }

  // If modal is not open, don't show anything
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-2xl max-w-md w-full">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Calendar className="w-6 h-6 text-white" />
            <h2 className="text-xl font-bold text-white">Enter Your Birth Date</h2>
          </div>
          {/* <button
            onClick={handleClose}
            className="text-white hover:bg-purple-800 rounded-lg p-1 transition"
          >
            <X className="w-6 h-6" />
          </button> */}
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-gray-600 mb-4">
            Please enter your birth date to get personalized astrological insights.
          </p>

          <div className="mb-6">
            <label htmlFor="birthdate" className="block text-sm font-medium text-gray-700 mb-2">
              Birth Date
            </label>
            <input
              type="date"
              id="birthdate"
              value={birthdate}
              onChange={(e) => setBirthdate(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-600 transition"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            {/* <button
              onClick={handleClose}
              className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition"
            >
              Cancel
            </button> */}
            <button
              onClick={handleSave}
              disabled={!birthdate}
              className="flex-1 px-4 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
            >
              Save Birth Date
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}