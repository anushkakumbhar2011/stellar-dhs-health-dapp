import { Link } from 'react-router-dom';
import { Shield, Lock, Database, CheckCircle, ArrowRight } from 'lucide-react';
import './LandingPage.css';

function LandingPage() {
  return (
    <div className="landing-page">
      {/* Header */}
      <header className="header">
        <div className="header-container">
          <div className="logo">
            <Shield size={24} />
            <span>DHS</span>
          </div>
          <nav className="nav">
            <a href="#features" className="nav-link">Features</a>
            <a href="#how-it-works" className="nav-link">How It Works</a>
            <a href="#security" className="nav-link">Security</a>
            <a href="#about" className="nav-link">About</a>
          </nav>
          <div className="header-actions">
            <Link to="/connect" className="btn btn-secondary">
              Connect Wallet
            </Link>
            <Link to="/dashboard" className="btn btn-primary">
              Launch App
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-container">
          <div className="hero-badge badge badge-info">
            Built on Stellar + IPFS
          </div>
          <h1 className="hero-title">
            Decentralized Health System
          </h1>
          <p className="hero-subtitle">
            Your health records. Owned by you. Secured by blockchain.
            <br />
            Patient-controlled medical data with cryptographic proof.
          </p>
          <div className="hero-actions">
            <Link to="/connect" className="btn btn-primary btn-large">
              Get Started
              <ArrowRight size={20} />
            </Link>
            <Link to="/dashboard" className="btn btn-ghost btn-large">
              View Demo
            </Link>
          </div>
          <div className="hero-features">
            <div className="hero-feature">
              <Lock size={16} />
              <span>256-bit Encrypted</span>
            </div>
            <div className="hero-feature">
              <Database size={16} />
              <span>IPFS Storage</span>
            </div>
            <div className="hero-feature">
              <CheckCircle size={16} />
              <span>Blockchain Verified</span>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stats-container">
          <div className="stat-card">
            <div className="stat-value">100%</div>
            <div className="stat-label">Patient Owned</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">0</div>
            <div className="stat-label">Data Breaches</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">&lt; 3s</div>
            <div className="stat-label">Upload Time</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">∞</div>
            <div className="stat-label">Immutable Records</div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="how-section">
        <div className="section-container">
          <h2 className="section-title">How It Works</h2>
          <p className="section-subtitle">Three simple steps to sovereign health data</p>
          
          <div className="steps-grid">
            <div className="step-card card">
              <div className="step-number">01</div>
              <div className="step-icon">
                <Shield size={32} />
              </div>
              <h3>Connect Wallet</h3>
              <p>Authenticate securely with your Stellar wallet. No passwords, no data collection.</p>
            </div>
            
            <div className="step-card card">
              <div className="step-number">02</div>
              <div className="step-icon">
                <Database size={32} />
              </div>
              <h3>Upload Records</h3>
              <p>Your files are encrypted and stored on IPFS with immutable proof on Stellar.</p>
            </div>
            
            <div className="step-card card">
              <div className="step-number">03</div>
              <div className="step-icon">
                <CheckCircle size={32} />
              </div>
              <h3>Control Access</h3>
              <p>Grant or revoke provider access instantly. You own your data, always.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="features-section">
        <div className="section-container">
          <h2 className="section-title">Enterprise-Grade Security</h2>
          <p className="section-subtitle">Built for healthcare compliance and patient privacy</p>
          
          <div className="features-grid">
            <div className="feature-card card">
              <div className="feature-icon">
                <Database size={28} />
              </div>
              <h3>Immutable Audit Trail</h3>
              <p>Every access logged on Stellar blockchain with cryptographic proof and timestamps.</p>
            </div>
            
            <div className="feature-card card">
              <div className="feature-icon">
                <Shield size={28} />
              </div>
              <h3>Patient-Controlled Sharing</h3>
              <p>Grant and revoke provider access instantly with smart contract permissions.</p>
            </div>
            
            <div className="feature-card card">
              <div className="feature-icon">
                <Lock size={28} />
              </div>
              <h3>End-to-End Encryption</h3>
              <p>Your data is encrypted before upload. DHS never has access to plaintext records.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-container">
          <h2>Ready to take control of your health data?</h2>
          <p>Join the decentralized healthcare revolution today.</p>
          <div className="cta-actions">
            <Link to="/connect" className="btn btn-primary btn-large">
              Get Started Now
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-brand">
            <div className="logo">
              <Shield size={24} />
              <span>DHS</span>
            </div>
            <p>Decentralized Health System</p>
            <p className="footer-tagline">Patient-owned medical records on blockchain</p>
          </div>
          
          <div className="footer-links">
            <div className="footer-column">
              <h4>Product</h4>
              <a href="#features">Features</a>
              <a href="#pricing">Pricing</a>
              <a href="#docs">Documentation</a>
            </div>
            
            <div className="footer-column">
              <h4>Security</h4>
              <a href="#encryption">Encryption</a>
              <a href="#compliance">Compliance</a>
              <a href="#audit">Audit Trail</a>
            </div>
            
            <div className="footer-column">
              <h4>Company</h4>
              <a href="#about">About</a>
              <a href="#blog">Blog</a>
              <a href="#contact">Contact</a>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>© 2025 DHS Protocol. All rights reserved.</p>
          <p>Powered by Stellar + IPFS</p>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
