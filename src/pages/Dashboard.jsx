import StatCard from '../components/StatCard';
import InvoiceTable from '../components/InvoiceTable';
import { dashboardStats, riskDistribution, invoices } from '../data/demoData';

const recentInvoices = invoices.slice(0, 4);
const total = riskDistribution.normal + riskDistribution.medium + riskDistribution.high;

export default function Dashboard() {
  return (
    <div>
      <div className="page-title">
        <h1>GSTGuard</h1>
        <p>GST Invoice Risk Intelligence</p>
      </div>

      <div className="stat-cards">
        <StatCard
          icon="📄"
          iconColor="blue"
          value={dashboardStats.totalInvoices}
          label="Total Invoices"
        />
        <StatCard
          icon="✓"
          iconColor="green"
          value={dashboardStats.normal}
          label="Normal"
        />
        <StatCard
          icon="⚡"
          iconColor="orange"
          value={dashboardStats.needsReview}
          label="Needs Review"
        />
        <StatCard
          icon="⚠"
          iconColor="red"
          value={dashboardStats.highRisk}
          label="High Risk"
        />
      </div>

      <div className="dashboard-row">
        <div className="card">
          <div className="card-header">
            <h3>Recent Invoice Activity</h3>
          </div>
          <InvoiceTable invoices={recentInvoices} compact />
        </div>

        <div className="card">
          <div className="card-header">
            <h3>Risk Distribution</h3>
          </div>
          <div className="card-body">
            <div className="risk-bar-container">
              <div
                className="risk-bar-segment normal"
                style={{ width: `${(riskDistribution.normal / total) * 100}%` }}
              />
              <div
                className="risk-bar-segment medium"
                style={{ width: `${(riskDistribution.medium / total) * 100}%` }}
              />
              <div
                className="risk-bar-segment high"
                style={{ width: `${(riskDistribution.high / total) * 100}%` }}
              />
            </div>
            <div className="risk-legend">
              <div className="risk-legend-item">
                <span className="risk-legend-dot normal" />
                <span>Normal</span>
                <span className="risk-legend-value">{riskDistribution.normal}</span>
              </div>
              <div className="risk-legend-item">
                <span className="risk-legend-dot medium" />
                <span>Medium</span>
                <span className="risk-legend-value">{riskDistribution.medium}</span>
              </div>
              <div className="risk-legend-item">
                <span className="risk-legend-dot high" />
                <span>High</span>
                <span className="risk-legend-value">{riskDistribution.high}</span>
              </div>
            </div>

            <div style={{ marginTop: '24px' }}>
              {[
                { label: 'Normal', count: riskDistribution.normal, cls: 'normal' },
                { label: 'Medium', count: riskDistribution.medium, cls: 'medium' },
                { label: 'High', count: riskDistribution.high, cls: 'high' },
              ].map((item) => (
                <div key={item.cls} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--gray-600)' }}>
                    <span className={`risk-legend-dot ${item.cls}`} />
                    {item.label}
                  </div>
                  <div style={{ flex: 1, margin: '0 12px', height: '6px', background: 'var(--gray-100)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div
                      className={`risk-bar-segment ${item.cls}`}
                      style={{ height: '100%', width: `${(item.count / total) * 100}%`, borderRadius: '4px' }}
                    />
                  </div>
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--gray-800)', minWidth: '32px', textAlign: 'right' }}>
                    {((item.count / total) * 100).toFixed(1)}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
