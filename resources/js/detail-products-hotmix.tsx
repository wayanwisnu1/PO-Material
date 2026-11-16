import React from 'react';
import { createRoot } from 'react-dom/client';
import DetailProductHotmixView from './components/DetailProductHotmixView';
import '../css/app.css';

const App = () => {
  const productId = window.location.pathname.split('/').pop() || '';
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <DetailProductHotmixView productId={productId} onCancel={() => window.location.href = '/products-hotmix'} />
      </div>
    </div>
  );
};

const container = document.getElementById('app');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}
