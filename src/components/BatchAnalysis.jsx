import { useState, useRef } from 'react';

// ── CSV parser ─────────────────────────────────────────────────────────────
function parseCSV(text) {
  const lines = text.trim().split(/\r?\n/);
  if (lines.length < 2) throw new Error('CSV must have a header row and at least one data row.');

  const headers = lines[0].split(',').map((h) => h.trim());
  const required = ['amount', 'quantity', 'gstRate'];
  for (const r of required) {
    if (!headers.includes(r)) throw new Error(`Missing required column: "${r}"`);
  }

  return lines.slice(1).map((line, i) => {
    const vals = line.split(',').map((v) => v.trim());
    const obj = {};
    headers.forEach((h, idx) => { obj[h] = vals[idx] ?? ''; });
    // Cast numeric fields
    obj.amount   = parseFloat(obj.amount);
    obj.quantity = parseFloat(obj.quantity);
    obj.gstRate  = parseFloat(obj.gstRate);
    if (!obj.invoiceNumber) obj.invoiceNumber = `ROW-${i + 2}`;
    return obj;
  });
}

// ── Risk badge ────────────────────────────────────────────────────────────
function RiskChip({ risk }) {
  const cls =
    risk === 'High'  ? 'batch-chip high'  :
    risk === 'Low'   ? 'batch-chip low'   :
    risk === 'Error' ? 'batch-chip error' : 'batch-chip';
  return <span className={cls}>{risk}</span>;
}

// ── Score bar ─────────────────────────────────────────────────────────────
function ScoreBar({ score }) {
  if (score === null || score === undefined) return <span className="batch-na">—</span>;
  const pct = Math.round(score * 100);
  const color = score >= 0.6 ? '#ef4444' : score >= 0.35 ? '#f97316' : '#22c55e';
  return (
    <div className="batch-score-wrap">
      <div className="batch-score-bar">
        <div className="batch-score-fill" style={{ width: `${pct}%`, background: color }} />
      </div>
      <span className="batch-score-val">{score.toFixed(2)}</span>
    </div>
  );
}

const PROCESSING_STEPS = [
  'CSV parsed successfully',
  'Sending to ML pipeline',
  'Running anomaly detection',
  'Compiling results',
];

export default function BatchAnalysis() {
  const [file, setFile]         = useState(null);
  const [rows, setRows]         = useState([]);
  const [parseError, setParseError] = useState('');
  const [results, setResults]   = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [steps, setSteps]       = useState([]);
  const [apiError, setApiError] = useState('');
  const [filter, setFilter]     = useState('all');
  const fileRef = useRef();

  // ── File selection ────────────────────────────────────────────────────
  const handleFile = (f) => {
    setFile(f);
    setResults(null);
    setParseError('');
    setApiError('');
    setSteps([]);
    if (!f) { setRows([]); return; }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = parseCSV(e.target.result);
        setRows(parsed);
        setParseError('');
      } catch (err) {
        setParseError(err.message);
        setRows([]);
      }
    };
    reader.readAsText(f);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    if (f && f.name.endsWith('.csv')) handleFile(f);
  };

  // ── Analysis ──────────────────────────────────────────────────────────
  const handleAnalyze = async () => {
    setAnalyzing(true);
    setSteps([]);
    setApiError('');
    setResults(null);

    for (let i = 0; i < PROCESSING_STEPS.length; i++) {
      await new Promise((r) => setTimeout(r, 500));
      setSteps((p) => [...p, PROCESSING_STEPS[i]]);
    }

    try {
      const res = await fetch('/api/analyze-batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(rows),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || `Server error ${res.status}`);
      setResults(json);
    } catch (err) {
      setApiError(
        err.message.toLowerCase().includes('failed to fetch')
          ? 'Could not reach the backend. Make sure the Flask server is running on port 5000.'
          : err.message
      );
    } finally {
      setAnalyzing(false);
      setSteps([]);
    }
  };

  // ── Export results as CSV ─────────────────────────────────────────────
  const handleExport = () => {
    if (!results) return;
    const header = 'row,invoiceNumber,shop,gstin,invoiceDate,amount,risk,anomalyScore,historicalAvg,message';
    const csvRows = results.results.map((r) =>
      [
        r.row, r.invoiceNumber, `"${r.shop}"`, r.gstin || '', r.invoiceDate || '',
        r.currentAmount ?? '', r.risk, r.anomalyScore ?? '', r.historicalAvg ?? '',
        `"${(r.message || r.error || '').replace(/"/g, "'")}"`,
      ].join(',')
    );
    const blob = new Blob([[header, ...csvRows].join('\n')], { type: 'text/csv' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = 'batch_results.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    setFile(null); setRows([]); setResults(null);
    setParseError(''); setApiError(''); setSteps([]); setFilter('all');
  };

  // ── Filtered results ──────────────────────────────────────────────────
  const displayed = results
    ? (filter === 'all' ? results.results : results.results.filter((r) => r.risk === filter))
    : [];

  // ─────────────────────────────────────────────────────────────────────
  // Loading state
  if (analyzing) {
    return (
      <div className="upload-processing-card">
        <div className="upload-processing-spinner-row">
          <span className="upload-spinner large" />
          <span className="upload-processing-label">Analyzing {rows.length} invoices...</span>
        </div>
        <div className="upload-processing-steps">
          {steps.map((s, i) => (
            <div className="upload-processing-step" key={i}>
              <span className="indicator-icon success">✓</span>
              <span>{s}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────
  // Results view
  if (results) {
    const highPct = results.total > 0 ? Math.round((results.high / results.total) * 100) : 0;
    return (
      <div className="batch-results-wrap">
        {/* Summary cards */}
        <div className="batch-summary">
          <div className="batch-stat-card">
            <span className="batch-stat-num">{results.total}</span>
            <span className="batch-stat-label">Total Invoices</span>
          </div>
          <div className="batch-stat-card high">
            <span className="batch-stat-num">{results.high}</span>
            <span className="batch-stat-label">High Risk</span>
          </div>
          <div className="batch-stat-card low">
            <span className="batch-stat-num">{results.low}</span>
            <span className="batch-stat-label">Low Risk</span>
          </div>
          <div className="batch-stat-card">
            <span className="batch-stat-num">{highPct}%</span>
            <span className="batch-stat-label">Risk Rate</span>
          </div>
        </div>

        {/* Toolbar */}
        <div className="batch-toolbar">
          <div className="batch-filter-tabs">
            {['all', 'High', 'Low'].map((f) => (
              <button
                key={f}
                className={`batch-filter-tab${filter === f ? ' active' : ''}`}
                onClick={() => setFilter(f)}
              >
                {f === 'all' ? 'All' : f}
                {f !== 'all' && (
                  <span className={`batch-filter-count ${f.toLowerCase()}`}>
                    {f === 'High' ? results.high : results.low}
                  </span>
                )}
              </button>
            ))}
          </div>
          <div className="batch-toolbar-actions">
            <button className="batch-action-btn" onClick={handleExport}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              Export CSV
            </button>
            <button className="batch-action-btn secondary" onClick={handleReset}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-3.5"/>
              </svg>
              New Batch
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="batch-table-wrap">
          <table className="batch-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Invoice</th>
                <th>Shop</th>
                <th>Amount (₹)</th>
                <th>Risk</th>
                <th>Anomaly Score</th>
                <th>Hist. Avg (₹)</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {displayed.length === 0 ? (
                <tr><td colSpan={8} className="batch-empty">No rows match the filter.</td></tr>
              ) : (
                displayed.map((r) => (
                  <tr key={r.row} className={r.risk === 'High' ? 'batch-row-high' : r.risk === 'Error' ? 'batch-row-error' : ''}>
                    <td className="batch-row-num">{r.row}</td>
                    <td className="batch-invoice-num">{r.invoiceNumber}</td>
                    <td>{r.shop || '—'}</td>
                    <td className="batch-amount">{r.currentAmount != null ? `₹${r.currentAmount.toLocaleString('en-IN')}` : '—'}</td>
                    <td><RiskChip risk={r.risk} /></td>
                    <td><ScoreBar score={r.anomalyScore} /></td>
                    <td>{r.historicalAvg != null ? `₹${r.historicalAvg.toLocaleString('en-IN')}` : '—'}</td>
                    <td>{r.invoiceDate || '—'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {results.disclaimer && (
          <p className="batch-disclaimer">{results.disclaimer}</p>
        )}
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────
  // Upload state
  return (
    <div className="batch-upload-wrap">
      {/* Drop zone */}
      <div
        className={`batch-dropzone${file ? ' has-file' : ''}`}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        onClick={() => fileRef.current.click()}
      >
        <input
          ref={fileRef}
          type="file"
          accept=".csv"
          style={{ display: 'none' }}
          onChange={(e) => handleFile(e.target.files[0])}
        />
        {file ? (
          <>
            <div className="batch-file-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="16" x2="8" y1="13" y2="13"/>
                <line x1="16" x2="8" y1="17" y2="17"/>
              </svg>
            </div>
            <p className="batch-file-name">{file.name}</p>
            <p className="batch-file-meta">{rows.length} rows ready · click to change</p>
          </>
        ) : (
          <>
            <div className="batch-upload-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="17 8 12 3 7 8"/>
                <line x1="12" x2="12" y1="3" y2="15"/>
              </svg>
            </div>
            <p className="batch-upload-title">Drop your CSV here</p>
            <p className="batch-upload-sub">or click to browse</p>
          </>
        )}
      </div>

      {/* Parse error */}
      {parseError && (
        <div className="batch-error-msg">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          {parseError}
        </div>
      )}

      {/* API error */}
      {apiError && (
        <div className="batch-error-msg">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          {apiError}
        </div>
      )}

      {/* Column guide */}
      <div className="batch-guide">
        <div className="batch-guide-header">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
          </svg>
          Required CSV columns
        </div>
        <div className="batch-columns">
          {[
            { name: 'amount',        req: true,  desc: 'Invoice amount in ₹' },
            { name: 'quantity',      req: true,  desc: 'Number of items' },
            { name: 'gstRate',       req: true,  desc: 'GST rate (0/5/12/18/28)' },
            { name: 'invoiceNumber', req: false, desc: 'Invoice ID (optional)' },
            { name: 'shop',          req: false, desc: 'Shop/MSME name (optional)' },
            { name: 'gstin',         req: false, desc: 'GSTIN (optional)' },
            { name: 'invoiceDate',   req: false, desc: 'Date YYYY-MM-DD (optional)' },
          ].map((col) => (
            <div key={col.name} className="batch-col-row">
              <code className="batch-col-name">{col.name}</code>
              {col.req && <span className="batch-col-req">required</span>}
              <span className="batch-col-desc">{col.desc}</span>
            </div>
          ))}
        </div>

        <a
          href="/demo_invoices.csv"
          download="demo_invoices.csv"
          className="batch-demo-link"
          onClick={(e) => e.stopPropagation()}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="7 10 12 15 17 10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
          Download demo_invoices.csv
        </a>
      </div>

      {/* Analyze button */}
      {file && rows.length > 0 && !parseError && (
        <button className="btn btn-primary batch-analyze-btn" onClick={handleAnalyze}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
          </svg>
          Analyze {rows.length} Invoices
        </button>
      )}
    </div>
  );
}
