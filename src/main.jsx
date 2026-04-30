import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

console.log('🚀 DHS App initializing...');
console.log('React version:', StrictMode);
console.log('createRoot available:', typeof createRoot);

// Add global error handler
window.addEventListener('error', (event) => {
  console.error('❌ Global error:', event.error);
  console.error('Error message:', event.message);
  console.error('Error filename:', event.filename);
  console.error('Error line:', event.lineno);
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('❌ Unhandled promise rejection:', event.reason);
});

// Import CSS first
import('./index.css').then(() => {
  console.log('✅ index.css loaded');
}).catch(err => {
  console.error('❌ Failed to load index.css:', err);
});

// Import App component
import('./App.jsx').then((module) => {
  console.log('✅ App.jsx loaded');
  const App = module.default;
  
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
    console.error('Error stack:', error.stack);
    document.body.innerHTML = `
      <div style="padding: 40px; text-align: center; font-family: system-ui;">
        <h1 style="color: #e74c3c;">Application Error</h1>
        <p style="color: #666;">Failed to initialize DHS application</p>
        <pre style="background: #f5f5f5; padding: 20px; border-radius: 8px; text-align: left; overflow: auto; max-width: 800px; margin: 20px auto;">
${error.message}

${error.stack}
        </pre>
        <button onclick="location.reload()" style="margin-top: 20px; padding: 10px 20px; background: #3498db; color: white; border: none; border-radius: 4px; cursor: pointer;">
          Reload Page
        </button>
      </div>
    `;
  }
}).catch(err => {
  console.error('❌ Failed to load App.jsx:', err);
  console.error('Error details:', err.message);
  console.error('Error stack:', err.stack);
  document.body.innerHTML = `
    <div style="padding: 40px; text-align: center; font-family: system-ui;">
      <h1 style="color: #e74c3c;">Module Loading Error</h1>
      <p style="color: #666;">Failed to load application module</p>
      <pre style="background: #f5f5f5; padding: 20px; border-radius: 8px; text-align: left; overflow: auto; max-width: 800px; margin: 20px auto;">
${err.message}

${err.stack}
      </pre>
      <p style="margin-top: 20px; color: #666;">
        This might be a browser compatibility issue. Try:
        <br>1. Hard refresh (Cmd+Shift+R)
        <br>2. Clear browser cache
        <br>3. Try a different browser (Chrome/Firefox)
      </p>
      <button onclick="location.reload()" style="margin-top: 20px; padding: 10px 20px; background: #3498db; color: white; border: none; border-radius: 4px; cursor: pointer;">
        Reload Page
      </button>
    </div>
  `;
});
