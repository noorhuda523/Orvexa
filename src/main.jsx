import React, { Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import ErrorBoundary from './components/ErrorBoundary';
import { ToastProvider } from './components/Toast';
import { AppProvider } from './context/AppContext';
import './styles/variables.css';
import './styles/global.css';
import './styles/product.css';
import './styles/aurora.css';
import './styles/animations.css';

// Strict Light Theme across the entire application
document.documentElement.dataset.theme = 'light';
try { localStorage.setItem('nx-theme', 'light'); } catch (e) {}

const NexoraBackground = React.lazy(() => import('./components/NexoraBackground'));

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ToastProvider>
        <AppProvider>
          {/* Global background — renders behind everything on every page */}
          <Suspense fallback={null}>
            <NexoraBackground />
          </Suspense>
          <ErrorBoundary>
            <App />
          </ErrorBoundary>
        </AppProvider>
      </ToastProvider>
    </BrowserRouter>
  </React.StrictMode>
);
