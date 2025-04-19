// src/hooks/useDroneStateEventSource.js
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setDroneState } from '@/store/slices/droneSlice';

// Get the SSE URL from environment variables
const SSE_URL = import.meta.env.VITE_SSE_URL;

// Add an 'isEnabled' parameter
export function useDroneStateEventSource(isEnabled) {
    const dispatch = useDispatch();

    useEffect(() => {
        let eventSource = null;

        // Only establish the connection if the hook is enabled AND the URL is defined
        if (isEnabled && SSE_URL) {
            console.log(`Connecting to SSE at: ${SSE_URL}`); // Log for debugging
            eventSource = new EventSource(SSE_URL);

            // Handle incoming messages
            eventSource.onmessage = (event) => {
                try {
                    const state = JSON.parse(event.data);
                    dispatch(setDroneState(state));
                } catch (error) {
                    console.error('Error processing drone state:', error);
                }
            };

            // Handle connection errors
            eventSource.onerror = (error) => {
                console.error(`EventSource error connecting to ${SSE_URL}:`, error);
                console.log('EventSource readyState:',
                    eventSource.readyState === 0 ? 'CONNECTING' :
                    eventSource.readyState === 1 ? 'OPEN' :
                    eventSource.readyState === 2 ? 'CLOSED' : 'UNKNOWN'
                );
                // Note: EventSource auto-reconnects, but if the server is down
                // or isEnabled becomes false, the connection attempt will stop or close.
            };

            // Cleanup function: This runs when isEnabled becomes false OR the component unmounts
            return () => {
                if (eventSource) {
                    console.log('Closing SSE connection.');
                    eventSource.close();
                }
            };
        } else {
             // Ensure cleanup runs if isEnabled turns false while connected previously
             // The 'return' inside the 'if' block handles this scenario,
             // because the effect re-runs when 'isEnabled' changes.
             console.log('SSE connection is disabled or SSE_URL is not defined.');
        }

    // Add isEnabled and dispatch to the dependency array
    // The effect will re-run whenever isEnabled or dispatch changes
    }, [isEnabled, dispatch]);
}