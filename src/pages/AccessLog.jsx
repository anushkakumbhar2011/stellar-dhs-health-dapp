import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, FileCheck, Clock, Shield } from 'lucide-react';
import './Dashboard.css';

function AccessLog() {
  return (
    <div className="dashboard-layout">
      <div className="main-content" style={{ padding: '40px', textAlign: 'center' }}>
        <FileCheck size={64} style={{ color: 'var(--dhs-primary)', marginBottom: '1rem' }} />
        <h1>Access Log</h1>
        <p style={{ color: 'var(--dhs-text-secondary)', marginBottom: '2rem' }}>
          Track who has accessed your medical records
        </p>
        <div className="empty-state">
          <Shield size={48} />
          <h3>No Access Events</h3>
          <p>Your records haven't been accessed by anyone yet</p>
        </div>
        <Link to="/dashboard" className="btn btn-primary" style={{ marginTop: '2rem' }}>
          <ArrowLeft size={18} />
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}

export default AccessLog;
