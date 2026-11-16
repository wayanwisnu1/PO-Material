import React from 'react';
import { createRoot } from 'react-dom/client';
import CreateSupplierForm from './components/CreateSupplierForm';
import '../css/app.css';

const App = () => {
  const params = new URLSearchParams(window.location.search);
  const from = params.get('from') || 'dashboard';
  const backUrl = from === 'orders' ? '/orders' : from === 'suppliers' ? '/suppliers' : '/dashboard';
  
  const handleSuccess = () => {
    window.location.href = backUrl;
  };

  const handleCancel = () => {
    window.location.href = backUrl;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 overflow-y-auto">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <CreateSupplierForm onSuccess={handleSuccess} onCancel={handleCancel} />
      </div>
    </div>
  );
};

const container = document.getElementById('app');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}
