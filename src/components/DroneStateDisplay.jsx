// src/components/DroneStateDisplay.jsx
import React from 'react';
import { useSelector } from 'react-redux';
import { useDroneStateEventSource } from '@hooks/useDroneStateEventSource'; // Corrected import path if needed

const DroneStateDisplay = () => {
  // Get drone connection status and state from Redux store
  const droneConnected = useSelector((state) => state.drone.droneConnected);
  const droneState = useSelector((state) => state.drone.droneState);

  // Pass the connection status to the hook.
  // The hook will now only connect when droneConnected is true.
  useDroneStateEventSource(droneConnected);

  // Check if droneState is available before trying to access its properties
  const batteryLevel = droneState?.battery;
  const flightTime = droneState?.time;
  const lastUpdate = droneState?.lastUpdate;

  return (
    <> {/* Using Fragment as the parent wrapper */}
      {/* Battery Status - Placed top-center relative to viewport */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30">
        <div className="bg-transparent backdrop-blur-sm rounded-lg p-2 transition-all duration-200 group">
          <div className="flex items-center gap-0.5">
             {/* SVG and Battery percentage display */}
             <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-5 w-5 ${
                !batteryLevel ? 'text-gray-500/90' :
                batteryLevel < 20 ? 'text-red-400/90' :
                batteryLevel < 50 ? 'text-yellow-400/90' :
                'text-green-400/90'
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M5.636 5.636l3.536 3.536m0 5.656l-3.536 3.536M12 2v2m0 16v2M4.222 12H2m10 10h-2M7.05 7.05l-1.414-1.414M18.364 18.364l-1.414-1.414M12 6a6 6 0 100 12 6 6 0 000-12zm-3 6h6" /> {/* Example battery icon */}
            </svg>
            <div className="text-center bg-black/20 rounded-md px-2 py-1 w-full group-hover:bg-black/30 transition-all duration-200 min-w-[50px]">
              <span className={`text-sm font-mono font-semibold ${
                !batteryLevel ? 'text-gray-500' :
                batteryLevel < 20 ? 'text-red-400/90' :
                batteryLevel < 50 ? 'text-yellow-400/90' :
                'text-green-400/90'
              }`}>
                {batteryLevel !== null && batteryLevel !== undefined ? `${batteryLevel}%` : '--%'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Flight Time & Last Update - Placed top right */}
       <div className="absolute top-16 right-4 z-30 flex flex-col gap-2">
         {/* Flight Time */}
         <div className="bg-transparent backdrop-blur-sm rounded-lg p-2 bg-purple-500/10 hover:bg-purple-500/10 transition-all duration-200 group">
           <div className="flex items-center gap-1">
             <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-purple-400/90"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
             <div className="text-center bg-black/20 rounded-md px-2 py-1 w-full group-hover:bg-black/30 transition-all duration-200 min-w-[50px]">
               <span className="text-sm font-mono font-semibold text-purple-400/90">
                 {flightTime ?? '--s'}
               </span>
             </div>
           </div>
         </div>

         {/* Last Update */}
         <div className="bg-transparent backdrop-blur-sm rounded-lg p-2 bg-amber-500/10 hover:bg-amber-500/10 transition-all duration-200 group">
           <div className="flex items-center gap-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-amber-400/90"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2} // Corrected stroke-width to strokeWidth
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
             <div className="text-center bg-black/20 rounded-md px-2 py-1 w-full group-hover:bg-black/30 transition-all duration-200 min-w-[80px]">
               <span className="text-sm font-mono font-semibold text-amber-400/90">
                 {lastUpdate
                   ? new Date(lastUpdate).toLocaleTimeString()
                   : '--:--:--'}
               </span>
             </div>
           </div>
         </div>
       </div>
     </>
  );
};

export default DroneStateDisplay;