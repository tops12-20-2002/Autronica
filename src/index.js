import React from 'react';
import { createRoot } from 'react-dom/client'; // ✅ FIXED
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = createRoot(document.getElementById('root')); // ✅ FIXED
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();
