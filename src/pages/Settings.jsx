import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Settings as SettingsIcon, User, Bell, Shield, Globe } from 'lucide-react';
import { useContract } from '../hooks/useContract';
import './Dashboard.css';

function Settings() {
  const { userAddress, balance } = useContract();
  
  return (
    <div className="dashboard-layout">
      <div className="main-content" style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ marginBottom: '2rem' }}>
          <Link to="/dashboard" className="btn btn-ghost">
            <ArrowLeft size={18} />
            Back to Dashboard
          </Link>
        </div>
        
        <SettingsIcon size={64} style={{ color: 'var(--dhs-primary)', marginBottom: '1rem' }} />
        <h1>Account Settings</h1>
        <p style={{ color: 'var(--dhs-text-secondary)', marginBottom: '3rem' }}>
          Manage your DHS account and preferences
        </p>
        
        <div className="card" style={{ padding: '2rem', marginBottom: '1.5rem', textAlign: 'left' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <User size={24} style={{ color: 'var(--dhs-primary)' }} />
            <h3>Wallet Information</h3>
          </div>
          <div style={{ marginLeft: '2.5rem' }}>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ fontSize: '14px', color: 'var(--dhs-text-secondary)' }}>Wallet Address</label>
              <div style={{ 
                padding: '0.75rem', 
                background: 'var(--dhs-bg-secondary)', 
                borderRadius: '4px',
                fontFamily: 'monospace',
                fontSize: '14px',
                marginTop: '0.5rem'
              }}>
                {userAddress || 'Not connected'}
              </div>
            </div>
            <div>
              <label style={{ fontSize: '14px', color: 'var(--dhs-text-secondary)' }}>DHS Token Balance</label>
              <div style={{ 
                padding: '0.75rem', 
                background: 'var(--dhs-bg-secondary)', 
                borderRadius: '4px',
                fontSize: '18px',
                fontWeight: '600',
                marginTop: '0.5rem'
              }}>
                {balance.toFixed(2)} DHS
              </div>
            </div>
          </div>
        </div>
        
        <div className="card" style={{ padding: '2rem', marginBottom: '1.5rem', textAlign: 'left' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <Bell size={24} style={{ color: 'var(--dhs-primary)' }} />
            <h3>Notifications</h3>
          </div>
          <div style={{ marginLeft: '2.5rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <input type="checkbox" defaultChecked />
              <span>Email notifications for new records</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <input type="checkbox" defaultChecked />
              <span>Alert when records are accessed</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input type="checkbox" />
              <span>Weekly activity summary</span>
            </label>
          </div>
        </div>
        
        <div className="card" style={{ padding: '2rem', marginBottom: '1.5rem', textAlign: 'left' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <Shield size={24} style={{ color: 'var(--dhs-primary)' }} />
            <h3>Privacy & Security</h3>
          </div>
          <div style={{ marginLeft: '2.5rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <input type="checkbox" defaultChecked />
              <span>Require signature for all transactions</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <input type="checkbox" defaultChecked />
              <span>Enable two-factor authentication</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input type="checkbox" />
              <span>Auto-lock after 15 minutes</span>
            </label>
          </div>
        </div>
        
        <div className="card" style={{ padding: '2rem', textAlign: 'left' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <Globe size={24} style={{ color: 'var(--dhs-primary)' }} />
            <h3>Network</h3>
          </div>
          <div style={{ marginLeft: '2.5rem' }}>
            <div style={{ 
              padding: '0.75rem', 
              background: 'var(--dhs-bg-secondary)', 
              borderRadius: '4px',
              marginTop: '0.5rem'
            }}>
              <div className="badge badge-info">Stellar Testnet</div>
              <p style={{ fontSize: '14px', color: 'var(--dhs-text-secondary)', marginTop: '0.5rem' }}>
                Connected to Stellar testnet for development
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;
