import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import '../index.css';
import { initializeMSW } from './mocks/config';

// Initialize app with conditional MSW
initializeMSW().then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
});
