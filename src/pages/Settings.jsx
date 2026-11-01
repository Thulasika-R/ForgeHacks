import { useState } from 'react';

const SECTIONS = [
  {
    id: 'account',
    label: 'Account',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
  {
    id: 'notifications',
    label: 'Notifications',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
      </svg>
    ),
  },
  {
    id: 'risk',
    label: 'Risk Engine',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
  },
];

function Toggle({ checked, onChange }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      className={`settings-toggle${checked ? ' on' : ''}`}
      onClick={() => onChange(!checked)}
    >
      <span className="settings-toggle-knob" />
    </button>
  );
}

function SettingRow({ label, description, children }) {
  return (
    <div className="settings-row">
      <div className="settings-row-info">
        <span className="settings-row-label">{label}</span>
        {description && <span className="settings-row-desc">{description}</span>}
      </div>
      <div className="settings-row-control">{children}</div>
    </div>
  );
}

export default function Settings({ user, onLogout }) {
  const [active, setActive] = useState('account');

  // Account
  const [displayName, setDisplayName] = useState(user?.username || 'admin');
  const [email, setEmail] = useState('admin@gstguard.in');

  // Notifications
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [highRiskOnly, setHighRiskOnly] = useState(false);
  const [dailyDigest, setDailyDigest] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  // Risk Engine
  const [threshold, setThreshold] = useState(0.5);
  const [autoFlag, setAutoFlag] = useState(true);
  const [strictMode, setStrictMode] = useState(false);

  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="settings-page">
      <div className="settings-layout">
        {/* Sidebar */}
        <aside className="settings-sidebar">
          {SECTIONS.map((s) => (
            <button
              key={s.id}
              className={`settings-nav-item${active === s.id ? ' active' : ''}`}
              onClick={() => setActive(s.id)}
            >
              <span className="settings-nav-icon">{s.icon}</span>
              {s.label}
            </button>
          ))}

          <div className="settings-logout-wrap">
            <button className="settings-logout-btn" onClick={onLogout}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              Sign Out
            </button>
          </div>
        </aside>

        {/* Content */}
        <div className="settings-content">
          {/* Account */}
          {active === 'account' && (
            <div className="settings-section">
              <div className="settings-section-header">
                <h3>Account</h3>
                <p>Manage your profile and login details</p>
              </div>

              {/* Avatar */}
              <div className="settings-avatar-row">
                <div className="settings-avatar">{user?.initials || 'AD'}</div>
                <div>
                  <div className="settings-avatar-name">{user?.username}</div>
                  <div className="settings-avatar-role">{user?.role}</div>
                </div>
              </div>

              <div className="settings-group">
                <SettingRow label="Display Name">
                  <input
                    className="settings-input"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                  />
                </SettingRow>
                <SettingRow label="Email Address">
                  <input
                    className="settings-input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                  />
                </SettingRow>
                <SettingRow label="Role" description="Assigned by administrator">
                  <span className="settings-badge">{user?.role}</span>
                </SettingRow>
              </div>
            </div>
          )}

          {/* Notifications */}
          {active === 'notifications' && (
            <div className="settings-section">
              <div className="settings-section-header">
                <h3>Notifications</h3>
                <p>Choose what alerts you receive</p>
              </div>
              <div className="settings-group">
                <SettingRow label="Email Alerts" description="Receive email when anomalies are detected">
                  <Toggle checked={emailAlerts} onChange={setEmailAlerts} />
                </SettingRow>
                <SettingRow label="High Risk Only" description="Only notify for HIGH anomaly risk invoices">
                  <Toggle checked={highRiskOnly} onChange={setHighRiskOnly} />
                </SettingRow>
                <SettingRow label="Daily Digest" description="Receive a daily summary of flagged invoices">
                  <Toggle checked={dailyDigest} onChange={setDailyDigest} />
                </SettingRow>
                <SettingRow label="Dark Mode" description="Switch the interface to a dark colour scheme">
                  <Toggle checked={darkMode} onChange={(val) => {
                    setDarkMode(val);
                    document.documentElement.setAttribute('data-theme', val ? 'dark' : '');
                  }} />
                </SettingRow>
              </div>
            </div>
          )}

          {/* Risk Engine */}
          {active === 'risk' && (
            <div className="settings-section">
              <div className="settings-section-header">
                <h3>Risk Engine</h3>
                <p>Configure the anomaly detection parameters</p>
              </div>
              <div className="settings-group">
                <SettingRow label="Anomaly Threshold" description={`Flag invoices with score ≥ ${threshold}`}>
                  <div className="settings-slider-wrap">
                    <input
                      type="range"
                      min={0}
                      max={1}
                      step={0.05}
                      value={threshold}
                      onChange={(e) => setThreshold(parseFloat(e.target.value))}
                      className="settings-slider"
                    />
                    <span className="settings-slider-val">{threshold.toFixed(2)}</span>
                  </div>
                </SettingRow>
                <SettingRow label="Auto-Flag Anomalies" description="Automatically move flagged invoices to Review queue">
                  <Toggle checked={autoFlag} onChange={setAutoFlag} />
                </SettingRow>
                <SettingRow label="Strict Mode" description="Use tighter bounds; more false positives, fewer misses">
                  <Toggle checked={strictMode} onChange={setStrictMode} />
                </SettingRow>
              </div>
            </div>
          )}

          {/* Save button */}
          <div className="settings-footer">
            <button className={`settings-save-btn${saved ? ' saved' : ''}`} onClick={handleSave}>
              {saved ? (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Saved!
                </>
              ) : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
