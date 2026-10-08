import { useNavigate } from 'react-router-dom';

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function RiskResult({ result, formData, onBack }) {
  const navigate = useNavigate();
  const isHigh = result.risk === 'High';

  return (
    <div>
      <button className="back-link" onClick={onBack}>
        ← Back to form
      </button>

      <div className="result-card">
        <div className={`result-banner ${isHigh ? 'high' : 'low'}`}>
          <div className="result-icon">
            {isHigh ? '⚠' : '✓'}
          </div>
          <div className="result-label">{result.label}</div>
        </div>

        <div className="result-details">
          <div className="result-meta">
            <div className="result-meta-item">
              <span className="result-meta-label">Invoice ID</span>
              <span className="result-meta-value">{formData.invoiceNumber}</span>
            </div>
            <div className="result-meta-item">
              <span className="result-meta-label">Shop / MSME</span>
              <span className="result-meta-value">{formData.shop}</span>
            </div>
            <div className="result-meta-item">
              <span className="result-meta-label">Anomaly Score</span>
              <span className="result-meta-value">{result.anomalyScore.toFixed(2)}</span>
            </div>
            <div className="result-meta-item">
              <span className="result-meta-label">Historical Average</span>
              <span className="result-meta-value">{formatCurrency(result.historicalAvg)}</span>
            </div>
            <div className="result-meta-item">
              <span className="result-meta-label">Current Invoice</span>
              <span className="result-meta-value">{formatCurrency(result.currentAmount)}</span>
            </div>
          </div>

          <div className={`result-message ${isHigh ? 'high' : 'low'}`}>
            {result.message}
          </div>

          <div className="result-indicators">
            {result.indicators.map((ind, idx) => (
              <div className="indicator-item" key={idx}>
                <span className={`indicator-icon ${ind.type}`}>
                  {ind.type === 'success' ? '✓' : '!'}
                </span>
                <span>{ind.text}</span>
              </div>
            ))}
          </div>

          <div className="result-actions">
            <button className="btn btn-secondary" onClick={() => navigate('/profiles')}>
              View Shop Profile
            </button>
            <button className="btn btn-primary" onClick={() => navigate('/review')}>
              Review Invoice
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
