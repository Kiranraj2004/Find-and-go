import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import App from './App';
import './index.css';
import { Auth0Provider } from '@auth0/auth0-react';

const domin = import.meta.env.VITE_REACT_APP_DOMIN;
const clientId = import.meta.env.VITE_REACT_CLIENT_ID;

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HelmetProvider>
      <Auth0Provider
        domain={domin}
        clientId={clientId} 
        authorizationParams={{
          redirect_uri: window.location.origin
        }}
      >
        <App />
      </Auth0Provider>
    </HelmetProvider>
  </StrictMode>
);