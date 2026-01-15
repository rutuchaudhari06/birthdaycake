🎂 Interactive Birthday Cake Game

This is a small interactive web game built with React, MediaPipe, and Web Audio API.
You light a cake using your hand movement and blow it out using your voice.

What this project does
Shows a birthday cake on the screen
Uses your camera to track your hand
Lets you move a matchstick using your index finger
Lights the cake when the matchstick comes close
Uses your microphone to detect blowing
Blowing near the mic extinguishes the candle
No clicking. No buttons. Just hand + breath.

🛠️ Technologies used
React – UI and state management
Vite – development setup
MediaPipe Hands – real-time hand tracking
Web Audio API – microphone input & blow detection
CSS – layout and visuals

📷 How interaction works
Hand tracking
Camera tracks your hand using MediaPipe
Index finger tip position is mapped to the screen
The matchstick follows your hand movement
Lighting the cake
Distance between matchstick and cake is calculated
When close enough, the cake lights up
Blowing out the candle
Microphone audio is analyzed in real time
A sudden loud airflow (blowing) is detected
If the cake is lit, it turns off

▶️ How to run the project

Go into the project folder:
cd cake-game


Install dependencies:
npm install


Start the development server:
npm run dev


Open the shown local URL in your browser

⚠️ Important notes

Allow camera access when asked
Allow microphone access when asked
Click once on the screen to activate microphone audio (browser requirement)
Good lighting improves hand tracking

📁 Project structure (simplified)
cake-game/
src/ App.jsx, App.css, images/
public/
package.json
README.md

🎯 What this project demonstrates

Real-time sensor input in a React app
Using useRef vs useState correctly
Integrating external libraries with React
Mapping normalized coordinates to screen space
Handling browser audio & camera permissions


This project was built as a learning-focused experiment, not a template.
It explores how different human inputs (hand + voice) can control a web experience.

Enjoy — and happy birthday 🎉🎂
