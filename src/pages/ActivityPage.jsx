import { Link } from 'react-router-dom';
import { 
  ChevronLeft, Upload, Share2, XCircle, CheckCircle, 
  ExternalLink, Calendar, Filter, Download
} from 'lucide-react';
import './ActivityPage.css';

function ActivityPage() {
  const activities = [
    {
      id: 1,
      type: 'upload',
      title: 'Record Uploaded to IPFS',
      record: 'Blood Test Results - March 2025',
      cid: 'QmX7Kd9fH3pQ2vR8sT1uW6yZ4aB5cD7eF9gH2iJ3kL4mN5',
      txHash: '7a8b9c0d1e2f3g4h5i6j7k8l9m0n1o2p3q4r5s6t7u8v9w0x1y2z3a4b5c6d7e8f9',
      status: 'verified',
      time: '2 hours ago',
      date: 'Today'
    },
    {
      id: 2,
      type: 'share',
      title: 'Access Granted',
      record: 'MRI Scan - Brain',
      recipient: 'Dr. Sarah Smith',
      txHash: '8b9c0d1e2f3g4h5i6j7k8l9m0n1o2p3q4r5s6t7u8v9w0x1y2z3a4b5c6d7e8f9g0',
      status: 'verified',
      time: '5 hours ago',
      date: 'Today'
    },
    {
      id: 3,
      type: 'verify',
      title: 'Record Verified On-Chain',
      record: 'Prescription - Dr. Smith',
      txHash: '9c0d1e2f3g4h5i6j7k8l9m0n1o2p3q4r5s6t7u8v9w0x1y2z3a4b5c6d7e8f9g0h1',
      status: 'verified',
      time: '1 day ago',
      date: 'Yesterday'
    },
    {
      id: 4,
      type: 'revoke',
      title: 'Access Revoked',
      record: 'X-Ray Results',
      recipient: 'City Hospital',
      txHash: '0d1e2f3g4h5i6j7k8l9m0n1o2p3q4r5s6t7u8v9w0x1y2z3a4b5c6d7e8f9g0h1i2',
      status: 'verified',
      time: '2 days ago',
      date: 'Apr 27, 2025'
    }
  ];

  const getActivityIcon = (type) => {
    switch (type) {
      case 'upload':
        return { icon: Upload, color: 'var(--color-primary)' };
      case 'share':
        return { icon: Share2, color: '#A855F7' };
      case 'revoke':
        return { icon: XCircle, color: 'var(--color-warning)' };
      case 'verify':
        return { icon: CheckCircle, color: 'var(--color-accent)' };
      default:
        return { icon: CheckCircle, color: 'var(--color-primary)' };
    }
  };

  let currentDate = '';

  return (
    <div className="activity-page">
      <div className="activity-container">
        {/* Header */}
        <div className="activity-header">
          <div>
            <Link to="/dashboard" className="breadcrumb-link">
              <ChevronLeft size={16} />
              Back to Dashboard
            </Link>
            <h1 className="page-title">Transaction History</h1>
          </div>
          
          <div className="activity-actions">
            <button className="btn btn-secondary">
              <Filter size={18} />
              Filter
            </button>
            <button className="btn btn-secondary">
              <Download size={18} />
              Export CSV
            </button>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="filter-bar card">
          <div className="filter-group">
            <label>Date Range</label>
            <select className="input">
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>Last 90 days</option>
              <option>All time</option>
            </select>
          </div>
          
          <div className="filter-group">
            <label>Type</label>
            <select className="input">
              <option>All Types</option>
              <option>Upload</option>
              <option>Share</option>
              <option>Revoke</option>
              <option>Verify</option>
            </select>
          </div>
          
          <div className="filter-group">
            <label>Status</label>
            <select className="input">
              <option>All Status</option>
              <option>Verified</option>
              <option>Pending</option>
              <option>Failed</option>
            </select>
          </div>
          
          <div className="filter-group">
            <label>Search</label>
            <input 
              type="text" 
              className="input" 
              placeholder="Search by hash or record name..."
            />
          </div>
        </div>

        {/* Activity Timeline */}
        <div className="activity-timeline">
          {activities.map((activity) => {
            const showDate = currentDate !== activity.date;
            currentDate = activity.date;
            const { icon: Icon, color } = getActivityIcon(activity.type);

            return (
              <div key={activity.id}>
                {showDate && (
                  <div className="timeline-date">
                    <Calendar size={16} />
                    {activity.date}
                  </div>
                )}
                
                <div className="activity-card card">
                  <div className="activity-icon" style={{ background: `${color}15`, color }}>
                    <Icon size={24} />
                  </div>
                  
                  <div className="activity-content">
                    <div className="activity-main">
                      <h3 className="activity-title">{activity.title}</h3>
                      <div className="activity-details">
                        <span className="activity-record">{activity.record}</span>
                        {activity.recipient && (
                          <>
                            <span>→</span>
                            <span className="activity-recipient">{activity.recipient}</span>
                          </>
                        )}
                      </div>
                      {activity.cid && (
                        <div className="activity-cid">
                          <span className="cid-label">CID:</span>
                          <code>{activity.cid.slice(0, 20)}...</code>
                        </div>
                      )}
                    </div>
                    
                    <div className="activity-meta">
                      <div className="activity-time">{activity.time}</div>
                      <div className="activity-hash">
                        <code>{activity.txHash.slice(0, 16)}...</code>
                        <a 
                          href={`https://stellar.expert/explorer/testnet/tx/${activity.txHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hash-link"
                        >
                          <ExternalLink size={14} />
                        </a>
                      </div>
                      {activity.status === 'verified' ? (
                        <div className="badge badge-verified">
                          <CheckCircle size={12} />
                          Verified
                        </div>
                      ) : (
                        <div className="badge badge-pending">
                          <CheckCircle size={12} />
                          Pending
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Pagination */}
        <div className="pagination">
          <button className="btn btn-ghost" disabled>Previous</button>
          <div className="pagination-pages">
            <button className="pagination-page active">1</button>
            <button className="pagination-page">2</button>
            <button className="pagination-page">3</button>
          </div>
          <button className="btn btn-ghost">Next</button>
        </div>
      </div>
    </div>
  );
}

export default ActivityPage;
