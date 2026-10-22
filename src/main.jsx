import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LearningProvider } from './context/LearningContext';
import { registerServiceWorker } from './pwa/registerServiceWorker';
import './index.css';
import App from './App.jsx';

registerServiceWorker();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <AuthProvider>
        <LearningProvider>
          <App />
        </LearningProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);
