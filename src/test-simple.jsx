// Minimal React test - no dependencies
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

console.log('🧪 Simple test starting...');

function SimpleApp() {
  return (
    <div style={{ 
      padding: '40px', 
      fontFamily: 'system-ui',
      textAlign: 'center',
      background: '#f0f0f0',
      minHeight: '100vh'
    }}>
      <h1 style={{ color: '#2c3e50' }}>✅ React is Working!</h1>
      <p style={{ color: '#666' }}>If you can see this, React is rendering correctly.</p>
      <button 
        onClick={() => alert('Button clicked!')}
        style={{
          padding: '10px 20px',
          background: '#3498db',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '16px'
        }}
      >
        Test Click
      </button>
    </div>
  );
}

try {
  const rootElement = document.getElementById('root');
  
  if (!rootElement) {
    throw new Error('Root element not found');
  }
  
  console.log('✅ Root element found');
  
  createRoot(rootElement).render(
    <StrictMode>
      <SimpleApp />
    </StrictMode>
  );
  
  console.log('✅ Simple app rendered');
} catch (error) {
  console.error('❌ Simple test failed:', error);
  document.body.innerHTML = `
    <div style="padding: 40px; text-align: center; font-family: system-ui;">
      <h1 style="color: #e74c3c;">Test Failed</h1>
      <pre style="background: #f5f5f5; padding: 20px; border-radius: 8px; text-align: left;">
        ${error.message}
        ${error.stack}
      </pre>
    </div>
  `;
}
