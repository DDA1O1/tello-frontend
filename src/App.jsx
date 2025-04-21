// src/App.jsx
import { useState, useEffect } from 'react';
import JSMpegVideoPlayer from '@/components/JSMpegVideoPlayer';
import DroneControl from '@/components/control/DroneControl';
import DroneStateDisplay from '@/components/DroneStateDisplay';
import InformationPopup from '@/components/InformationPopup'; 
import OrientationGuide from '@/components/OrientationGuide';

// Base URL for all download links
const BASE_URL = 'https://github.com/DDA1O1/tello-backend/releases/download/v1.0.3/';


const DOWNLOAD_LINKS = {
  windows_x64: {
    url: `${BASE_URL}tello-backend-1.0.3.Setup-x64.exe`, // Using BASE_URL
    label: 'Windows Installer (x64)',
    size: '112 MB',
    filename: 'tello-backend-1.0.3.Setup-x64.exe'
  },
  windows_arm64: {
    url: `${BASE_URL}tello-backend-1.0.3.Setup-arm64.exe`, // Using BASE_URL
    label: 'Windows Installer (ARM64)',
    size: '112 MB',
    filename: 'tello-backend-1.0.3.Setup-arm64.exe'
  },
  linux_amd64: {
    url: `${BASE_URL}tello-backend_1.0.3_amd64-x64.deb`, // Using BASE_URL
    label: 'Linux Debian/Ubuntu Package (amd64)',
    size: '81.5 MB',
    filename: 'tello-backend_1.0.3_amd64-x64.deb'
  },
  linux_arm64: {
    url: `${BASE_URL}tello-backend_1.0.3_arm64-arm64.deb`, // Using BASE_URL
    label: 'Linux Debian/Ubuntu Package (arm64)',
    size: '81.5 MB',
    filename: 'tello-backend_1.0.3_arm64-arm64.deb'
  },
};
// -----------------

function App() {
  const [isInfoPopupOpen, setIsInfoPopupOpen] = useState(false);

  // Show the popup when the component mounts
  useEffect(() => {
    setIsInfoPopupOpen(true);
  }, []); // Runs once on mount

  const handleCloseInfoPopup = () => {
    setIsInfoPopupOpen(false);
  };

  return (
    <div className="relative h-screen bg-gray-900"> {/* Added a fallback bg */}
      {/* JSMpegVideoPlayer */}
      <JSMpegVideoPlayer />

      {/* Drone controls overlay */}
      <DroneControl />

      {/* Drone state display */}
      <DroneStateDisplay />

      {/* Information Popup */}
      <InformationPopup
        isOpen={isInfoPopupOpen}
        onClose={handleCloseInfoPopup}
        downloadLinks={DOWNLOAD_LINKS} 
      />

      {/* Orientation Guide */}
      <OrientationGuide />
      
    </div>
  );
}

export default App;