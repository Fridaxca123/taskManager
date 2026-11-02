import { useState } from 'react';
import { Header } from '../components/Header';

export function Settings() {
  const [apiUrl, setApiUrl] = useState(import.meta.env.VITE_API_URL || '');

  return (
    <div className="page">
      <Header title="Settings" />
      <form className="settings-form" onSubmit={(e) => e.preventDefault()}>
        <label htmlFor="api-url">API URL</label>
        <input
          id="api-url"
          type="url"
          value={apiUrl}
          onChange={(e) => setApiUrl(e.target.value)}
          placeholder="http://localhost:3000/api"
        />
        <p className="settings-form__hint">
          Update the <code>.env</code> file to persist API URL changes.
        </p>
      </form>
    </div>
  );
}
