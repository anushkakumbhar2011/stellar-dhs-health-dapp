import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import WalletConnect from './pages/WalletConnect';
import Dashboard from './pages/Dashboard';
import DashboardIntegrated from './pages/DashboardIntegrated';
import RecordDetails from './pages/RecordDetails';
import ActivityPage from './pages/ActivityPage';
import './App.css';
import './styles/contract-integration.css';

function App() {
  return (
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
  );
}

export default App;
