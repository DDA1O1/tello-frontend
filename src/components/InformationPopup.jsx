// src/components/InformationPopup.jsx
import React from 'react';

// Helper component for individual download links
const DownloadLinkItem = ({ label, size, url, filename }) => (
  <a
    href={url}
    rel="noopener noreferrer"
    download={filename} // Suggests the filename when downloading
    className="flex justify-between items-center px-4 py-3 bg-blue-50 dark:bg-gray-700 hover:bg-blue-100 dark:hover:bg-gray-600 rounded-md border border-blue-200 dark:border-gray-600 transition-colors duration-150 group"
  >
    <div className="flex items-center">
       <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-blue-600 dark:text-blue-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
         <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
       </svg>
       <div>
          <span className="text-sm font-medium text-blue-800 dark:text-blue-200 group-hover:text-blue-900 dark:group-hover:text-blue-100">{label}</span>
          <span className="block text-xs text-gray-500 dark:text-gray-400">{filename}</span>
       </div>
    </div>
    <span className="text-sm font-mono text-gray-600 dark:text-gray-300 bg-gray-200 dark:bg-gray-500 px-2 py-0.5 rounded">{size}</span>
  </a>
);


const InformationPopup = ({ isOpen, onClose, downloadLinks }) => {
  if (!isOpen) {
    return null;
  }

  // Prevent clicks inside the modal from closing it
  const handleModalContentClick = (e) => {
    e.stopPropagation();
  };

  return (
    // Overlay
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-70 backdrop-blur-md transition-opacity duration-300 ease-in-out"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="info-popup-title"
    >
      {/* Modal Box */}
      <div
        className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 transform transition-all duration-300 ease-in-out scale-100 flex flex-col"
        onClick={handleModalContentClick}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          aria-label="Close informational popup"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Title */}
        <h2 id="info-popup-title" className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4 pr-8"> {/* Added pr for close button space */}
          Important: Desktop App Recommended
        </h2>

        {/* Main Explanation */}
        <div className="text-gray-700 dark:text-gray-300 text-sm sm:text-base mb-6 space-y-3">
            <p>
              Modern web browsers operate within a secure "sandbox," limiting direct access to system resources. For the best Tello drone control experience, this web interface relies on a companion **backend application** running on your computer.
            </p>
            <p>
              The backend handles tasks browsers cannot, ensuring smooth operation:
            </p>
            <ul className="list-disc list-inside space-y-1 pl-4 text-gray-600 dark:text-gray-400">
              <li>Direct UDP communication with the drone.</li>
              <li>Reliable video stream processing (via FFMPEG).</li>
              <li>Direct file system access for saving photos and videos.</li>
            </ul>
             <p>
              While this web interface provides the controls, you **need the backend application running** for it to function.
             </p>
        </div>


        {/* Desktop Backend Download Section */}
        <div className="border border-blue-200 dark:border-gray-600 rounded-lg p-4 sm:p-5 mb-6 bg-blue-50/50 dark:bg-gray-700/50">
          <h3 className="text-lg font-medium text-blue-800 dark:text-blue-200 mb-4">
            Download the Tello Backend Application
          </h3>
          <div className="space-y-3">
            {/* Conditionally render download links */}
             {downloadLinks.windows_x64 && <DownloadLinkItem {...downloadLinks.windows_x64} />}
             {downloadLinks.windows_arm64 && <DownloadLinkItem {...downloadLinks.windows_arm64} />}
             {downloadLinks.linux_amd64 && <DownloadLinkItem {...downloadLinks.linux_amd64} />}
             {downloadLinks.linux_arm64 && <DownloadLinkItem {...downloadLinks.linux_arm64} />}
          </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
                Select the appropriate version for your operating system and architecture. After downloading, install and run the backend application before connecting via this web interface. Downloads sourced from GitHub Releases.
            </p>
        </div>

        {/* Browser Recommendation Section */}
        <div className="border border-yellow-300 dark:border-gray-600 rounded-lg p-4 sm:p-5 mb-6 bg-yellow-50/50 dark:bg-yellow-800/10">
           <h3 className="text-lg font-medium text-yellow-800 dark:text-yellow-200 mb-2">
            Web Interface Browser Note
          </h3>
          <p className="text-sm sm:text-base text-yellow-700 dark:text-yellow-300">
             For the smoothest experience with this web interface, we recommend using **Google Chrome**. Some other browsers may aggressively limit performance for complex tasks, potentially causing visual lag or stuttering in the video feed.
          </p>
        </div>

         {/* Footer Actions */}
         <div className="mt-auto pt-4 text-right"> {/* Push to bottom */}
            <button
               onClick={onClose}
               className="px-5 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800 transition-colors duration-200"
            >
                I Understand
            </button>
        </div>

      </div>
    </div>
  );
};

export default InformationPopup;