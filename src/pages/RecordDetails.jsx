import { Link, useParams } from 'react-router-dom';
import { 
  ChevronLeft, FileText, Copy, ExternalLink, CheckCircle, 
  Shield, Calendar, User, Share2, Download, Trash2
} from 'lucide-react';
import './RecordDetails.css';

function RecordDetails() {
  const { id } = useParams();

  const mockRecord = {
    id,
    name: 'Blood Test Results - March 2025',
    type: 'PDF',
    size: '2.4 MB',
    uploadDate: '2025-03-15 14:32:00 UTC',
    cid: 'QmX7Kd9fH3pQ2vR8sT1uW6yZ4aB5cD7eF9gH2iJ3kL4mN5oP6qR7sT8uV9wX0yZ1',
    txHash: '7a8b9c0d1e2f3g4h5i6j7k8l9m0n1o2p3q4r5s6t7u8v9w0x1y2z3a4b5c6d7e8f9',
    owner: 'GBXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
    status: 'verified'
  };

  const accessList = [
    {
      address: 'GCYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY',
      role: 'View Only',
      grantedOn: '2025-03-16',
      name: 'Dr. Sarah Smith'
    },
    {
      address: 'GDZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZ',
      role: 'Full Access',
      grantedOn: '2025-03-17',
      name: 'City Hospital'
    }
  ];

  return (
    <div className="record-details-page">
      <div className="record-details-container">
        {/* Breadcrumb */}
        <div className="breadcrumb">
          <Link to="/dashboard" className="breadcrumb-link">
            <ChevronLeft size={16} />
            Back to Dashboard
          </Link>
        </div>

        <div className="record-details-layout">
          {/* Left Column - Record Info */}
          <div className="record-info-column">
            <div className="card">
              <div className="record-header">
                <div className="record-icon-large">
                  <FileText size={32} />
                </div>
                <div>
                  <h1 className="record-title">{mockRecord.name}</h1>
                  <div className="record-meta-row">
                    <span>{mockRecord.type}</span>
                    <span>•</span>
                    <span>{mockRecord.size}</span>
                    <span>•</span>
                    <span>{mockRecord.uploadDate}</span>
                  </div>
                </div>
              </div>

              <div className="record-tags">
                <span className="badge badge-info">Medical Report</span>
                <span className="badge badge-info">Lab Results</span>
              </div>
            </div>

            {/* Preview Section */}
            <div className="card">
              <h3 className="section-title">File Preview</h3>
              <div className="preview-placeholder">
                <div className="preview-blur">
                  <FileText size={64} />
                  <p>Preview locked for security</p>
                  <button className="btn btn-primary">
                    <Shield size={18} />
                    Unlock with Wallet Signature
                  </button>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="card">
              <h3 className="section-title">Actions</h3>
              <div className="action-buttons">
                <button className="btn btn-secondary">
                  <Download size={18} />
                  Download File
                </button>
                <button className="btn btn-secondary">
                  <Share2 size={18} />
                  Share Access
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Blockchain Proof */}
          <div className="blockchain-column">
            <div className="card glass">
              <div className="proof-header">
                <Shield size={24} style={{ color: 'var(--color-accent)' }} />
                <h3>Blockchain Proof</h3>
              </div>

              <div className="proof-section">
                <div className="proof-label">IPFS Content Identifier</div>
                <div className="proof-value">
                  <code>{mockRecord.cid}</code>
                  <button className="btn-icon">
                    <Copy size={16} />
                  </button>
                </div>
                <a href={`https://ipfs.io/ipfs/${mockRecord.cid}`} target="_blank" rel="noopener noreferrer" className="proof-link">
                  <ExternalLink size={14} />
                  View on IPFS
                </a>
              </div>

              <div className="proof-section">
                <div className="proof-label">Stellar Transaction Hash</div>
                <div className="proof-value">
                  <code>{mockRecord.txHash}</code>
                  <button className="btn-icon">
                    <Copy size={16} />
                  </button>
                </div>
                <a href={`https://stellar.expert/explorer/testnet/tx/${mockRecord.txHash}`} target="_blank" rel="noopener noreferrer" className="proof-link">
                  <ExternalLink size={14} />
                  View on Stellar Expert
                </a>
              </div>

              <div className="proof-section">
                <div className="proof-label">Owner Address</div>
                <div className="proof-value">
                  <code>{mockRecord.owner.slice(0, 12)}...{mockRecord.owner.slice(-12)}</code>
                  <span className="badge badge-info">You</span>
                </div>
              </div>

              <div className="proof-section">
                <div className="proof-label">Anchored On-Chain</div>
                <div className="proof-timestamp">
                  <Calendar size={16} />
                  {mockRecord.uploadDate}
                </div>
              </div>

              <div className="verification-badge">
                <CheckCircle size={20} />
                <div>
                  <div className="verification-title">✓ Verified</div>
                  <div className="verification-subtitle">Immutable Record</div>
                </div>
              </div>

              <button className="btn btn-ghost" style={{ width: '100%', marginTop: 'var(--space-4)' }}>
                Verify Independently
              </button>
            </div>
          </div>
        </div>

        {/* Access Control Section */}
        <div className="card access-control-section">
          <div className="access-header">
            <h3>Who Has Access</h3>
            <button className="btn btn-primary">
              <Share2 size={18} />
              Grant Access
            </button>
          </div>

          <div className="access-table">
            <table>
              <thead>
                <tr>
                  <th>Name / Address</th>
                  <th>Role</th>
                  <th>Granted On</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {accessList.map((access, index) => (
                  <tr key={index}>
                    <td>
                      <div className="access-user">
                        <User size={18} />
                        <div>
                          <div className="access-name">{access.name}</div>
                          <div className="access-address">
                            {access.address.slice(0, 8)}...{access.address.slice(-8)}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-info">{access.role}</span>
                    </td>
                    <td>{access.grantedOn}</td>
                    <td>
                      <button className="btn btn-danger btn-sm">Revoke</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="card danger-zone">
          <h3>Danger Zone</h3>
          <p>Deleting this record will remove it from your dashboard. Note: The file will remain on IPFS and the blockchain record is permanent.</p>
          <button className="btn btn-danger">
            <Trash2 size={18} />
            Delete Record
          </button>
        </div>
      </div>
    </div>
  );
}

export default RecordDetails;
