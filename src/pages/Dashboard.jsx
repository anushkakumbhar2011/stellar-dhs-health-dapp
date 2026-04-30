import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  LayoutDashboard, FileText, Upload, Activity, Settings, 
  Search, Bell, LogOut, Copy, CheckCircle, Clock, 
  AlertCircle, Download, Share2, MoreVertical, Grid3x3, List,
  CloudUpload, FileCheck
} from 'lucide-react';
import './Dashboard.css';

function Dashboard() {
  const [viewMode, setViewMode] = useState('card'); // card or table
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const mockRecords = [
    {
      id: 1,
      name: 'Blood Test Results - March 2025',
      type: 'PDF',
      date: '2025-03-15',
      cid: 'QmX7Kd9fH3pQ2vR8sT1uW6yZ4aB5cD7eF9gH2iJ3kL4mN5',
      status: 'verified'
    },
    {
      id: 2,
      name: 'MRI Scan - Brain',
      type: 'DICOM',
      date: '2025-03-10',
      cid: 'QmP9Qr8sT1uV2wX3yZ4aB5cD6eF7gH8iJ9kL0mN1oP2qR',
      status: 'verified'
    },
    {
      id: 3,
      name: 'Prescription - Dr. Smith',
      type: 'PDF',
      date: '2025-03-08',
      cid: 'QmY5Zz6aA7bB8cC9dD0eE1fF2gG3hH4iI5jJ6kK7lL8mM',
      status: 'pending'
    }
  ];

  const handleFileUpload = () => {
    setUploading(true);
    setUploadProgress(0);
    
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setUploading(false), 1000);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

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
            <Link to="/dashboard" className="nav-item">
              <FileText size={20} />
              <span>My Records</span>
            </Link>
            <Link to="/dashboard" className="nav-item">
              <Upload size={20} />
              <span>Upload Record</span>
            </Link>
            <Link to="/dashboard" className="nav-item">
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
            <Link to="/dashboard" className="nav-item">
              <FileCheck size={20} />
              <span>Access Log</span>
            </Link>
          </div>
          
          <div className="nav-section">
            <div className="nav-label">SETTINGS</div>
            <Link to="/dashboard" className="nav-item">
              <Settings size={20} />
              <span>Account</span>
            </Link>
          </div>
        </nav>
        
        <div className="sidebar-footer">
          <div className="wallet-info">
            <div className="wallet-address">
              GBXX...YYYY
              <button className="btn-icon">
                <Copy size={14} />
              </button>
            </div>
            <div className="badge badge-info">Testnet</div>
          </div>
          <button className="btn btn-ghost btn-icon">
            <LogOut size={18} />
          </button>
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
        
        {/* Stats Row */}
        <div className="stats-row">
          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'rgba(37, 99, 235, 0.1)', color: 'var(--color-primary)' }}>
              <FileText size={24} />
            </div>
            <div className="stat-content">
              <div className="stat-value">12</div>
              <div className="stat-label">Total Records</div>
              <div className="stat-sublabel">IPFS-stored files</div>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--color-accent)' }}>
              <CheckCircle size={24} />
            </div>
            <div className="stat-content">
              <div className="stat-value">10</div>
              <div className="stat-label">Verified On-Chain</div>
              <div className="stat-sublabel">Blockchain anchored</div>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'rgba(245, 158, 11, 0.1)', color: 'var(--color-warning)' }}>
              <Share2 size={24} />
            </div>
            <div className="stat-content">
              <div className="stat-value">3</div>
              <div className="stat-label">Shared Records</div>
              <div className="stat-sublabel">Active permissions</div>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'rgba(148, 163, 184, 0.1)', color: 'var(--color-text-secondary)' }}>
              <Clock size={24} />
            </div>
            <div className="stat-content">
              <div className="stat-value">2h ago</div>
              <div className="stat-label">Last Activity</div>
              <div className="stat-sublabel">Record uploaded</div>
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
                <button className="btn btn-secondary" onClick={handleFileUpload}>
                  Browse Files
                </button>
                <div className="upload-formats">
                  <span className="badge badge-info">PDF</span>
                  <span className="badge badge-info">DICOM</span>
                  <span className="badge badge-info">JPG</span>
                  <span className="badge badge-info">PNG</span>
                </div>
              </>
            ) : (
              <div className="upload-progress">
                <div className="upload-progress-header">
                  <div>
                    <div className="upload-filename">blood-test-results.pdf</div>
                    <div className="upload-filesize">2.4 MB</div>
                  </div>
                  {uploadProgress === 100 && (
                    <CheckCircle size={24} style={{ color: 'var(--color-accent)' }} />
                  )}
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${uploadProgress}%` }}></div>
                </div>
                <div className="upload-status">
                  {uploadProgress < 100 ? 'Uploading to IPFS...' : 'Successfully pinned to IPFS'}
                </div>
                {uploadProgress === 100 && (
                  <div className="code-block" style={{ marginTop: 'var(--space-4)' }}>
                    QmX7Kd9fH3pQ2vR8sT1uW6yZ4aB5cD7eF9gH2iJ3kL4mN5
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        
        {/* Records Section */}
        <div className="records-section">
          <div className="records-header">
            <h2>Recent Records</h2>
            <div className="records-controls">
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
          
          {viewMode === 'card' ? (
            <div className="records-grid">
              {mockRecords.map(record => (
                <Link to={`/record/${record.id}`} key={record.id} className="record-card">
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
                    <span>{record.type}</span>
                    <span>•</span>
                    <span>{record.date}</span>
                  </div>
                  
                  <div className="record-cid">
                    <span className="cid-label">CID:</span>
                    <span className="cid-value">{record.cid.slice(0, 12)}...</span>
                    <button className="btn-icon">
                      <Copy size={14} />
                    </button>
                  </div>
                  
                  <div className="record-footer">
                    {record.status === 'verified' ? (
                      <div className="badge badge-verified">
                        <CheckCircle size={12} />
                        Verified
                      </div>
                    ) : (
                      <div className="badge badge-pending">
                        <Clock size={12} />
                        Pending
                      </div>
                    )}
                    
                    <div className="record-actions">
                      <button className="btn-icon">
                        <Download size={16} />
                      </button>
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
                  {mockRecords.map(record => (
                    <tr key={record.id}>
                      <td>
                        <div className="table-record-name">
                          <FileText size={18} />
                          {record.name}
                        </div>
                      </td>
                      <td>{record.type}</td>
                      <td>{record.date}</td>
                      <td>
                        <div className="table-cid">
                          {record.cid.slice(0, 16)}...
                          <button className="btn-icon">
                            <Copy size={14} />
                          </button>
                        </div>
                      </td>
                      <td>
                        {record.status === 'verified' ? (
                          <div className="badge badge-verified">
                            <CheckCircle size={12} />
                            Verified
                          </div>
                        ) : (
                          <div className="badge badge-pending">
                            <Clock size={12} />
                            Pending
                          </div>
                        )}
                      </td>
                      <td>
                        <div className="table-actions">
                          <button className="btn-icon">
                            <Download size={16} />
                          </button>
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

export default Dashboard;
