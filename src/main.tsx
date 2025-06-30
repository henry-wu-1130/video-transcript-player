import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// MSW 模擬 API
async function initMocks() {
  if (process.env.NODE_ENV === 'development') {
    const { worker } = await import('./mocks/browser');
    // 確保 service worker 可以讀取到正確的 MIME type
    return worker.start({
      serviceWorker: {
        url: '/mockServiceWorker.js',
        options: {
          scope: '/',
        },
      },
      onUnhandledRequest: 'bypass',
    });
  }
  return Promise.resolve();
}

// 初始化 MSW
initMocks().then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
});
