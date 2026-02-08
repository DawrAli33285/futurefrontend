



import React, { useState, useEffect } from 'react';
import { Upload, Download, Loader2 } from 'lucide-react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { BASE_URL } from './baseurl';

export default function AdminProfilePage() {
  const [deleteChartsChecked, setDeleteChartsChecked] = useState(false);
  const [deleteAccountChecked, setDeleteAccountChecked] = useState(false);
  const [defaultLocation, setDefaultLocation] = useState('New York City, New York, United States');
  const [isExporting, setIsExporting] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        let token = localStorage.getItem('token');
        token=JSON.parse(token)
        const response = await axios.get(`${BASE_URL}/get-profile`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

     

        setProfileData(response.data);
        
       
        if (response.data.user?.default_location) {
          setDefaultLocation(response.data.user.default_location);
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast.error('Failed to load profile data', { containerId: "accountpage" });
        setIsLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  const handleImportCharts = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv';
    input.multiple = true;
    
    input.onchange = async (e) => {
      const files = e.target.files;
      if (!files || files.length === 0) return;
  
      const formData = new FormData();
      for (let i = 0; i < files.length; i++) {
        formData.append('files', files[i]);
      }
  
      try {
        let token = localStorage.getItem('token');
        token = JSON.parse(token);
  
        toast.info(`Importing ${files.length} file(s)...`, { containerId: "accountpage" });
  
        const response = await axios.post(
          `${BASE_URL}/import-chart`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data'
            }
          }
        );
  
        const { results } = response.data;
        
        if (results.success > 0) {
          toast.success(
            `Successfully imported ${results.success} chart(s)${results.failed > 0 ? `, ${results.failed} failed` : ''}`,
            { containerId: "accountpage", autoClose: 5000 }
          );
          
         
          const profileResponse = await axios.get(`${BASE_URL}/get-profile`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          setProfileData(profileResponse.data);
        } else {
          toast.error(`Failed to import charts. ${results.failed} error(s) occurred.`, { 
            containerId: "accountpage",
            autoClose: 5000 
          });
        }
  
        if (results.errors && results.errors.length > 0) {
          console.error('Import errors:', results.errors);
          const errorSample = results.errors.slice(0, 3).join('; ');
          toast.warning(`Errors: ${errorSample}${results.errors.length > 3 ? '...' : ''}`, { 
            containerId: "accountpage",
            autoClose: 7000 
          });
        }
      } catch (error) {
        console.error('Import error:', error);
        const errorMessage = error.response?.data?.error || 'Failed to import charts. Please try again.';
        toast.error(errorMessage, { containerId: "accountpage" });
      }
    };
  
    input.click();
  };
  
  const flattenObject = (obj, prefix = '') => {
    let result = {};
    
    for (let key in obj) {
     
      if (key === '_id' || key === '__v' || key === 'userId') {
        continue;
      }
      
      const newKey = prefix + key;
      
      if (obj[key] === null || obj[key] === undefined) {
        result[newKey] = '';
      } else if (obj[key] instanceof Date) {
        result[newKey] = obj[key].toISOString();
      } else if (Array.isArray(obj[key])) {
       
        if (obj[key].length > 0 && typeof obj[key][0] === 'object') {
          obj[key].forEach((item, index) => {
            Object.assign(result, flattenObject(item, `${newKey}_${index}_`));
          });
        } else {
          result[newKey] = JSON.stringify(obj[key]);
        }
      } else if (typeof obj[key] === 'object') {
   
        Object.assign(result, flattenObject(obj[key], newKey + '_'));
      } else {
        result[newKey] = obj[key];
      }
    }
    
    return result;
  };

  
  const convertToCSV = (data) => {
    if (!data || data.length === 0) return '';
  
    const flattenedData = data.map(item => flattenObject(item));
    
   
    if (flattenedData.length > 0) {
   
    }
    
    if (flattenedData.length === 0) return '';
    
    const headers = Object.keys(flattenedData[0]);
    const csvHeaders = headers.join(',');
    
    const csvRows = flattenedData.map(row => {
      return headers.map(header => {
        let value = row[header] || '';
        value = String(value).replace(/"/g, '""');
        return `"${value}"`;
      }).join(',');
    });
    
    return [csvHeaders, ...csvRows].join('\n');
  };
  
  const downloadCSV = (csvContent, filename) => {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  
  const handleExportCharts = () => {
    if (!profileData) {
      toast.error('No profile data available. Please refresh the page.', { containerId: "accountpage" });
      return;
    }
  
    setIsExporting(true);
    try {
      const { mainCharts, synastryCharts, transitCharts, compositeCharts, transitGraph } = profileData;
  
      let exportedCount = 0;
  
    
      if (mainCharts && mainCharts.length > 0) {
        const chartsWithType = mainCharts.map(chart => ({ ...chart, chartname: 'main' }));
        const csv = convertToCSV(chartsWithType);
        downloadCSV(csv, 'mainchart.csv');
        exportedCount++;
      }
  
     
      if (synastryCharts && synastryCharts.length > 0) {
        const chartsWithType = synastryCharts.map(chart => ({ ...chart, chartname: 'synastry' }));
        const csv = convertToCSV(chartsWithType);
        downloadCSV(csv, 'synastrychart.csv');
        exportedCount++;
      }
  
      
      if (transitCharts && transitCharts.length > 0) {
        const chartsWithType = transitCharts.map(chart => ({ ...chart, chartname: 'transit' }));
        const csv = convertToCSV(chartsWithType);
        downloadCSV(csv, 'transitchart.csv');
        exportedCount++;
      }
  
      
      if (compositeCharts && compositeCharts.length > 0) {
        const chartsWithType = compositeCharts.map(chart => ({ ...chart, chartname: 'composite' }));
        const csv = convertToCSV(chartsWithType);
        downloadCSV(csv, 'compositechart.csv');
        exportedCount++;
      }
  
      if (transitGraph && transitGraph.length > 0) {
        const chartsWithType = transitGraph.map(chart => ({ ...chart, chartname: 'graph' }));
        const csv = convertToCSV(chartsWithType);
        downloadCSV(csv, 'transitgraph.csv');
        exportedCount++;
      }
  
      if (exportedCount > 0) {
        toast.success(`Successfully exported ${exportedCount} chart file(s)`, { containerId: "accountpage" });
      } else {
        toast.info('No charts found to export', { containerId: "accountpage" });
      }
  
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export charts. Please try again.', { containerId: "accountpage" });
    } finally {
      setIsExporting(false);
    }
  };


  const handleDeleteAllCharts = async() => {
 try{
  if (deleteChartsChecked) {
   
  } else {
    toast.warning('Please confirm deletion by checking the box', { containerId: "accountpage" });
  return;
  }
  let token=localStorage.getItem('token')
  token=JSON.parse(token)

  let response=await axios.post(`${BASE_URL}/deleteAllCharts`,{},{
    headers:{
      Authorization:`Bearer ${token}`
    }
  })

  toast.success(response.data.message,{containerId:"accountpage"})

 }catch(e){

if(e?.response?.data?.error){
toast.error(e?.response?.data?.error,{containerId:"accountpage"})
}else{
toast.error("Error occured while trying to delete charts",{containerId:"accountpage"})
}
 }
  };


  const checkOut=async()=>{
    try{
      let token=localStorage.getItem('token')
      token=JSON.parse(token)
  let response=await axios.get(`${BASE_URL}/subscribe`,{
    headers:{
      Authorization:`Bearer ${token}`
    }
  })
  window.location.href=response.data.url

    }catch(e){
      
    }
  }
  
  const handleUpdateLocation = () => {
    
  };

  const handleLogOut = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('userInfo')
    window.location.href='/'
  };

  const handleUnlockFeatures = () => {
  
  };

  const handleDeleteAccount =async() => {
  try{
    if (deleteAccountChecked) {
     
    } else {
      toast.warning('Please confirm irreversible deletion by checking the box', { containerId: "accountpage" });
   return
    }
let token=localStorage.getItem('token')
token=JSON.parse(token)
    let response=await axios.post(`${BASE_URL}/deleteProfile`,{},{
      headers:{
        Authorization:`Bearer ${token}`
      }
    })

    toast.success(response.data.message,{containerId:"accountpage"})
    localStorage.removeItem('token')
    localStorage.removeItem('userInfo')
    window.location.href='/'
  }catch(e){
if(e?.response?.data?.error){
toast.error(e?.response?.data?.error,{containerId:"accountpage"})
}else{
toast.error("Error occured while trying to delete account",{containerId:"accountpage"})
}
  }
  };

  return (
    <>
      <ToastContainer containerId={"accountpage"} />

      {isLoading ? (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-purple-600 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">Loading profile...</p>
          </div>
        </div>
      ) : (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm p-8 mb-6">
              <h2 className="text-xl font-bold text-center mb-6 text-gray-800">
                IMPORT/EXPORT CHARTS
              </h2>
              
              <div className="flex justify-center gap-4 mb-6">
                <button
                  onClick={handleImportCharts}
                  className="flex items-center gap-2 px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  <Upload size={16} />
                  Import Charts
                </button>
                <button
                  onClick={handleExportCharts}
                  disabled={isExporting || isLoading}
                  className="flex items-center gap-2 px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Download size={16} />
                  {isExporting ? 'Exporting...' : 'Export Charts'}
                </button>
              </div>

              <div className="flex flex-col items-center">
                <button
                  onClick={handleDeleteAllCharts}
                  className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors mb-3"
                >
                  Delete All Charts
                </button>
                <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={deleteChartsChecked}
                    onChange={(e) => setDeleteChartsChecked(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300"
                  />
                  <span>I confirm deletion of all charts in my account</span>
                </label>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-8">
              <h2 className="text-xl font-bold text-center mb-6 text-gray-800">
                ACCOUNT SETTINGS
              </h2>

              <div className="flex flex-col items-center mb-6">
                <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-semibold mb-3 overflow-hidden">
                  {isLoading ? (
                    '...'
                  ) : profileData?.user?.imageUrl ? (
                    <img 
                      src={`${profileData.user.imageUrl}?sz=64`}
                      alt={profileData?.user?.name || 'User'} 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                      crossOrigin="anonymous"
                    />
                  ) : (
                    profileData?.user?.name?.charAt(0).toUpperCase() || 'U'
                  )}
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-1">
                  {isLoading ? 'Loading...' : (profileData?.user?.name || 'User')}
                </h3>
                <a 
                  href="https://myaccount.google.com/personal-info" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline text-sm flex items-center gap-1"
                >
                  Update Profile
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>

              <div className="flex justify-center mb-6">
                <button
                  onClick={handleLogOut}
                  className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Log Out
                </button>
              </div>

              <div className="text-center mb-3">
                <p className="text-gray-700 mb-3">
                  Subscription status: {isLoading ? 'Loading...' : (profileData?.subscription?.status)}
                </p>
                {profileData?.subscription?.status === 'active' || profileData?.subscription?.status === 'trialing' ?'':<>
                  <button
                    onClick={checkOut}
                    className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    Unlock Full Features
                  </button>
                </>}
              </div>

              <div className="border-t border-gray-200 pt-6 mt-6">
                <div className="flex flex-col items-center">
                  <button
                    onClick={handleDeleteAccount}
                    className="px-6 py-2 border border-red-300 text-red-600 rounded-md hover:bg-red-50 transition-colors mb-3"
                  >
                    Delete Account
                  </button>
                  <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={deleteAccountChecked}
                      onChange={(e) => setDeleteAccountChecked(e.target.checked)}
                      className="w-4 h-4 rounded border-gray-300"
                    />
                    <span>I confirm irreversible deletion of my account and charts</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}