import { useLocation } from 'react-router-dom';

export default function Header({ pageTitles, user, onLogout }) {
  const location = useLocation();

  const path = location.pathname;
  const pageInfo = pageTitles[path] || {
    title: path.startsWith('/profiles/') ? 'MSME Profile' : 'GSTGuard',
    subtitle: path.startsWith('/profiles/') ? 'Shop detail view' : '',
  };

  return (
    <header className="header">
      <div className="header-title">
        <h2>{pageInfo.title}</h2>
        {pageInfo.subtitle && <p>{pageInfo.subtitle}</p>}
      </div>
      <div className="header-right">
        {user && (
          <div className="header-user-info">
            <span className="header-user-role">{user.role}</span>
            <span className="header-user-name">{user.username}</span>
          </div>
        )}
        <div className="header-avatar" title={user?.username}>
          {user?.initials || 'GU'}
        </div>
        <button className="header-logout-btn" onClick={onLogout} title="Sign Out">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
        </button>
      </div>
    </header>
  );
}
