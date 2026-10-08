import { useState } from 'react';
import InvoiceForm from '../components/InvoiceForm';
import RiskResult from '../components/RiskResult';
import { analyzeInvoiceDemo } from '../data/demoData';

export default function AnalyzeInvoice() {
  const [result, setResult] = useState(null);
  const [formData, setFormData] = useState(null);

  const handleAnalyze = (data) => {
    // TODO: Replace with API call to backend
    // e.g. const res = await fetch('/api/analyze', { method: 'POST', body: JSON.stringify(data) });
    const analysisResult = analyzeInvoiceDemo(data);
    setFormData(data);
    setResult(analysisResult);
  };

  const handleBack = () => {
    setResult(null);
    setFormData(null);
  };

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

  return (
    <div>
      <div className="page-title">
        <h1>Analyze Invoice</h1>
        <p>Submit an invoice for anomaly screening.</p>
      </div>
      <InvoiceForm onAnalyze={handleAnalyze} />
    </div>
  );
}
