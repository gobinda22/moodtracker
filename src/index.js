import React from 'react';
import ReactDOM from 'react-dom/client'; // Note: React 18 uses createRoot
import App from './App';
import './styles/global.css';

// React 18 way of rendering
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you're using React 17 or earlier, use this instead:
// ReactDOM.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>,
//   document.getElementById('root')
// );