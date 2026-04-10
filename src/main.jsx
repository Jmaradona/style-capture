import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import LockScreen from './components/LockScreen';
import ErrorBoundary from './components/ErrorBoundary';
import './index.css';

function Root() {
  const [unlocked, setUnlocked] = useState(false);

  if (!unlocked) {
    return <LockScreen onUnlock={() => setUnlocked(true)} />;
  }

  return <App />;
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <ErrorBoundary>
    <Root />
  </ErrorBoundary>
);

// Register service worker for PWA
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js').catch(() => {});
}
