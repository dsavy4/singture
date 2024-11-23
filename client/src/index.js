// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/index.css'; // Global styles
import App from './App'; // Main application component
import reportWebVitals from './reportWebVitals'; // Performance metrics

// Create root and render the App
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  //<React.StrictMode>
    <App />
  //</React.StrictMode>
);

// Optional: Measure performance
reportWebVitals();
