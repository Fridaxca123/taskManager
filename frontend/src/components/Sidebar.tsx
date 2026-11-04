import { Link, useLocation } from 'react-router';

const navItems = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'tasks', label: 'Tasks' },
  { id: 'calendar', label: 'Calendar' },
  { id: 'settings', label: 'Settings' },
];

export function Sidebar() {
  const location = useLocation();
  const activePage = location.pathname.split('/')[1] || 'dashboard';

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <img src="/images/icon.png" alt="icon" />
        <h2>Calendar</h2>
      </div>
      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <Link
            key={item.id}
            to={`/${item.id}`}
            className={activePage === item.id ? 'active' : ''}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
