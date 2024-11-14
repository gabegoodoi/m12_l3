// here's where it comes to life!

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render( //render the app within the root element
    <React.StrictMode>
      <App />
    </React.StrictMode>
);