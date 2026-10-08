import { useParams, useNavigate } from 'react-router-dom';
import RiskBadge from '../components/RiskBadge';
import { shops } from '../data/demoData';

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export default function MSMEDetail() {
  const { shopId } = useParams();
  const navigate = useNavigate();

  const shop = shops.find((s) => s.id === shopId);

  if (!shop) {
    return (
      <div>
        <button className="back-link" onClick={() => navigate('/profiles')}>
          ← Back to Profiles
        </button>
        <div className="card">
          <div className="card-body" style={{ textAlign: 'center', padding: '48px', color: 'var(--gray-500)' }}>
            Shop not found.
          </div>
        </div>
      </div>
    );
  }

  const riskBadgeLevel = shop.riskStatus === 'High Risk' ? 'High' : shop.riskStatus === 'Review' ? 'Medium' : 'Low';
  const initials = shop.name.split(' ').map(w => w[0]).join('').slice(0, 2);

  return (
    <div>
      <button className="back-link" onClick={() => navigate('/profiles')}>
        ← Back to Profiles
      </button>

      <div className="card" style={{ marginBottom: '24px' }}>
        <div className="card-body">
          <div className="profile-header">
            <div className="profile-avatar">{initials}</div>
            <div className="profile-info">
              <h2>{shop.name}</h2>
              <p>GSTIN: {shop.gstin}</p>
            </div>
            <div style={{ marginLeft: 'auto' }}>
              <RiskBadge level={riskBadgeLevel} />
            </div>
          </div>

          <div className="profile-grid">
            <div className="profile-stat">
              <div className="profile-stat-label">Total Transactions</div>
              <div className="profile-stat-value">{shop.transactions}</div>
            </div>
            <div className="profile-stat">
              <div className="profile-stat-label">Average Invoice</div>
              <div className="profile-stat-value">{formatCurrency(shop.avgInvoice)}</div>
            </div>
            <div className="profile-stat">
              <div className="profile-stat-label">Average GST Amount</div>
              <div className="profile-stat-value">{formatCurrency(shop.avgGst)}</div>
            </div>
            <div className="profile-stat">
              <div className="profile-stat-label">Transaction Frequency</div>
              <div className="profile-stat-value">{shop.frequency}</div>
            </div>
            <div className="profile-stat">
              <div className="profile-stat-label">Historical Range</div>
              <div className="profile-stat-value">{shop.histRange}</div>
            </div>
            <div className="profile-stat">
              <div className="profile-stat-label">Risk Status</div>
              <div className="profile-stat-value">{shop.riskStatus}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h3>Recent Transaction Behaviour</h3>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Invoice ID</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Risk</th>
              </tr>
            </thead>
            <tbody>
              {shop.recentTransactions.map((txn) => (
                <tr key={txn.id}>
                  <td style={{ fontWeight: 600, color: 'var(--navy-700)' }}>{txn.id}</td>
                  <td className="table-amount">{formatCurrency(txn.amount)}</td>
                  <td>{formatDate(txn.date)}</td>
                  <td><RiskBadge level={txn.risk} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
