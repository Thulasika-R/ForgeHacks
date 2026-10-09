import { useState } from 'react';
import InvoiceForm from '../components/InvoiceForm';
import InvoiceUploader from '../components/InvoiceUploader';
import RiskResult from '../components/RiskResult';
import { analyzeInvoiceImageDemo } from '../data/demoData';

/**
 * Processing steps revealed sequentially during the loading state
 * to give the user a sense of the ML pipeline running.
 */
const PROCESSING_STEPS = [
  'Invoice uploaded',
  'Invoice processed',
  'Transaction features analyzed',
  'Historical behaviour checked',
];

export default function AnalyzeInvoice() {
  const [result, setResult] = useState(null);
  const [formData, setFormData] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [processingSteps, setProcessingSteps] = useState([]);
  const [activeTab, setActiveTab] = useState('upload');
  const [error, setError] = useState(null);

  // ---------------------------------------------------------------------------
  // Form-based analysis — calls the real Flask /api/analyze endpoint
  // ---------------------------------------------------------------------------
  const handleFormAnalyze = async (data) => {
    setIsAnalyzing(true);
    setProcessingSteps([]);
    setError(null);

    // Reveal steps sequentially while the fetch runs in the background
    for (let i = 0; i < PROCESSING_STEPS.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      setProcessingSteps((prev) => [...prev, PROCESSING_STEPS[i]]);
    }

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || `Server error ${res.status}`);
      }

      setFormData(data);
      setResult(json);
    } catch (err) {
      setError(
        err.message.toLowerCase().includes('failed to fetch')
          ? 'Could not reach the backend. Make sure the Flask server is running on port 5000.'
          : err.message
      );
    } finally {
      setIsAnalyzing(false);
      setProcessingSteps([]);
    }
  };

  // ---------------------------------------------------------------------------
  // Image upload-based analysis (demo only — OCR not yet implemented)
  // ---------------------------------------------------------------------------
  const handleImageAnalyze = async (file) => {
    setIsAnalyzing(true);
    setProcessingSteps([]);
    setError(null);

    for (let i = 0; i < PROCESSING_STEPS.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 600));
      setProcessingSteps((prev) => [...prev, PROCESSING_STEPS[i]]);
    }

    await new Promise((resolve) => setTimeout(resolve, 400));

    /**
     * TODO: Replace with real API call when OCR backend is ready.
     *
     *   const form = new FormData();
     *   form.append('invoice', file);
     *   const res = await fetch('/api/analyze-invoice', { method: 'POST', body: form });
     *   const analysisResult = await res.json();
     *
     * The backend pipeline will perform:
     *   OCR → Extract Invoice Fields → Preprocessing →
     *   Historical Shop Behaviour → ML Anomaly Detection → Risk Result
     */
    const analysisResult = analyzeInvoiceImageDemo(file);

    setFormData({
      invoiceNumber: `IMG-${Date.now().toString().slice(-6)}`,
      shop: 'Uploaded Invoice',
    });
    setResult(analysisResult);
    setIsAnalyzing(false);
    setProcessingSteps([]);
  };

  const handleBack = () => {
    setResult(null);
    setFormData(null);
    setIsAnalyzing(false);
    setProcessingSteps([]);
    setError(null);
  };

  // ---------------------------------------------------------------------------
  // Result view
  // ---------------------------------------------------------------------------
  if (result && formData) {
    return (
      <div>
        <div className="page-title">
          <h1>Analysis Result</h1>
          <p>Invoice risk assessment outcome</p>
        </div>
        <RiskResult result={result} formData={formData} onBack={handleBack} />
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // Loading / processing view
  // ---------------------------------------------------------------------------
  if (isAnalyzing) {
    return (
      <div>
        <div className="page-title">
          <h1>Analyze Invoice</h1>
          <p>Processing your invoice...</p>
        </div>
        <div className="upload-processing-card">
          <div className="upload-processing-spinner-row">
            <span className="upload-spinner large" />
            <span className="upload-processing-label">Analyzing invoice...</span>
          </div>
          <div className="upload-processing-steps">
            {processingSteps.map((step, idx) => (
              <div className="upload-processing-step" key={idx}>
                <span className="indicator-icon success">✓</span>
                <span>{step}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // Default — tab toggle between Upload and Manual Form
  // ---------------------------------------------------------------------------
  return (
    <div>
      <div className="page-title">
        <h1>Analyze Invoice</h1>
        <p>Submit an invoice for anomaly screening.</p>
      </div>

      {/* Error banner — shown after a failed API call */}
      {error && (
        <div
          className="result-message high"
          style={{ marginBottom: '1.5rem', borderRadius: '0.75rem', padding: '1rem 1.25rem' }}
        >
          <strong>Error:</strong> {error}
        </div>
      )}

      <div className="analyze-tabs">
        <button
          className={`analyze-tab ${activeTab === 'upload' ? 'active' : ''}`}
          onClick={() => setActiveTab('upload')}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" x2="12" y1="3" y2="15" />
          </svg>
          Upload Invoice
        </button>
        <button
          className={`analyze-tab ${activeTab === 'manual' ? 'active' : ''}`}
          onClick={() => setActiveTab('manual')}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
          Manual Entry
        </button>
      </div>

      {activeTab === 'upload' ? (
        <InvoiceUploader onAnalyze={handleImageAnalyze} isAnalyzing={isAnalyzing} />
      ) : (
        <InvoiceForm onAnalyze={handleFormAnalyze} />
      )}
    </div>
  );
}
