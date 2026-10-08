import { useLocation } from 'react-router-dom';

export default function Header({ pageTitles }) {
  const location = useLocation();

  // Match the current path to page titles, fallback for dynamic routes
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
        <span className="header-badge">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          Live Demo
        </span>
        <div className="header-avatar" title="Demo User">
          DU
        </div>
      </div>
    </header>
  );
}
