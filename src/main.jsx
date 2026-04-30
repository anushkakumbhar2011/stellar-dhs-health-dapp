import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

console.log('🚀 DHS App initializing...');

// Add global error handler
window.addEventListener('error', (event) => {
  console.error('❌ Global error:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('❌ Unhandled promise rejection:', event.reason);
});

try {
  const rootElement = document.getElementById('root');
  
  if (!rootElement) {
    throw new Error('Root element not found');
  }
  
  console.log('✅ Root element found, rendering app...');
  
  createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
  
  console.log('✅ App rendered successfully');
} catch (error) {
  console.error('❌ Failed to render app:', error);
  document.body.innerHTML = `
    <div style="padding: 40px; text-align: center; font-family: system-ui;">
      <h1 style="color: #e74c3c;">Application Error</h1>
      <p style="color: #666;">Failed to initialize DHS application</p>
      <pre style="background: #f5f5f5; padding: 20px; border-radius: 8px; text-align: left; overflow: auto;">
        ${error.message}
      </pre>
      <button onclick="location.reload()" style="margin-top: 20px; padding: 10px 20px; background: #3498db; color: white; border: none; border-radius: 4px; cursor: pointer;">
        Reload Page
      </button>
    </div>
  `;
}
