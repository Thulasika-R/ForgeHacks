export default function RiskBadge({ level }) {
  const cls = level.toLowerCase();
  return <span className={`risk-badge ${cls}`}>{level}</span>;
}

export function StatusBadge({ status }) {
  const cls = status.toLowerCase();
  return <span className={`status-badge ${cls}`}>{status}</span>;
}
