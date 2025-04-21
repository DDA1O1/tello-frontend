// src/components/OrientationGuide.jsx
import { useState, useEffect } from 'react';

const OrientationGuide = () => {
  const [showGuide, setShowGuide] = useState(false);

  useEffect(() => {
    const checkOrientationAndSize = () => {
      // Check screen width (common breakpoint for mobile/tablet)
      const isMobileWidth = window.matchMedia('(max-width: 768px)').matches;
      // Check orientation
      const isPortrait = window.matchMedia('(orientation: portrait)').matches;

      // Show the guide only if both mobile width and portrait orientation are true
      setShowGuide(isMobileWidth && isPortrait);
    };

    // Initial check when component mounts
    checkOrientationAndSize();

    // Listen for orientation changes and resize events
    const mediaQueryOrientation = window.matchMedia('(orientation: portrait)');
    const mediaQueryResize = window.matchMedia('(max-width: 768px)');

    // Use the newer addEventListener method if available, fallback to addListener
    if (mediaQueryOrientation.addEventListener) {
      mediaQueryOrientation.addEventListener('change', checkOrientationAndSize);
      mediaQueryResize.addEventListener('change', checkOrientationAndSize);
    } else { // Fallback for older browsers
      mediaQueryOrientation.addListener(checkOrientationAndSize);
      mediaQueryResize.addListener(checkOrientationAndSize);
    }


    // Cleanup listeners when component unmounts
    return () => {
      if (mediaQueryOrientation.removeEventListener) {
        mediaQueryOrientation.removeEventListener('change', checkOrientationAndSize);
        mediaQueryResize.removeEventListener('change', checkOrientationAndSize);
      } else { // Fallback for older browsers
        mediaQueryOrientation.removeListener(checkOrientationAndSize);
        mediaQueryResize.removeListener(checkOrientationAndSize);
      }
    };
  }, []); // Empty dependency array ensures this runs only once on mount and cleans up on unmount

  if (!showGuide) {
    return null; // Don't render anything if the guide shouldn't be shown
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-80 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl text-center max-w-sm">
        {/* Rotation Icon (Heroicons example) */}
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-indigo-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15M3 10h.008v.008H3V10zm7 11h.008v.008H10V21zm5-10h.008v.008H15V11zm7 3h.008v.008H22V14z" />
        </svg>

        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
          Rotate Your Device
        </h2>
        <p className="text-gray-700 dark:text-gray-300 text-sm">
          For the best drone control experience and video view, please rotate your device to landscape mode.
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
          You may need to ensure device rotation is enabled in your system settings.
        </p>
        {/* Optional: Add a close button if needed, but automatic hiding is preferred
         <button
           onClick={() => setShowGuide(false)} // Simple dismiss
           className="mt-4 px-4 py-2 bg-gray-200 text-gray-800 text-sm rounded hover:bg-gray-300"
         >
           Dismiss
         </button>
        */}
      </div>
    </div>
  );
};

export default OrientationGuide;