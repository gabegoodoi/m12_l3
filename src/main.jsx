// here's where it comes to life!

import React from 'react';
import ReactDOM from 'react-dom/client';
import SemanticAppLayout from './components/SemanticAppLayout.jsx';


ReactDOM.createRoot(document.getElementById('root')).render( //render the app within the root element
    <React.StrictMode>
      <SemanticAppLayout />
    </React.StrictMode>
);