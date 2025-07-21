import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import * as Sentry from '@sentry/react';
import { initializeMSW } from './mocks/config';
import '../index.css';

// Initialize app with conditional MSW
initializeMSW().then(() => {
  Sentry.init({
    dsn: 'https://1234567890@o1.ingest.sentry.io/1234567890',
    tracesSampleRate: 1.0,
  });
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
});
