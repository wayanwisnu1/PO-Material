import React from 'react';
import { createRoot } from 'react-dom/client';
import EditTeamForm from './components/EditTeamForm';
import '../css/app.css';

const App = () => {
  const params = new URLSearchParams(window.location.search);
  const from = params.get('from') || 'team';
  const backUrl = from === 'team' ? '/team' : '/dashboard';

  // Ambil ID user dari path: /dashboard/edit-team/{id}
  const pathSegments = window.location.pathname.split('/').filter(Boolean);
  const userId = pathSegments[pathSegments.length - 1] || '';

  const handleSuccess = () => {
    window.location.href = backUrl;
  };

  const handleCancel = () => {
    window.location.href = backUrl;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 overflow-y-auto">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <EditTeamForm userId={userId} onSuccess={handleSuccess} onCancel={handleCancel} />
      </div>
    </div>
  );
};

const container = document.getElementById('app');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}
