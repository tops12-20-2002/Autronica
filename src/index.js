import React from 'react';
import { createRoot } from 'react-dom/client'; // ✅ FIXED
import App from './App';

const root = createRoot(document.getElementById('root')); // ✅ FIXED
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();
