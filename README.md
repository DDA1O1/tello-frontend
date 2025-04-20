# Tello Drone Frontend Control

This project is a React-based web application designed to control a DJI Tello drone. It provides a user interface for connecting to the drone, viewing its video stream, capturing photos/videos, and controlling its flight using keyboard commands. This frontend communicates with a separate backend application responsible for handling the direct communication with the drone.

## Features

*   **Drone Connection:** Establish and monitor the connection status with the Tello drone via the backend API.
*   **Video Streaming:** Start and stop the drone's video feed, displayed in the interface.
*   **Media Capture:**
    *   Capture still photos from the video stream.
    *   Start and stop video recording.
*   **Real-time State Display:** Show key drone telemetry data like battery percentage, speed, altitude, and flight time.
*   **Keyboard Flight Controls:**
    *   **Movement (WASD):** Forward, backward, left, right.
    *   **Altitude/Rotation (Arrow Keys):** Up, down, rotate left (counter-clockwise), rotate right (clockwise).
    *   **Basic Flight:** Takeoff, Land.
    *   **Emergency Stop:** Immediately cut drone motors (ESC key).
*   **Visual Feedback:** UI elements indicate connection status, video stream status, recording status, and active keyboard controls.
*   **Graceful Shutdown:** Option to safely land and disconnect the drone.

## Tech Stack

*   **Frontend Framework:** React
*   **Build Tool:** Vite
*   **State Management:** Redux Toolkit
*   **Styling:** Tailwind CSS
*   **Video Player:** JSMpeg (likely, based on component names)

## Prerequisites

*   Node.js and npm (or yarn/pnpm)
*   A running instance of the corresponding Tello drone backend application. This frontend requires the backend API to function.
*   A DJI Tello drone connected to the same network as the backend application.

## Setup and Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd tello-frontend
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Configure Environment Variables:**
    *   Create a `.env` file in the project root.
    *   Add the base URL of your running backend API:
        ```
        VITE_API_BASE_URL=http://<your-backend-ip>:<your-backend-port>
        ```
    *   Replace `<your-backend-ip>` and `<your-backend-port>` with the actual IP address and port of your backend service (e.g., `http://localhost:8000`).

4.  **Run the development server:**
    ```bash
    npm run dev
    ```
    This will start the frontend application, typically accessible at `http://localhost:5173` (check the terminal output for the exact URL).

## Usage

1.  Ensure the Tello drone is powered on and connected to the network.
2.  Ensure the backend application is running and accessible at the URL specified in your `.env` file.
3.  Open the frontend application in your web browser.
4.  Click the "Connect Drone" button to establish communication via the backend.
5.  Once connected, use the "Start Video" button to view the drone's camera feed.
6.  Use the Takeoff/Land buttons and keyboard controls (WASD, Arrow Keys, ESC) to fly the drone.
7.  Use the "Capture" and "Record" buttons for media capture.

### Keyboard Controls

*   **W:** Move Forward
*   **S:** Move Backward
*   **A:** Move Left
*   **D:** Move Right
*   **Arrow Up:** Ascend
*   **Arrow Down:** Descend
*   **Arrow Left:** Rotate Counter-Clockwise
*   **Arrow Right:** Rotate Clockwise
*   **T (Implicit):** Takeoff (Use Takeoff button)
*   **L (Implicit):** Land (Use Land button)
*   **ESC:** Emergency Stop / Graceful Shutdown (Initiates shutdown sequence)

## Backend Application

This frontend requires a separate backend application to interact with the Tello drone's SDK. Please refer to the documentation or repository of the backend application for its setup and usage instructions. The `InformationPopup.jsx` component in this frontend might contain links or information about obtaining the backend.
