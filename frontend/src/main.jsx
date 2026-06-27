import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { IdeaProvider } from './contexts/IdeaContext.jsx';
import App from './App.jsx';
import './index.css';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <IdeaProvider>
        <App />
      </IdeaProvider>
    </BrowserRouter>
  </React.StrictMode>
);
