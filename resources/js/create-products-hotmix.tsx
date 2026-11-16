import React from 'react';
import { createRoot } from 'react-dom/client';
import CreateProductHotmixForm from './components/CreateProductHotmixForm';
import '../css/app.css';

const App = () => {
  const handleSuccess = () => {
    window.location.href = '/products-hotmix';
  };

  const handleCancel = () => {
    window.location.href = '/products-hotmix';
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <CreateProductHotmixForm onSuccess={handleSuccess} onCancel={handleCancel} />
      </div>
    </div>
  );
};

const container = document.getElementById('app');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}
