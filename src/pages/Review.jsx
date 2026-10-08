import { useState } from 'react';
import RiskBadge from '../components/RiskBadge';
import { reviewRecords as initialRecords } from '../data/demoData';

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

const decisionOptions = [
  { key: 'verified', label: 'Verified', cls: 'verified' },
  { key: 'rejected', label: 'Rejected', cls: 'rejected' },
  { key: 'investigation', label: 'Needs Investigation', cls: 'investigation' },
];

export default function Review() {
  const [records, setRecords] = useState(initialRecords);
  const [decisions, setDecisions] = useState({});
  const [comments, setComments] = useState({});
  const [toast, setToast] = useState(null);

  const handleDecision = (recordId, decision) => {
    setDecisions((prev) => ({ ...prev, [recordId]: decision }));
  };

  const handleComment = (recordId, value) => {
    setComments((prev) => ({ ...prev, [recordId]: value }));
  };

  const handleSubmit = (recordId) => {
    const decision = decisions[recordId];
    if (!decision) return;

    // Update local state — later replace with API call
    setRecords((prev) =>
      prev.map((r) =>
        r.id === recordId ? { ...r, decision, comments: comments[recordId] || '' } : r
      )
    );

    setToast(`Review submitted for ${recordId}`);
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div>
      <div className="page-title">
        <h1>Review Flagged Invoices</h1>
        <p>Verify or escalate invoices flagged for anomalies.</p>
      </div>

      {records.map((record) => {
        const currentDecision = record.decision || decisions[record.id] || null;
        const isSubmitted = !!record.decision;

        return (
          <div className="review-card" key={record.id}>
            <div className="review-card-top">
              <div className="review-card-info">
                <h3>{record.invoiceId} — {record.shop}</h3>
                <p>Review ID: {record.id}</p>
              </div>
              <RiskBadge level={record.risk} />
            </div>

            <div className="review-card-body">
              <div className="review-meta">
                <div className="review-meta-item">
                  <span className="review-meta-label">Amount</span>
                  <span className="review-meta-value">{formatCurrency(record.amount)}</span>
                </div>
                <div className="review-meta-item">
                  <span className="review-meta-label">Anomaly Score</span>
                  <span className="review-meta-value">{record.anomalyScore.toFixed(2)}</span>
                </div>
                <div className="review-meta-item">
                  <span className="review-meta-label">Risk Level</span>
                  <span className="review-meta-value">{record.risk}</span>
                </div>
              </div>

              <div className="review-reasons">
                <h4>Detected Reasons</h4>
                <ul>
                  {record.reasons.map((reason, idx) => (
                    <li key={idx}>{reason}</li>
                  ))}
                </ul>
              </div>

              {isSubmitted ? (
                <div style={{
                  padding: '16px',
                  background: 'var(--gray-50)',
                  borderRadius: 'var(--border-radius-sm)',
                  fontSize: '0.875rem',
                  color: 'var(--gray-600)',
                }}>
                  <strong>Decision:</strong>{' '}
                  <span className={`status-badge ${record.decision}`}>
                    {decisionOptions.find(d => d.key === record.decision)?.label || record.decision}
                  </span>
                  {record.comments && (
                    <div style={{ marginTop: '8px' }}>
                      <strong>Comments:</strong> {record.comments}
                    </div>
                  )}
                </div>
              ) : (
                <div className="review-form">
                  <label>Reviewer Decision</label>
                  <div className="review-decision" style={{ marginBottom: '16px' }}>
                    {decisionOptions.map((opt) => (
                      <button
                        key={opt.key}
                        className={`decision-btn ${currentDecision === opt.key ? `selected ${opt.cls}` : ''}`}
                        onClick={() => handleDecision(record.id, opt.key)}
                        type="button"
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>

                  <label htmlFor={`comment-${record.id}`}>Comments</label>
                  <textarea
                    id={`comment-${record.id}`}
                    placeholder="Add reviewer notes or comments..."
                    value={comments[record.id] || ''}
                    onChange={(e) => handleComment(record.id, e.target.value)}
                  />

                  <div className="review-form-actions">
                    <button
                      className="btn btn-primary"
                      onClick={() => handleSubmit(record.id)}
                      disabled={!currentDecision}
                      style={{ opacity: currentDecision ? 1 : 0.5 }}
                    >
                      Submit Review
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })}

      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}
