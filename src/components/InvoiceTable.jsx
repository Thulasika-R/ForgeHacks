import RiskBadge, { StatusBadge } from './RiskBadge';

/**
 * Formats a number as Indian Rupee currency.
 */
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

export default function InvoiceTable({ invoices, onRowClick, compact = false }) {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table className="data-table">
        <thead>
          <tr>
            <th>Invoice ID</th>
            <th>Shop / MSME</th>
            <th>Amount</th>
            {!compact && <th>GST Rate</th>}
            <th>Date</th>
            {!compact && <th>Anomaly Score</th>}
            <th>Risk</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {invoices.map((inv) => (
            <tr key={inv.id} onClick={() => onRowClick && onRowClick(inv)}>
              <td style={{ fontWeight: 600, color: 'var(--navy-700)' }}>{inv.id}</td>
              <td>{inv.shop}</td>
              <td className="table-amount">{formatCurrency(inv.amount)}</td>
              {!compact && <td>{inv.gstRate}%</td>}
              <td>{formatDate(inv.date)}</td>
              {!compact && (
                <td>
                  <span className="score-display">
                    <span className={`score-dot ${inv.risk.toLowerCase()}`}></span>
                    {inv.anomalyScore.toFixed(2)}
                  </span>
                </td>
              )}
              <td><RiskBadge level={inv.risk} /></td>
              <td><StatusBadge status={inv.status} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
