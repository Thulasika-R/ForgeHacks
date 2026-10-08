import { useState } from 'react';
import InvoiceTable from '../components/InvoiceTable';
import RiskBadge, { StatusBadge } from '../components/RiskBadge';
import { invoices } from '../data/demoData';

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

export default function InvoiceHistory() {
  const [search, setSearch] = useState('');
  const [riskFilter, setRiskFilter] = useState('All');
  const [selected, setSelected] = useState(null);

  const filtered = invoices.filter((inv) => {
    const matchesSearch =
      inv.id.toLowerCase().includes(search.toLowerCase()) ||
      inv.shop.toLowerCase().includes(search.toLowerCase());
    const matchesRisk =
      riskFilter === 'All' || inv.risk === riskFilter;
    return matchesSearch && matchesRisk;
  });

  return (
    <div>
      <div className="page-title">
        <h1>Invoice History</h1>
        <p>View and filter all processed invoices.</p>
      </div>

      <div className="filter-bar">
        <div className="search-wrapper">
          <span className="search-icon">🔍</span>
          <input
            className="search-input"
            type="text"
            placeholder="Search by Invoice ID or Shop..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {['All', 'Low', 'Medium', 'High'].map((level) => (
          <button
            key={level}
            className={`filter-btn ${riskFilter === level ? 'active' : ''}`}
            onClick={() => setRiskFilter(level)}
          >
            {level}
          </button>
        ))}
      </div>

      <div className="card">
        <InvoiceTable
          invoices={filtered}
          onRowClick={(inv) => setSelected(inv)}
        />
        {filtered.length === 0 && (
          <div className="card-body" style={{ textAlign: 'center', color: 'var(--gray-500)' }}>
            No invoices match your search criteria.
          </div>
        )}
      </div>

      {/* Invoice Detail Modal */}
      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Invoice Details — {selected.id}</h3>
              <button className="modal-close" onClick={() => setSelected(null)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="result-meta" style={{ marginBottom: '20px' }}>
                <div className="result-meta-item">
                  <span className="result-meta-label">Invoice ID</span>
                  <span className="result-meta-value">{selected.id}</span>
                </div>
                <div className="result-meta-item">
                  <span className="result-meta-label">Shop / MSME</span>
                  <span className="result-meta-value">{selected.shop}</span>
                </div>
                <div className="result-meta-item">
                  <span className="result-meta-label">GSTIN</span>
                  <span className="result-meta-value" style={{ fontFamily: 'monospace' }}>{selected.gstin}</span>
                </div>
                <div className="result-meta-item">
                  <span className="result-meta-label">Amount</span>
                  <span className="result-meta-value">{formatCurrency(selected.amount)}</span>
                </div>
                <div className="result-meta-item">
                  <span className="result-meta-label">GST Rate</span>
                  <span className="result-meta-value">{selected.gstRate}%</span>
                </div>
                <div className="result-meta-item">
                  <span className="result-meta-label">Date</span>
                  <span className="result-meta-value">{formatDate(selected.date)}</span>
                </div>
                <div className="result-meta-item">
                  <span className="result-meta-label">Anomaly Score</span>
                  <span className="result-meta-value">{selected.anomalyScore.toFixed(2)}</span>
                </div>
                <div className="result-meta-item">
                  <span className="result-meta-label">Quantity</span>
                  <span className="result-meta-value">{selected.quantity}</span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--gray-500)', fontWeight: 500 }}>Risk Level:</span>
                <RiskBadge level={selected.risk} />
                <span style={{ fontSize: '0.8rem', color: 'var(--gray-500)', fontWeight: 500, marginLeft: '8px' }}>Status:</span>
                <StatusBadge status={selected.status} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
