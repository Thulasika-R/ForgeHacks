import { useState } from 'react';

export default function InvoiceForm({ onAnalyze }) {
  const [formData, setFormData] = useState({
    invoiceNumber: '',
    shop: '',
    gstin: '',
    amount: '',
    quantity: '',
    gstRate: '18',
    invoiceDate: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAnalyze(formData);
  };

  return (
    <div className="form-card">
      <div className="form-header">
        <h2>Analyze GST Invoice</h2>
        <p>Screen an invoice against transaction and historical behaviour.</p>
      </div>
      <form className="form-body" onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="invoiceNumber">Invoice Number</label>
            <input
              id="invoiceNumber"
              name="invoiceNumber"
              type="text"
              placeholder="e.g. INV-1025"
              value={formData.invoiceNumber}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="shop">Shop / MSME Name</label>
            <input
              id="shop"
              name="shop"
              type="text"
              placeholder="e.g. ABC Traders"
              value={formData.shop}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="gstin">GSTIN</label>
            <input
              id="gstin"
              name="gstin"
              type="text"
              placeholder="e.g. 33AABCT1234A1ZA"
              value={formData.gstin}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="amount">Invoice Amount (₹)</label>
            <input
              id="amount"
              name="amount"
              type="number"
              placeholder="e.g. 125000"
              value={formData.amount}
              onChange={handleChange}
              required
              min="1"
            />
          </div>

          <div className="form-group">
            <label htmlFor="quantity">Quantity</label>
            <input
              id="quantity"
              name="quantity"
              type="number"
              placeholder="e.g. 10"
              value={formData.quantity}
              onChange={handleChange}
              required
              min="1"
            />
          </div>

          <div className="form-group">
            <label htmlFor="gstRate">GST Rate (%)</label>
            <select
              id="gstRate"
              name="gstRate"
              value={formData.gstRate}
              onChange={handleChange}
            >
              <option value="0">0%</option>
              <option value="5">5%</option>
              <option value="12">12%</option>
              <option value="18">18%</option>
              <option value="28">28%</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="invoiceDate">Invoice Date</label>
            <input
              id="invoiceDate"
              name="invoiceDate"
              type="date"
              value={formData.invoiceDate}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            Analyze Invoice
          </button>
        </div>
      </form>
    </div>
  );
}
