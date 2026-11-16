import React from 'react';
import { createRoot } from 'react-dom/client';
import EditProductForm from './components/EditProductForm';
import '../css/app.css';

const App = () => {
  const productId = window.location.pathname.split('/').pop() || '';
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <EditProductForm productId={productId} onSuccess={() => window.location.href = '/products'} onCancel={() => window.location.href = '/products'} />
      </div>
    </div>
  );
};

const container = document.getElementById('app');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}