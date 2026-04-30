import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import { isConnected, getAddress, requestAccess } from '@stellar/freighter-api';
import './WalletConnect.css';

function WalletConnect() {
  const [status, setStatus] = useState('idle'); // idle, connecting, connected, error
  const [walletAddress, setWalletAddress] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const connectWallet = async () => {
    setStatus('connecting');
    setError('');
    
    try {
      // Check if Freighter is installed
      const { isConnected: freighterInstalled } = await isConnected();
      
      if (!freighterInstalled) {
        throw new Error('Freighter wallet not found. Please install the Freighter browser extension.');
      }
      
      // Request access to wallet
      const accessResult = await requestAccess();
      
      if (accessResult.error) {
        throw new Error(accessResult.error.message || 'Failed to get wallet access');
      }
      
      // Get wallet address
      const addressResult = await getAddress();
      
      if (addressResult.error) {
        throw new Error(addressResult.error.message || 'Failed to get wallet address');
      }
      
      const publicKey = addressResult.address;
      
      if (!publicKey) {
        throw new Error('Failed to get wallet address. Please try again.');
      }
      
      setWalletAddress(publicKey);
      setStatus('connected');
      
      console.log('✅ Wallet connected:', publicKey);
      
      // Redirect to dashboard
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } catch (err) {
      console.error('❌ Wallet connection failed:', err);
      setStatus('error');
      setError(err.message || 'Connection rejected. Please try again.');
    }
  };

  return (
    <div className="wallet-connect-page">
      <div className="wallet-container">
        {status === 'idle' && (
          <div className="wallet-card">
            <div className="wallet-icon-wrapper">
              <Shield size={48} />
            </div>
            
            <h1 className="wallet-title">Connect Your Wallet</h1>
            <p className="wallet-description">
              Use Freighter to securely access DHS with your Stellar identity
            </p>
            
            <button className="wallet-connect-button" onClick={connectWallet}>
              <div className="wallet-button-icon">
                <Shield size={24} />
              </div>
              <div className="wallet-button-content">
                <div className="wallet-button-title">Freighter Wallet</div>
                <div className="badge badge-info">Recommended</div>
              </div>
            </button>
            
            <a 
              href="https://www.freighter.app/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="wallet-link"
            >
              Don't have Freighter? Install it here
            </a>
            
            <div className="wallet-security-note">
              <Shield size={16} />
              <span>Your keys never leave your device</span>
            </div>
          </div>
        )}
        
        {status === 'connecting' && (
          <div className="wallet-card">
            <div className="wallet-icon-wrapper connecting">
              <div className="pulse-ring"></div>
              <Shield size={48} />
            </div>
            
            <h1 className="wallet-title">Connecting...</h1>
            <p className="wallet-description">
              Please approve the connection in Freighter
            </p>
            
            <div className="spinner-wrapper">
              <Loader className="spinner-icon" size={32} />
            </div>
            
            <button className="btn btn-ghost" onClick={() => setStatus('idle')}>
              Cancel
            </button>
          </div>
        )}
        
        {status === 'connected' && (
          <div className="wallet-card">
            <div className="wallet-icon-wrapper success">
              <CheckCircle size={48} />
            </div>
            
            <h1 className="wallet-title">Connected!</h1>
            
            <div className="wallet-address-display">
              {walletAddress.slice(0, 8)}...{walletAddress.slice(-8)}
            </div>
            
            <div className="badge badge-info">Stellar Testnet</div>
            
            <p className="wallet-description">
              Redirecting to dashboard...
            </p>
            
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: '100%' }}></div>
            </div>
          </div>
        )}
        
        {status === 'error' && (
          <div className="wallet-card">
            <div className="wallet-icon-wrapper error">
              <AlertCircle size={48} />
            </div>
            
            <h1 className="wallet-title">Connection Failed</h1>
            <p className="wallet-description error-text">
              {error}
            </p>
            
            <div className="wallet-actions">
              <button className="btn btn-primary" onClick={connectWallet}>
                Try Again
              </button>
              <button className="btn btn-ghost" onClick={() => navigate('/')}>
                Go Back
              </button>
            </div>
            
            {error.includes('not found') && (
              <a 
                href="https://www.freighter.app/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn btn-secondary"
                style={{ marginTop: '1rem' }}
              >
                Install Freighter
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default WalletConnect;
