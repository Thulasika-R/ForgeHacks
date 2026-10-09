/**
 * Demo data for GSTGuard frontend.
 * Replace these arrays with API responses when backend is integrated.
 */

export const invoices = [
  {
    id: 'INV-1024',
    shop: 'ABC Traders',
    gstin: '33AABCT1234A1ZA',
    amount: 12500,
    quantity: 5,
    gstRate: 18,
    date: '2026-10-08',
    anomalyScore: 0.12,
    risk: 'Low',
    status: 'Normal',
  },
  {
    id: 'INV-1023',
    shop: 'XYZ Stores',
    gstin: '33AABXY5678B1ZB',
    amount: 87000,
    quantity: 12,
    gstRate: 12,
    date: '2026-10-08',
    anomalyScore: 0.54,
    risk: 'Medium',
    status: 'Review',
  },
  {
    id: 'INV-1022',
    shop: 'Ravi Enterprises',
    gstin: '33AABRE9012C1ZC',
    amount: 680000,
    quantity: 40,
    gstRate: 18,
    date: '2026-10-07',
    anomalyScore: 0.89,
    risk: 'High',
    status: 'Review',
  },
  {
    id: 'INV-1021',
    shop: 'Kumar Supplies',
    gstin: '33AABKS3456D1ZD',
    amount: 24500,
    quantity: 8,
    gstRate: 5,
    date: '2026-10-07',
    anomalyScore: 0.15,
    risk: 'Low',
    status: 'Normal',
  },
  {
    id: 'INV-1020',
    shop: 'Lakshmi Textiles',
    gstin: '33AABLT7890E1ZE',
    amount: 156000,
    quantity: 25,
    gstRate: 12,
    date: '2026-10-06',
    anomalyScore: 0.33,
    risk: 'Low',
    status: 'Normal',
  },
  {
    id: 'INV-1019',
    shop: 'Patel Electronics',
    gstin: '33AABPE1234F1ZF',
    amount: 320000,
    quantity: 15,
    gstRate: 18,
    date: '2026-10-06',
    anomalyScore: 0.72,
    risk: 'High',
    status: 'Review',
  },
  {
    id: 'INV-1018',
    shop: 'Sharma Metals',
    gstin: '33AABSM5678G1ZG',
    amount: 45000,
    quantity: 10,
    gstRate: 18,
    date: '2026-10-05',
    anomalyScore: 0.21,
    risk: 'Low',
    status: 'Normal',
  },
  {
    id: 'INV-1017',
    shop: 'Gupta Pharma',
    gstin: '33AABGP9012H1ZH',
    amount: 210000,
    quantity: 50,
    gstRate: 12,
    date: '2026-10-05',
    anomalyScore: 0.61,
    risk: 'Medium',
    status: 'Review',
  },
  {
    id: 'INV-1016',
    shop: 'ABC Traders',
    gstin: '33AABCT1234A1ZA',
    amount: 98000,
    quantity: 20,
    gstRate: 18,
    date: '2026-10-04',
    anomalyScore: 0.19,
    risk: 'Low',
    status: 'Normal',
  },
  {
    id: 'INV-1015',
    shop: 'Singh Hardware',
    gstin: '33AABSH3456I1ZI',
    amount: 540000,
    quantity: 30,
    gstRate: 28,
    date: '2026-10-04',
    anomalyScore: 0.82,
    risk: 'High',
    status: 'Review',
  },
];

export const shops = [
  {
    id: 'shop-1',
    name: 'ABC Traders',
    gstin: '33AABCT1234A1ZA',
    transactions: 84,
    avgInvoice: 132000,
    avgGst: 23760,
    frequency: '3-4 per week',
    histRange: '₹15,000 – ₹2,10,000',
    riskStatus: 'Normal',
    recentTransactions: [
      { id: 'INV-1024', amount: 12500, date: '2026-10-08', risk: 'Low' },
      { id: 'INV-1016', amount: 98000, date: '2026-10-04', risk: 'Low' },
      { id: 'INV-1010', amount: 145000, date: '2026-09-28', risk: 'Low' },
      { id: 'INV-1003', amount: 178000, date: '2026-09-21', risk: 'Medium' },
    ],
  },
  {
    id: 'shop-2',
    name: 'XYZ Stores',
    gstin: '33AABXY5678B1ZB',
    transactions: 57,
    avgInvoice: 87000,
    avgGst: 10440,
    frequency: '2-3 per week',
    histRange: '₹8,000 – ₹1,50,000',
    riskStatus: 'Review',
    recentTransactions: [
      { id: 'INV-1023', amount: 87000, date: '2026-10-08', risk: 'Medium' },
      { id: 'INV-1011', amount: 65000, date: '2026-09-30', risk: 'Low' },
      { id: 'INV-1005', amount: 142000, date: '2026-09-23', risk: 'Medium' },
    ],
  },
  {
    id: 'shop-3',
    name: 'Ravi Enterprises',
    gstin: '33AABRE9012C1ZC',
    transactions: 102,
    avgInvoice: 148000,
    avgGst: 26640,
    frequency: '4-5 per week',
    histRange: '₹20,000 – ₹3,50,000',
    riskStatus: 'High Risk',
    recentTransactions: [
      { id: 'INV-1022', amount: 680000, date: '2026-10-07', risk: 'High' },
      { id: 'INV-1014', amount: 250000, date: '2026-10-02', risk: 'Medium' },
      { id: 'INV-1008', amount: 148000, date: '2026-09-26', risk: 'Low' },
      { id: 'INV-1001', amount: 320000, date: '2026-09-19', risk: 'High' },
    ],
  },
  {
    id: 'shop-4',
    name: 'Kumar Supplies',
    gstin: '33AABKS3456D1ZD',
    transactions: 45,
    avgInvoice: 32000,
    avgGst: 1600,
    frequency: '1-2 per week',
    histRange: '₹5,000 – ₹60,000',
    riskStatus: 'Normal',
    recentTransactions: [
      { id: 'INV-1021', amount: 24500, date: '2026-10-07', risk: 'Low' },
      { id: 'INV-1013', amount: 18000, date: '2026-10-01', risk: 'Low' },
    ],
  },
  {
    id: 'shop-5',
    name: 'Lakshmi Textiles',
    gstin: '33AABLT7890E1ZE',
    transactions: 63,
    avgInvoice: 110000,
    avgGst: 13200,
    frequency: '2-3 per week',
    histRange: '₹12,000 – ₹1,80,000',
    riskStatus: 'Normal',
    recentTransactions: [
      { id: 'INV-1020', amount: 156000, date: '2026-10-06', risk: 'Low' },
      { id: 'INV-1009', amount: 95000, date: '2026-09-27', risk: 'Low' },
    ],
  },
  {
    id: 'shop-6',
    name: 'Patel Electronics',
    gstin: '33AABPE1234F1ZF',
    transactions: 78,
    avgInvoice: 195000,
    avgGst: 35100,
    frequency: '3-4 per week',
    histRange: '₹25,000 – ₹4,20,000',
    riskStatus: 'Review',
    recentTransactions: [
      { id: 'INV-1019', amount: 320000, date: '2026-10-06', risk: 'High' },
      { id: 'INV-1007', amount: 185000, date: '2026-09-25', risk: 'Low' },
    ],
  },
];

export const reviewRecords = [
  {
    id: 'REV-001',
    invoiceId: 'INV-1022',
    shop: 'Ravi Enterprises',
    amount: 680000,
    anomalyScore: 0.89,
    risk: 'High',
    reasons: [
      'Transaction value significantly exceeds historical average',
      'Unusual transaction pattern',
      'Requires manual verification',
    ],
    decision: null,
    comments: '',
  },
  {
    id: 'REV-002',
    invoiceId: 'INV-1023',
    shop: 'XYZ Stores',
    gstin: '33AABXY5678B1ZB',
    amount: 87000,
    anomalyScore: 0.54,
    risk: 'Medium',
    reasons: [
      'Invoice value near upper threshold of historical range',
      'Marginal deviation from average transaction pattern',
    ],
    decision: null,
    comments: '',
  },
  {
    id: 'REV-003',
    invoiceId: 'INV-1019',
    shop: 'Patel Electronics',
    amount: 320000,
    anomalyScore: 0.72,
    risk: 'High',
    reasons: [
      'Transaction value exceeds historical average',
      'Unusual quantity for this vendor',
      'Requires manual verification',
    ],
    decision: null,
    comments: '',
  },
  {
    id: 'REV-004',
    invoiceId: 'INV-1015',
    shop: 'Singh Hardware',
    amount: 540000,
    anomalyScore: 0.82,
    risk: 'High',
    reasons: [
      'Transaction value significantly exceeds historical average',
      'High GST rate applied on bulk order',
      'Requires manual verification',
    ],
    decision: null,
    comments: '',
  },
  {
    id: 'REV-005',
    invoiceId: 'INV-1017',
    shop: 'Gupta Pharma',
    amount: 210000,
    anomalyScore: 0.61,
    risk: 'Medium',
    reasons: [
      'Transaction value moderately above historical average',
      'Elevated quantity compared to prior transactions',
    ],
    decision: null,
    comments: '',
  },
];

export const dashboardStats = {
  totalInvoices: 248,
  normal: 211,
  needsReview: 24,
  highRisk: 13,
};

export const riskDistribution = {
  normal: 211,
  medium: 24,
  high: 13,
};

/**
 * Demo analysis logic.
 * Replace this function with an API call when the backend is ready.
 *
 * @param {object} formData - The invoice form data
 * @returns {object} Analysis result
 */
export function analyzeInvoiceDemo(formData) {
  const amount = parseFloat(formData.amount) || 0;
  const isAnomalous = amount >= 200000;

  if (isAnomalous) {
    return {
      risk: 'High',
      label: 'HIGH ANOMALY RISK',
      anomalyScore: 0.89,
      historicalAvg: 132000,
      currentAmount: amount,
      message: 'Potential anomaly detected. Further verification is recommended.',
      indicators: [
        { type: 'warning', text: 'Transaction value significantly exceeds historical average' },
        { type: 'warning', text: 'Unusual transaction pattern' },
        { type: 'warning', text: 'Requires manual verification' },
      ],
    };
  }

  return {
    risk: 'Low',
    label: 'LOW ANOMALY RISK',
    anomalyScore: 0.18,
    historicalAvg: 132000,
    currentAmount: amount,
    message: 'Transaction is within the observed historical range.',
    indicators: [
      { type: 'success', text: 'Invoice value within normal range' },
      { type: 'success', text: 'Transaction pattern appears consistent' },
    ],
  };
}

/**
 * Demo analysis logic for uploaded invoice images.
 *
 * TEMPORARY: Determines risk based on the filename for demo purposes.
 *
 * FUTURE INTEGRATION — replace this function with an API call:
 *   POST /api/analyze-invoice  (multipart/form-data with invoice image)
 *
 *   The backend pipeline will perform:
 *     Invoice Image
 *       → OCR (extract text from image)
 *       → Extract Invoice Fields (amount, GSTIN, date, items, etc.)
 *       → Preprocessing
 *       → Historical Shop Behaviour lookup
 *       → ML Anomaly Detection
 *       → Risk Result
 *
 * @param {File} file - The uploaded invoice image file
 * @returns {object} Analysis result matching the RiskResult component's expected shape
 */
export function analyzeInvoiceImageDemo(file) {
  const nameLower = file.name.toLowerCase();
  const highRiskKeywords = ['high', 'fraud', 'risk', 'anomaly'];
  const isAnomalous = highRiskKeywords.some((kw) => nameLower.includes(kw));

  if (isAnomalous) {
    return {
      risk: 'High',
      label: 'HIGH ANOMALY RISK',
      anomalyScore: 0.89,
      historicalAvg: 132000,
      currentAmount: 680000,
      message: 'Potential anomaly detected. Further verification is recommended.',
      indicators: [
        { type: 'warning', text: 'Transaction value differs significantly from historical behaviour' },
        { type: 'warning', text: 'Unusual transaction pattern' },
        { type: 'warning', text: 'Requires manual verification' },
      ],
    };
  }

  return {
    risk: 'Low',
    label: 'LOW ANOMALY RISK',
    anomalyScore: 0.18,
    historicalAvg: 132000,
    currentAmount: 125000,
    message: 'Transaction appears consistent with the historical behaviour.',
    indicators: [
      { type: 'success', text: 'Invoice value within normal range' },
      { type: 'success', text: 'Transaction pattern appears consistent' },
    ],
  };
}
