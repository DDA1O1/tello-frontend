// src/App.jsx
import { useState, useEffect } from 'react'; // Import useState and useEffect
import JSMpegVideoPlayer from '@/components/JSMpegVideoPlayer';
import DroneControl from '@/components/control/DroneControl';
import DroneStateDisplay from '@/components/DroneStateDisplay';
import DownloadPromptModal from '@/components/DownloadPromptModal'; // Import the modal

function App() {
  // State to control the modal visibility
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Optional: Show modal automatically on first load
  // You could use localStorage to show it only once per user session/browser
  useEffect(() => {
    // Example: Show the modal shortly after the app loads
    const timer = setTimeout(() => {
       // Check local storage if you want to show only once
       // const shownBefore = localStorage.getItem('downloadPromptShown');
       // if (!shownBefore) {
           setIsModalOpen(true);
       //    localStorage.setItem('downloadPromptShown', 'true');
       // }
    }, 1500); // Show after 1.5 seconds

    return () => clearTimeout(timer); // Cleanup timer on unmount
  }, []); // Empty dependency array means run once on mount

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="relative h-screen">
      {/* JSMpegVideoPlayer - renders the video stream */}
      <JSMpegVideoPlayer />

      {/* Drone controls overlay */}
      <DroneControl />

      {/* Drone state display */}
      <DroneStateDisplay />

      {/* Download Prompt Modal */}
      <DownloadPromptModal isOpen={isModalOpen} onClose={closeModal} />
    </div>
  );
}

export default App;