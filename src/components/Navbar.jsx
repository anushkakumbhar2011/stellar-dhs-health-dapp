import { Link } from 'react-router-dom';
import { Activity } from 'lucide-react';
import './Navbar.css';

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <Activity className="logo-icon" />
          <span className="logo-text">DHS</span>
        </Link>
        
        <div className="navbar-links">
          <a href="#how-it-works">How It Works</a>
          <a href="#for-patients">For Patients</a>
          <a href="#for-providers">For Providers</a>
          <a href="#security">Security</a>
        </div>
        
        <div className="navbar-actions">
          <Link to="/connect" className="btn btn-secondary">
            Connect Wallet
          </Link>
          <Link to="/dashboard" className="btn btn-primary">
            Launch App
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
