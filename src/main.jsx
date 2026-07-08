import React from 'react';
import { createRoot } from 'react-dom/client';
import App from '../RiceCostApp.jsx';

window.TWEAK_DEFAULTS = window.TWEAK_DEFAULTS || {
  theme: 'green',
  fontSize: 'normal',
  lang: 'th',
};

createRoot(document.getElementById('root')).render(<App />);
