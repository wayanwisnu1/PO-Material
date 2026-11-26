import React from 'react';
import { createRoot } from 'react-dom/client';
import DetailCustomerView from './components/DetailCustomerView';
import '../css/app.css';

const App = () => {
  const customerId = window.location.pathname.split('/').pop();
  const params = new URLSearchParams(window.location.search);
  const from = params.get('from') || 'customers';
  const backUrl = from === 'customers' ? '/customers' : from === 'orders' ? '/orders' : '/dashboard';

  const handleBack = () => {
    window.location.href = backUrl;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 overflow-y-auto">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <DetailCustomerView
          customerId={customerId || ''}
          onBack={handleBack}
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
