// src/components/control/DroneControl.jsx
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  setError,
  setDroneConnection,
  setStreamEnabled,
  setRecordingStatus,
  setRecordingFiles,
  incrementRetryAttempts,
  resetRetryAttempts
} from '@/store/slices/droneSlice';

// Get the API base URL from environment variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const DroneControl = () => {
  const dispatch = useDispatch();
  const {
    droneConnected,
    streamEnabled,
    isRecording,
    error,
    retryAttempts
  } = useSelector(state => state.drone);

  // State for active keys (visual feedback)
  const [activeKeys, setActiveKeys] = useState(new Set());
  // State for photo capture visual feedback
  const [isCapturingPhoto, setIsCapturingPhoto] = useState(false); // <-- New state

  // Constants
  const MAX_SDK_RETRY_ATTEMPTS = 5;

  // ==== LIFE CYCLE MANAGEMENT ====
  const enterSDKMode = async () => {
    // ... (rest of the function remains the same)
    if (retryAttempts >= MAX_SDK_RETRY_ATTEMPTS) {
      dispatch(setError('Failed to connect to drone after maximum retry attempts'));
      return false;
    }

    try {

      const url = `${API_BASE_URL}/drone/command`;
        console.log(`Sending command to: ${url}`); // Log for debugging

      const response = await fetch(url);
      const data = await response.json();
      const success = data.status === 'connected';

      if (success) {
        dispatch(setDroneConnection(true));
        dispatch(setError(null));
        dispatch(resetRetryAttempts());
        return true;
      }

      // If not successful, throw an error to be handled by catch block
      throw new Error(`Connection failed: ${data.response}`);

    } catch (error) {
      console.error(error);
      dispatch(setError(error.message));
      dispatch(incrementRetryAttempts());
      return false;
    }
  };

  // Basic command sender
  const sendCommand = async (command) => {
    // ... (rest of the function remains the same)
     if (!droneConnected) {
      dispatch(setError('Drone not connected'));
      return;
    }

    try {

      const url = `${API_BASE_URL}/drone/${command}`;
        console.log(`Sending command to: ${url}`); // Log for debugging

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Command failed: ${response}`);
      }
      const data = await response.json();
      console.log('Command response:', data.response);
    } catch (error) {
      console.error(error);
      dispatch(setError(error.message));
    }
  };

  // ==== VIDEO CONTROLS ====
  const toggleVideoStream = async () => {
    // ... (rest of the function remains the same)
     const command = streamEnabled ? 'streamoff' : 'streamon';
    try {

      // Construct the full URL
      const url = `${API_BASE_URL}/drone/${command}`;
      console.log(`Sending command to: ${url}`); // Log for debugging

      const response = await fetch(url);
      if (!response.ok) throw new Error(`Failed to ${command}, ${response}`);
      dispatch(setStreamEnabled(!streamEnabled));
    } catch (error) {
      console.error(error);
      dispatch(setError(error.message));
    }
  };

  // ==== MODIFIED capturePhoto FUNCTION ====
  const capturePhoto = async () => {
    // Prevent action if stream isn't ready or already capturing
    if (!streamEnabled || isCapturingPhoto) {
      if (!streamEnabled) {
        dispatch(setError('Video stream not available'));
      }
      return;
    }

    setIsCapturingPhoto(true); // Start visual feedback

    try {
      const url = `${API_BASE_URL}/capture-photo`;
      console.log(`Sending POST to: ${url}`);

      const response = await fetch(url, { method: 'POST' });

      if (!response.ok) {
        // Try to get error details from response if possible
        let errorMsg = `Failed to capture photo. Status: ${response.status}`;
        try {
            const errorData = await response.json();
            errorMsg += `: ${errorData.detail || errorData.message || response.statusText}`;
        } catch (jsonError) {
            // Ignore if response body is not JSON or empty
        }
        throw new Error(errorMsg);
      }

      const data = await response.json();
      console.log('Photo captured:', data.fileName);
      // Optional: Show a success message briefly if needed
      // dispatch(setSuccess('Photo captured!')); // Example if you add success state

    } catch (error) {
      console.error(error);
      dispatch(setError(error.message));
    } finally {
      // Use a short timeout to ensure the visual feedback is noticeable
      setTimeout(() => {
        setIsCapturingPhoto(false); // End visual feedback
      }, 500); // Keep the "capturing" state for 500ms
    }
  };
  // ==== END MODIFIED capturePhoto FUNCTION ====


  const toggleRecording = async () => {
    // ... (rest of the function remains the same)
    try {
      const endpoint = isRecording ? '/stop-recording' : '/start-recording';

      // Construct the full URL
      const url = `${API_BASE_URL}${endpoint}`;
      console.log(`Sending POST to: ${url}`); // Log for debugging
      const response = await fetch(url, { method: 'POST' });

      if (!response.ok) {
        throw new Error(`Failed to ${isRecording ? 'stop' : 'start'} recording`);
      }

      if (isRecording) {
        const files = await response.json();
        dispatch(setRecordingFiles(files));
      } else {
        dispatch(setRecordingFiles(null));
      }
      dispatch(setRecordingStatus(!isRecording));
    } catch (error) {
      console.error(error);
      dispatch(setError(error.message));
    }
  };

  // ==== KEYBOARD CONTROLS ====
  useEffect(() => {
    const handleKeyDown = (e) => {
      // ... (rest of the function remains the same)
      const validKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 'a', 's', 'd', 'q', 'e', 'Escape'];
      if (validKeys.includes(e.key)) {
        e.preventDefault();
        setActiveKeys(prev => {
          const updated = new Set(prev);
          updated.add(e.key);
          return updated;
        });

        // Map keys to drone commands
        switch (e.key) {
          case 'w': sendCommand(`forward ${20}`); break;
          case 's': sendCommand(`back ${20}`); break;
          case 'a': sendCommand(`left ${20}`); break;
          case 'd': sendCommand(`right ${20}`); break;
          case 'ArrowUp': sendCommand(`up ${20}`); break;
          case 'ArrowDown': sendCommand(`down ${20}`); break;
          case 'ArrowLeft': sendCommand(`ccw ${45}`); break;
          case 'ArrowRight': sendCommand(`cw ${45}`); break;
          case 'Escape': handleGracefulShutdown(); break;
        }
      }
    };
    // ==== KEY UP ====
    const handleKeyUp = (e) => {
       // ... (rest of the function remains the same)
      const validKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 'a', 's', 'd', 'q', 'e', 'Escape'];
      if (validKeys.includes(e.key)) {
        e.preventDefault();
        setActiveKeys(prev => {
          const updated = new Set(prev);
          updated.delete(e.key); // removes the key from the set that was released
          return updated;
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [droneConnected]); // Dependency array remains the same

  // Basic flight controls
  const handleTakeoff = () => sendCommand('takeoff');
  const handleLand = () => sendCommand('land');
  const handleEmergency = () => sendCommand('emergency');

  // Clear error after 5 seconds
  useEffect(() => {
    // ... (rest of the function remains the same)
     if (error) {
      const timer = setTimeout(() => {
        dispatch(setError(null));
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, dispatch]);

  // Add graceful shutdown handler
  const handleGracefulShutdown = async () => {
    // ... (rest of the function remains the same)
     try {
       // Construct the full URL
       const url = `${API_BASE_URL}/drone/shutdown`;
       console.log(`Sending POST to: ${url}`); // Log for debugging
       const response = await fetch(url, { method: 'POST' });

      if (!response.ok) {
        throw new Error('Failed to initiate graceful shutdown');
      }

      dispatch(setDroneConnection(false));
      dispatch(setStreamEnabled(false));
      dispatch(setError('Graceful shutdown initiated'));
    } catch (error) {
      console.error(error);
      dispatch(setError(error.message));
    }
  };


  return (
    <>
      {/* ... (Top connection/video status remains the same) ... */}
       <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2">
        <div className={`h-2 w-2 rounded-full ${droneConnected ? 'bg-green-500' : 'bg-red-500'} animate-pulse`} />
        {!droneConnected && (
          <button
            onClick={enterSDKMode}
            className="px-3 py-1.5 bg-white/10 backdrop-blur-sm text-white text-sm font-medium rounded-full
                     hover:bg-white/20 transition-all duration-200 flex items-center gap-2 group"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 transition-transform group-hover:rotate-180"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
            Connect Drone
          </button>
        )}

        {/* Video status and control - right side */}
        <div className="ml-8 flex items-center gap-2">
          <div className={`h-2 w-2 rounded-full ${streamEnabled ? 'bg-sky-500' : 'bg-red-500'} animate-pulse`} />
          {droneConnected && (
            <button
              onClick={toggleVideoStream}
              className="px-3 py-1.5 bg-white/10 backdrop-blur-sm text-white text-sm font-medium rounded-full
                       hover:bg-white/20 transition-all duration-200 flex items-center gap-2 group"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {streamEnabled ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z M10 9v6m4-6v6"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                )}
              </svg>
              {streamEnabled ? 'Stop Video' : 'Start Video'}
            </button>
          )}
        </div>
      </div>


      {/* Media Controls - Top Right */}
      <div className="absolute top-4 right-4 z-30 flex items-center gap-3">
        
        <button
          onClick={capturePhoto}
          // Disable button if stream is off OR if currently capturing
          disabled={!streamEnabled || isCapturingPhoto}
          className={`group relative px-3 py-1.5 rounded-full flex items-center gap-2
                     ${
                       !streamEnabled
                         ? 'bg-gray-500/20 border border-gray-500/30 cursor-not-allowed text-gray-400' // Disabled state
                         : isCapturingPhoto
                           ? 'bg-yellow-500/30 border border-yellow-500/50 animate-pulse cursor-wait text-yellow-300' // Capturing state
                           : 'bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/50 active:bg-emerald-500/40 active:scale-95 text-emerald-400' // Normal enabled state
                     }
                     backdrop-blur-sm transition-all duration-200`}
        >
          {/* Icon remains the same for simplicity, could be changed */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            // Adjust color based on state
            className={`h-4 w-4 flex-shrink-0 ${
              !streamEnabled ? 'text-gray-400' : isCapturingPhoto ? 'text-yellow-300' : 'text-emerald-400'
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          {/* Change text based on state */}
          <span className="text-sm font-medium text-white">
            {isCapturingPhoto ? 'Capturing...' : 'Capture'}
          </span>
        </button>
        {/* ==== END MODIFIED Capture Photo Button ==== */}


        {/* Record Button (no changes needed here unless desired) */}
        <button
          onClick={toggleRecording}
          disabled={!streamEnabled}
          className={`group relative px-3 py-1.5 rounded-full flex items-center gap-2 ${
            streamEnabled
              ? isRecording
                ? 'bg-red-500/20 hover:bg-red-500/30 border border-red-500/50' // Red when recording
                : 'bg-sky-500/20 hover:bg-sky-500/30 border border-sky-500/50' // Blue when ready to record
              : 'bg-gray-500/20 border border-gray-500/30 cursor-not-allowed' // Gray when disabled (no stream)
          } backdrop-blur-sm transition-all duration-200`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-4 w-4 ${
              streamEnabled
                ? isRecording ? 'text-red-400' : 'text-sky-400'
                : 'text-gray-400'
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {isRecording ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z M10 9v6m4-6v6"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            )}
          </svg>
          <span className="text-sm font-medium text-white">
            {isRecording ? 'Stop' : 'Record'}
          </span>
        </button>
      </div>

      {/* ... (Takeoff/Land/Emergency buttons remain the same) ... */}
      <div className="absolute top-5 left-8 z-30 flex gap-3">
        {/* Takeoff button */}
        <button
          onClick={handleTakeoff}
          disabled={!droneConnected}
          className={`group relative p-2.5 rounded-lg ${
            droneConnected
              ? 'bg-transparent hover:bg-emerald-500/30 border border-emerald-500/50'
              : 'bg-transparent border border-gray-500/30 cursor-not-allowed'
          } backdrop-blur-sm transition-all duration-200 hover:scale-105`}
          title="Takeoff"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-5 w-5 ${droneConnected ? 'text-emerald-400' : 'text-gray-400'}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 10l7-7m0 0l7 7m-7-7v18"
            />
          </svg>
          <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-black/80 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            Takeoff (T)
          </span>
        </button>

        {/* Land button */}
        <button
          onClick={handleLand}
          disabled={!droneConnected}
          className={`group relative p-2.5 rounded-lg ${
            droneConnected
              ? 'bg-transparent hover:bg-sky-500/30 border border-sky-500/50'
              : 'bg-transparent border border-gray-500/30 cursor-not-allowed'
          } backdrop-blur-sm transition-all duration-200 hover:scale-105`}
          title="Land"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-5 w-5 ${droneConnected ? 'text-sky-400' : 'text-gray-400'}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
          <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-black/80 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            Land (L)
          </span>
        </button>

        {/* Emergency button */}
        <button
          onClick={handleEmergency}
          disabled={!droneConnected}
          className={`group relative p-2.5 rounded-lg ${
            droneConnected
              ? 'bg-transparent hover:bg-red-500/30 border border-red-500/50 animate-pulse'
              : 'bg-transparent border border-gray-500/30 cursor-not-allowed'
          } backdrop-blur-sm transition-all duration-200 hover:scale-105`}
          title="Emergency Stop"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-5 w-5 ${droneConnected ? 'text-red-400' : 'text-gray-400'}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
          <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-black/80 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            Emergency Stop (ESC)
          </span>
        </button>
      </div>

      {/* ... (ESC key indicator remains the same) ... */}
        {droneConnected && (
        <div className="absolute top-28 left-8 z-30">
          <div className="flex items-center gap-2 bg-transparent px-3 py-2 rounded-lg
                        transition-all duration-300 ease-in-out opacity-40 hover:opacity-80">
            <kbd className={`px-2 py-1 text-xs font-semibold text-gray-800 bg-white/80 rounded-md shadow-sm
                          ${activeKeys.has('Escape') ? 'bg-red-100/80' : ''}`}>ESC</kbd>
            <span className="text-white/60 text-sm">to quit</span>
          </div>
        </div>
      )}

      {/* ... (WASD and Arrow Key controls remain the same) ... */}
      <div className="absolute bottom-8 left-8 z-30">
        <div className="bg-transparent bg-opacity-70 p-6 rounded-lg text-white">

          {/* WASD keys */}
          <div className="grid grid-cols-3 gap-2 w-40 mx-auto">
            <div></div>
            <div className={`border-2 ${activeKeys.has('w') ? 'bg-blue-500 border-blue-300' : 'border-gray-600'} rounded-md p-3 text-center font-bold`}>W</div>
            <div></div>
            <div className={`border-2 ${activeKeys.has('a') ? 'bg-blue-500 border-blue-300' : 'border-gray-600'} rounded-md p-3 text-center font-bold`}>A</div>
            <div className={`border-2 ${activeKeys.has('s') ? 'bg-blue-500 border-blue-300' : 'border-gray-600'} rounded-md p-3 text-center font-bold`}>S</div>
            <div className={`border-2 ${activeKeys.has('d') ? 'bg-blue-500 border-blue-300' : 'border-gray-600'} rounded-md p-3 text-center font-bold`}>D</div>
          </div>

          <div className="mt-4 text-center text-sm text-gray-400">
            <p>Forward / Backward</p>
            <p>Left / Right</p>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 right-8 z-30">
        <div className="bg-transparent bg-opacity-70 p-6 rounded-lg text-white">

          {/* Arrow keys */}
          <div className="grid grid-cols-3 gap-2 w-40 mx-auto">
            <div></div>
            <div className={`border-2 ${activeKeys.has('ArrowUp') ? 'bg-blue-500 border-blue-300' : 'border-gray-600'} rounded-md p-3 text-center font-bold`}>↑</div>
            <div></div>
            <div className={`border-2 ${activeKeys.has('ArrowLeft') ? 'bg-blue-500 border-blue-300' : 'border-gray-600'} rounded-md p-3 text-center font-bold`}>←</div>
            <div className={`border-2 ${activeKeys.has('ArrowDown') ? 'bg-blue-500 border-blue-300' : 'border-gray-600'} rounded-md p-3 text-center font-bold`}>↓</div>
            <div className={`border-2 ${activeKeys.has('ArrowRight') ? 'bg-blue-500 border-blue-300' : 'border-gray-600'} rounded-md p-3 text-center font-bold`}>→</div>
          </div>

          <div className="mt-4 text-center text-sm text-gray-400">
            <p>Up / Down</p>
            <p>Rotate Left / Right</p>
          </div>
        </div>
      </div>

      {/* ... (Error display remains the same) ... */}
       <div className="absolute top-0 right-0 m-4 z-30">
        <div className="space-y-4">
          {/* Error display - bottom center */}
          {error && (
            <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
              <div className="p-4 bg-red-500/70 text-white rounded-lg shadow-lg backdrop-blur-sm
                            transition-all duration-300 ease-out
                            translate-y-0 opacity-100 scale-100
                            motion-safe:animate-bounce">
                {error}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default DroneControl;