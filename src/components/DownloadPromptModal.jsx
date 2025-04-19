// src/components/DownloadPromptModal.jsx
import { Dialog, Transition, Menu } from '@headlessui/react';
import { Fragment } from 'react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';

// --- IMPORTANT: Replace these with your ACTUAL direct download URLs ---
const GITHUB_BASE_URL = 'https://github.com/DDA1O1/tello-backend/releases/download/v1.0.3'; // Replace with your base path

const DOWNLOAD_URLS = {
  winArm64: `${GITHUB_BASE_URL}/tello-backend-1.0.3.Setup-arm64.exe`,
  winX64: `${GITHUB_BASE_URL}/tello-backend-1.0.3.Setup-x64.exe`,
  linuxAmd64: `${GITHUB_BASE_URL}/tello-backend_1.0.3_amd64-x64.deb`,
  linuxArm64: `${GITHUB_BASE_URL}/tello-backend_1.0.3_arm64-arm64.deb`,
};
// --- End of URLs to replace ---

// --- Define the filenames for the download attribute ---
const FILENAMES = {
    winArm64: 'tello-backend-1.0.3.Setup-arm64.exe',
    winX64: 'tello-backend-1.0.3.Setup-x64.exe',
    linuxAmd64: 'tello-backend_1.0.3_amd64-x64.deb',
    linuxArm64: 'tello-backend_1.0.3_arm64-arm64.deb',
}
// --- End of configuration ---

// Helper function to trigger download via JavaScript
const triggerDownload = (url, filename) => {
    console.log(`Attempting to download: ${url} as ${filename}`); // For debugging
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename || ''); // Use provided filename
    // Append to body to ensure click works in all browsers (esp. Firefox)
    document.body.appendChild(link);
    link.click();
    // Clean up the temporary link element
    document.body.removeChild(link);
    console.log('Download triggered.'); // For debugging
  };

  function DownloadPromptModal({ isOpen, onClose }) {
    return (
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={onClose}>
          {/* Backdrop */}
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm" aria-hidden="true" />
          </Transition.Child>
  
          {/* Modal Content Container */}
          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                {/* The Modal Panel */}
                <Dialog.Panel className="w-full max-w-md transform rounded-2xl bg-white dark:bg-gray-800 p-6 text-left align-middle shadow-xl transition-all overflow-y-auto max-h-[90vh]">
  
                  {/* Icon */}
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/50 mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600 dark:text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
  
                  {/* Title */}
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-semibold leading-6 text-gray-900 dark:text-gray-100 text-center"
                  >
                    Enhanced Experience Available
                  </Dialog.Title>
  
                  {/* Content Text */}
                  <div className="mt-4 space-y-3 text-sm text-gray-600 dark:text-gray-300">
                    <p>
                      For full functionality, including direct drone communication (UDP), video recording management (file system access), and optimized video processing (FFmpeg), please use our dedicated desktop application.
                    </p>
                    <p>
                      Browsers operate in a secure sandbox environment, which restricts these capabilities for security reasons.
                    </p>
                    <p className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600 font-medium text-gray-700 dark:text-gray-200">
                      Using the Web Version?
                    </p>
                    <p>
                      For the best performance in this web interface, we recommend using <span className="font-semibold">Google Chrome</span>. Other browsers (like Edge or Opera) may heavily restrict background processing, potentially causing lag or stuttering in the video feed.
                    </p>
                  </div>
  
                  {/* Action Buttons Area */}
                  <div className="mt-6 flex flex-col sm:flex-row-reverse gap-3">
  
                    {/* Download Dropdown */}
                    <Menu as="div" className="relative inline-block text-left w-full sm:w-auto">
                      <div>
                        <Menu.Button className="inline-flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-800">
                          Download Desktop App
                          <ChevronDownIcon // Remove if not using Heroicons
                            className="ml-2 -mr-1 h-5 w-5 text-blue-200 hover:text-blue-100"
                            aria-hidden="true"
                          />
                        </Menu.Button>
                      </div>
                      <Transition
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                      >
                        <Menu.Items className="absolute right-0 z-20 mt-2 w-56 origin-top-right divide-y divide-gray-100 dark:divide-gray-600 rounded-md bg-white dark:bg-gray-700 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                          <div className="px-1 py-1">
                            <Menu.Item>
                              {({ active }) => (
                                <button
                                  type="button"
                                  onClick={() => triggerDownload(DOWNLOAD_URLS.winX64, FILENAMES.winX64)}
                                  className={`${
                                    active ? 'bg-blue-500 text-white' : 'text-gray-900 dark:text-gray-200'
                                  } group flex w-full items-center rounded-md px-2 py-2 text-sm text-left`}
                                >
                                  Windows (x64 .exe)
                                </button>
                              )}
                            </Menu.Item>
                            <Menu.Item>
                              {({ active }) => (
                                <button
                                  type="button"
                                  onClick={() => triggerDownload(DOWNLOAD_URLS.winArm64, FILENAMES.winArm64)}
                                  className={`${
                                    active ? 'bg-blue-500 text-white' : 'text-gray-900 dark:text-gray-200'
                                  } group flex w-full items-center rounded-md px-2 py-2 text-sm text-left`}
                                >
                                  Windows (ARM64 .exe)
                                </button>
                              )}
                            </Menu.Item>
                          </div>
                          <div className="px-1 py-1">
                            <Menu.Item>
                              {({ active }) => (
                                <button
                                  type="button"
                                  onClick={() => triggerDownload(DOWNLOAD_URLS.linuxAmd64, FILENAMES.linuxAmd64)}
                                  className={`${
                                    active ? 'bg-blue-500 text-white' : 'text-gray-900 dark:text-gray-200'
                                  } group flex w-full items-center rounded-md px-2 py-2 text-sm text-left`}
                                >
                                  Linux (AMD64 .deb)
                                </button>
                              )}
                            </Menu.Item>
                            <Menu.Item>
                              {({ active }) => (
                                <button
                                  type="button"
                                  onClick={() => triggerDownload(DOWNLOAD_URLS.linuxArm64, FILENAMES.linuxArm64)}
                                  className={`${
                                    active ? 'bg-blue-500 text-white' : 'text-gray-900 dark:text-gray-200'
                                  } group flex w-full items-center rounded-md px-2 py-2 text-sm text-left`}
                                >
                                  Linux (ARM64 .deb)
                                </button>
                              )}
                            </Menu.Item>
                          </div>
                        </Menu.Items>
                      </Transition>
                    </Menu>
  
                    {/* Continue Button */}
                    <button
                      type="button"
                      className="inline-flex w-full justify-center rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-800 sm:mt-0 sm:w-auto"
                      onClick={onClose} // This button *should* close the modal
                    >
                      Continue in Browser
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    );
  }
  
  export default DownloadPromptModal;