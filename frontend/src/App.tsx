import { useState, type JSX } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './pages/Dashboard';
import { Tasks } from './pages/Tasks';
import { Calendar } from './pages/Calendar';
import { Settings } from './pages/Settings';

type Page = 'dashboard' | 'tasks' | 'calendar' | 'settings';

const pages: Record<Page, JSX.Element> = {
  dashboard: <Dashboard />,
  tasks: <Tasks />,
  calendar: <Calendar />,
  settings: <Settings />,
};

function App() {
  const [activePage, setActivePage] = useState<Page>('dashboard');

  return (
    <div className="app">
      <Sidebar activePage={activePage} onNavigate={(page) => setActivePage(page as Page)} />
      <main className="app-main">{pages[activePage]}</main>
    </div>
  );
}

export default App;
