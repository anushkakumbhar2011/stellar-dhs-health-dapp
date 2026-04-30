import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Component } from 'react';
import LandingPage from './pages/LandingPage';
import WalletConnect from './pages/WalletConnect';
import Dashboard from './pages/Dashboard';
import DashboardIntegrated from './pages/DashboardIntegrated';
import RecordDetails from './pages/RecordDetails';
import ActivityPage from './pages/ActivityPage';
import './App.css';
import './styles/contract-integration.css';

// Error Boundary Component
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('❌ React Error Boundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '40px', textAlign: 'center', fontFamily: 'system-ui' }}>
          <h1 style={{ color: '#e74c3c' }}>Something went wrong</h1>
          <p style={{ color: '#666' }}>The application encountered an error</p>
          <pre style={{ 
            background: '#f5f5f5', 
            padding: '20px', 
            borderRadius: '8px', 
            textAlign: 'left',
            overflow: 'auto',
            maxWidth: '600px',
            margin: '20px auto'
          }}>
            {this.state.error?.toString()}
          </pre>
          <button 
            onClick={() => window.location.reload()} 
            style={{
              marginTop: '20px',
              padding: '10px 20px',
              background: '#3498db',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/connect" element={<WalletConnect />} />
          {/* Use DashboardIntegrated for blockchain integration */}
          <Route path="/dashboard" element={<DashboardIntegrated />} />
          {/* Original dashboard available at /dashboard-demo */}
          <Route path="/dashboard-demo" element={<Dashboard />} />
          <Route path="/record/:id" element={<RecordDetails />} />
          <Route path="/activity" element={<ActivityPage />} />
        </Routes>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
