import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import AnalyzeInvoice from './pages/AnalyzeInvoice';
import InvoiceHistory from './pages/InvoiceHistory';
import MSMEProfiles from './pages/MSMEProfiles';
import MSMEDetail from './pages/MSMEDetail';
import Review from './pages/Review';
import Settings from './pages/Settings';
import Login from './pages/Login';

const pageTitles = {
  '/': { title: 'Dashboard', subtitle: 'GST Invoice Risk Intelligence' },
  '/analyze': { title: 'Analyze Invoice', subtitle: 'Screen invoices for anomalies' },
  '/history': { title: 'Invoice History', subtitle: 'View and filter all invoices' },
  '/profiles': { title: 'MSME Profiles', subtitle: 'Manage shop & MSME records' },
  '/review': { title: 'Review', subtitle: 'Verify flagged invoices' },
  '/settings': { title: 'Settings', subtitle: 'Preferences & configuration' },
};

function AppLayout({ user, onLogout }) {
  return (
    <div className="app-layout">
      <Sidebar onLogout={onLogout} />
      <div className="main-area">
        <Header pageTitles={pageTitles} user={user} onLogout={onLogout} />
        <div className="page-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/analyze" element={<AnalyzeInvoice />} />
            <Route path="/history" element={<InvoiceHistory />} />
            <Route path="/profiles" element={<MSMEProfiles />} />
            <Route path="/profiles/:shopId" element={<MSMEDetail />} />
            <Route path="/review" element={<Review />} />
            <Route path="/settings" element={<Settings user={user} onLogout={onLogout} />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [user, setUser] = useState(null);

  const handleLogin = (userData) => setUser(userData);
  const handleLogout = () => setUser(null);

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <BrowserRouter>
      <AppLayout user={user} onLogout={handleLogout} />
    </BrowserRouter>
  );
}
