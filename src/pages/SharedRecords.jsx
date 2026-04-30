import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Share2, FileText, AlertCircle } from 'lucide-react';
import './Dashboard.css';

function SharedRecords() {
  return (
    <div className="dashboard-layout">
      <div className="main-content" style={{ padding: '40px', textAlign: 'center' }}>
        <Share2 size={64} style={{ color: 'var(--dhs-primary)', marginBottom: '1rem' }} />
        <h1>Shared Records</h1>
        <p style={{ color: 'var(--dhs-text-secondary)', marginBottom: '2rem' }}>
          Records shared with you by healthcare providers will appear here
        </p>
        <div className="empty-state">
          <FileText size={48} />
          <h3>No Shared Records</h3>
          <p>You don't have any records shared with you yet</p>
        </div>
        <Link to="/dashboard" className="btn btn-primary" style={{ marginTop: '2rem' }}>
          <ArrowLeft size={18} />
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}

export default SharedRecords;
