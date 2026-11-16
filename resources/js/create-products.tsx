import React from 'react';
import { createRoot } from 'react-dom/client';
import CreateProductForm from './components/CreateProductForm';
import '../css/app.css';

const App = () => {
  const handleSuccess = () => {
    window.location.href = '/products';
  };

  const handleCancel = () => {
    window.location.href = '/products';
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <CreateProductForm onSuccess={handleSuccess} onCancel={handleCancel} />
      </div>
    </div>
  );
};

const container = document.getElementById('app');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}