import React from 'react';
import { createRoot } from 'react-dom/client';
import EditHotmixOrderForm from './components/EditHotmixOrderForm';
import '../css/app.css';

const App = () => {
  const orderId = window.location.pathname.split('/').pop();
  const params = new URLSearchParams(window.location.search);
  const from = params.get('from') || 'hotmix-orders';
  const backUrl = from === 'hotmix-orders' ? '/hotmix-orders' : '/dashboard';

  const handleSuccess = () => {
    window.location.href = backUrl;
  };

  const handleCancel = () => {
    window.location.href = backUrl;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 overflow-y-auto">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <EditHotmixOrderForm 
          orderId={orderId || ''}
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
};

const container = document.getElementById('app');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}
