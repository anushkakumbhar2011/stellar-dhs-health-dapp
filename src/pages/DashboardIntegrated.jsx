import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  LayoutDashboard, FileText, Upload, Activity, Settings, 
  Search, Bell, LogOut, Copy, CheckCircle, Clock, 
  AlertCircle, Download, Share2, MoreVertical, Grid3x3, List,
  CloudUpload, FileCheck, Coins
} from 'lucide-react';
import { useContract } from '../hooks/useContract';
import './Dashboard.css';

function DashboardIntegrated() {
  const {
    isConnected,
    userAddress,
    balance,
    records,
    recordCount,
    loading,
    error,
    addRecord,
    getRecords,
    refresh,
    clearError,
    checkConnection,
    rewardAmount,
  } = useContract();

  const [viewMode, setViewMode] = useState('card');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  // Load records on mount
  useEffect(() => {
    if (isConnected) {
      loadRecords();
    }
  }, [isConnected]);

  const loadRecords = async () => {
    try {
      await getRecords();
    } catch (err) {
      console.error('Failed to load records:', err);
    }
  };

  /**
   * Handle file upload with IPFS + Blockchain integration
   */
  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadProgress(0);
    setUploadError(null);
    setUploadSuccess(false);

    try {
      // Step 1: Upload to IPFS (simulated - replace with actual IPFS upload)
      setUploadProgress(30);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulated IPFS CID (replace with actual Pinata/IPFS upload)
      const mockCID = `Qm${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
      
      setUploadProgress(60);
      
      // Step 2: Store CID on blockchain
      const recordName = file.name.replace(/\.[^/.]+$/, ''); // Remove extension
      const recordType = getRecordType(file.type);
      
      await addRecord(mockCID, recordName, recordType);
      
      setUploadProgress(100);
      setUploadSuccess(true);
      
      // Refresh records list
      await loadRecords();
      
      // Reset after 3 seconds
      setTimeout(() => {
        setUploading(false);
        setUploadSuccess(false);
        setUploadProgress(0);
      }, 3000);
      
    } catch (err) {
      console.error('Upload failed:', err);
      setUploadError(err.message || 'Upload failed');
      setUploading(false);
    }
  };

  /**
   * Determine record type from file MIME type
   */
  const getRecordType = (mimeType) => {
    if (mimeType.includes('pdf')) return 'pdf_document';
    if (mimeType.includes('image')) return 'image_scan';
    if (mimeType.includes('dicom')) return 'dicom_scan';
    return 'other';
  };

  /**
   * Copy text to clipboard
   */
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    // Could add a toast notification here
  };

  /**
   * Format address for display
   */
  const formatAddress = (address) => {
    if (!address) return 'Not Connected';
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  // Show connection prompt if not connected
  if (!isConnected) {
    return (
      <div className="dashboard-layout">
        <div className="connection-prompt">
          <AlertCircle size={48} />
          <h2>Wallet Not Connected</h2>
          <p>Please connect your Freighter wallet to access the dashboard</p>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
            <Link to="/connect" className="btn btn-primary">
              Connect Wallet
            </Link>
            <button 
              onClick={async () => {
                await checkConnection();
              }} 
              className="btn btn-secondary"
            >
              Check Connection
            </button>
          </div>
          <p style={{ marginTop: '1rem', fontSize: '14px', color: 'var(--dhs-text-tertiary)' }}>
            Already connected? Click "Check Connection" to refresh
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <Activity size={24} />
            <span>DHS</span>
          </div>
        </div>
        
        <nav className="sidebar-nav">
          <div className="nav-section">
            <div className="nav-label">MAIN</div>
            <Link to="/dashboard" className="nav-item active">
              <LayoutDashboard size={20} />
              <span>Dashboard</span>
            </Link>
            <Link to="/my-records" className="nav-item">
              <FileText size={20} />
              <span>My Records</span>
            </Link>
            <Link to="/upload" className="nav-item">
              <Upload size={20} />
              <span>Upload Record</span>
            </Link>
            <Link to="/shared" className="nav-item">
              <Share2 size={20} />
              <span>Shared With Me</span>
            </Link>
          </div>
          
          <div className="nav-section">
            <div className="nav-label">ACTIVITY</div>
            <Link to="/activity" className="nav-item">
              <Activity size={20} />
              <span>Transaction History</span>
            </Link>
            <Link to="/access-log" className="nav-item">
              <FileCheck size={20} />
              <span>Access Log</span>
            </Link>
          </div>
          
          <div className="nav-section">
            <div className="nav-label">SETTINGS</div>
            <Link to="/settings" className="nav-item">
              <Settings size={20} />
              <span>Account</span>
            </Link>
          </div>
        </nav>
        
        <div className="sidebar-footer">
          <div className="wallet-info">
            <div className="wallet-address">
              {formatAddress(userAddress)}
              <button 
                className="btn-icon"
                onClick={() => copyToClipboard(userAddress)}
                title="Copy address"
              >
                <Copy size={14} />
              </button>
            </div>
            <div className="badge badge-info">Testnet</div>
          </div>
          <Link 
            to="/" 
            className="btn btn-ghost btn-icon" 
            title="Disconnect"
            onClick={() => {
              // Clear cache and redirect to home
              window.location.href = '/';
            }}
          >
            <LogOut size={18} />
          </Link>
        </div>
      </aside>
      
      {/* Main Content */}
      <main className="main-content">
        {/* Top Bar */}
        <header className="topbar">
          <h1 className="page-title">Dashboard</h1>
          
          <div className="topbar-actions">
            <div className="search-bar">
              <Search size={18} />
              <input type="text" placeholder="Search records..." />
            </div>
            
            <button className="btn-icon notification-btn">
              <Bell size={20} />
              <span className="notification-dot"></span>
            </button>
            
            <div className="user-avatar">
              <Activity size={20} />
            </div>
          </div>
        </header>
        
        {/* Error Display */}
        {error && (
          <div className="alert alert-error">
            <AlertCircle size={20} />
            <span>{error}</span>
            <button onClick={clearError} className="btn-icon">×</button>
          </div>
        )}
        
        {/* Stats Row */}
        <div className="stats-row">
          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'rgba(99, 102, 241, 0.1)', color: '#6366F1' }}>
              <FileText size={24} />
            </div>
            <div className="stat-content">
              <div className="stat-value">{recordCount}</div>
              <div className="stat-label">Total Records</div>
              <div className="stat-sublabel">On-chain verified</div>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10B981' }}>
              <CheckCircle size={24} />
            </div>
            <div className="stat-content">
              <div className="stat-value">{recordCount}</div>
              <div className="stat-label">Verified On-Chain</div>
              <div className="stat-sublabel">Blockchain anchored</div>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'rgba(255, 107, 157, 0.1)', color: '#FF6B9D' }}>
              <Coins size={24} />
            </div>
            <div className="stat-content">
              <div className="stat-value">{balance.toFixed(2)}</div>
              <div className="stat-label">DHS Tokens</div>
              <div className="stat-sublabel">+{rewardAmount} per upload</div>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'rgba(6, 182, 212, 0.1)', color: '#06B6D4' }}>
              <Clock size={24} />
            </div>
            <div className="stat-content">
              <div className="stat-value">{records.length > 0 ? 'Recent' : 'None'}</div>
              <div className="stat-label">Last Activity</div>
              <div className="stat-sublabel">
                {records.length > 0 ? records[0]?.date : 'No records yet'}
              </div>
            </div>
          </div>
        </div>
        
        {/* Upload Zone */}
        <div className="upload-section">
          <div className={`upload-zone ${uploading ? 'uploading' : ''}`}>
            {!uploading ? (
              <>
                <div className="upload-icon">
                  <CloudUpload size={48} />
                </div>
                <h3>Drag & drop your medical record</h3>
                <p>or</p>
                <label className="btn btn-secondary" style={{ cursor: 'pointer' }}>
                  Browse Files
                  <input
                    type="file"
                    onChange={handleFileUpload}
                    style={{ display: 'none' }}
                    accept=".pdf,.jpg,.jpeg,.png,.dcm"
                  />
                </label>
                <div className="upload-formats">
                  <span className="badge badge-info">PDF</span>
                  <span className="badge badge-info">DICOM</span>
                  <span className="badge badge-info">JPG</span>
                  <span className="badge badge-info">PNG</span>
                </div>
                <p style={{ marginTop: '1rem', fontSize: '14px', color: 'var(--dhs-text-tertiary)' }}>
                  💰 Earn {rewardAmount} DHS tokens for each upload!
                </p>
              </>
            ) : (
              <div className="upload-progress">
                <div className="upload-progress-header">
                  <div>
                    <div className="upload-filename">Uploading to blockchain...</div>
                    <div className="upload-filesize">
                      {uploadProgress < 60 ? 'Uploading to IPFS...' : 'Storing on Stellar...'}
                    </div>
                  </div>
                  {uploadSuccess && (
                    <CheckCircle size={24} style={{ color: '#10B981' }} />
                  )}
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${uploadProgress}%` }}></div>
                </div>
                <div className="upload-status">
                  {uploadProgress < 100 
                    ? `Processing... ${uploadProgress}%` 
                    : `✅ Success! Earned ${rewardAmount} DHS tokens`
                  }
                </div>
                {uploadError && (
                  <div className="upload-error" style={{ color: '#EF4444', marginTop: '1rem' }}>
                    ❌ {uploadError}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        
        {/* Records Section */}
        <div className="records-section">
          <div className="records-header">
            <h2>Your Medical Records ({records.length})</h2>
            <div className="records-controls">
              <button 
                className="btn btn-ghost"
                onClick={refresh}
                disabled={loading}
              >
                {loading ? 'Loading...' : 'Refresh'}
              </button>
              <div className="view-toggle">
                <button 
                  className={`btn-icon ${viewMode === 'card' ? 'active' : ''}`}
                  onClick={() => setViewMode('card')}
                >
                  <Grid3x3 size={18} />
                </button>
                <button 
                  className={`btn-icon ${viewMode === 'table' ? 'active' : ''}`}
                  onClick={() => setViewMode('table')}
                >
                  <List size={18} />
                </button>
              </div>
            </div>
          </div>
          
          {loading && records.length === 0 ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Loading records from blockchain...</p>
            </div>
          ) : records.length === 0 ? (
            <div className="empty-state">
              <FileText size={48} />
              <h3>No Records Yet</h3>
              <p>Upload your first medical record to get started</p>
            </div>
          ) : viewMode === 'card' ? (
            <div className="records-grid">
              {records.map((record, index) => (
                <Link to={`/record/${record.id}`} key={index} className="record-card">
                  <div className="record-card-header">
                    <div className="record-type-icon">
                      <FileText size={24} />
                    </div>
                    <button className="btn-icon">
                      <MoreVertical size={18} />
                    </button>
                  </div>
                  
                  <h3 className="record-name">{record.name}</h3>
                  <div className="record-meta">
                    <span>{record.recordType}</span>
                    <span>•</span>
                    <span>{new Date(record.timestamp * 1000).toLocaleDateString()}</span>
                  </div>
                  
                  <div className="record-cid">
                    <span className="cid-label">CID:</span>
                    <span className="cid-value">{record.cid.slice(0, 12)}...</span>
                    <button 
                      className="btn-icon"
                      onClick={(e) => {
                        e.preventDefault();
                        copyToClipboard(record.cid);
                      }}
                    >
                      <Copy size={14} />
                    </button>
                  </div>
                  
                  <div className="record-footer">
                    <div className="badge badge-verified">
                      <CheckCircle size={12} />
                      Verified
                    </div>
                    
                    <div className="record-actions">
                      <a 
                        href={record.ipfsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-icon"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Download size={16} />
                      </a>
                      <button className="btn-icon">
                        <Share2 size={16} />
                      </button>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="records-table">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Type</th>
                    <th>Date Uploaded</th>
                    <th>CID</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((record, index) => (
                    <tr key={index}>
                      <td>
                        <div className="table-record-name">
                          <FileText size={18} />
                          {record.name}
                        </div>
                      </td>
                      <td>{record.recordType}</td>
                      <td>{new Date(record.timestamp * 1000).toLocaleDateString()}</td>
                      <td>
                        <div className="table-cid">
                          {record.cid.slice(0, 16)}...
                          <button 
                            className="btn-icon"
                            onClick={() => copyToClipboard(record.cid)}
                          >
                            <Copy size={14} />
                          </button>
                        </div>
                      </td>
                      <td>
                        <div className="badge badge-verified">
                          <CheckCircle size={12} />
                          Verified
                        </div>
                      </td>
                      <td>
                        <div className="table-actions">
                          <a 
                            href={record.ipfsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-icon"
                          >
                            <Download size={16} />
                          </a>
                          <button className="btn-icon">
                            <Share2 size={16} />
                          </button>
                          <button className="btn-icon">
                            <MoreVertical size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default DashboardIntegrated;
