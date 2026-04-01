import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles.css';
import './revamp.css';
import AppWithAuth from './App.js';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AppWithAuth />
  </React.StrictMode>
);