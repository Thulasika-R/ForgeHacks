import RiskBadge from './RiskBadge';

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function ShopCard({ shop, onClick }) {
  return (
    <div className="shop-card" onClick={() => onClick(shop)}>
      <div className="shop-card-header">
        <div>
          <h3>{shop.name}</h3>
          <div className="shop-card-gstin">GSTIN: {shop.gstin}</div>
        </div>
        <RiskBadge level={shop.riskStatus === 'High Risk' ? 'High' : shop.riskStatus === 'Review' ? 'Medium' : 'Low'} />
      </div>
      <div className="shop-card-stats">
        <div className="shop-stat">
          <span className="shop-stat-label">Transactions</span>
          <span className="shop-stat-value">{shop.transactions}</span>
        </div>
        <div className="shop-stat">
          <span className="shop-stat-label">Avg. Invoice</span>
          <span className="shop-stat-value">{formatCurrency(shop.avgInvoice)}</span>
        </div>
        <div className="shop-stat">
          <span className="shop-stat-label">Risk Status</span>
          <span className="shop-stat-value">{shop.riskStatus}</span>
        </div>
        <div className="shop-stat">
          <span className="shop-stat-label">Frequency</span>
          <span className="shop-stat-value">{shop.frequency}</span>
        </div>
      </div>
    </div>
  );
}
