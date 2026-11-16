import './bootstrap';
import React from 'react';
import { createRoot } from 'react-dom/client';
import ProductsBatuPage from './pages/ProductsBatuPage';

const container = document.getElementById('app');
if (container) {
  const root = createRoot(container);
  root.render(<ProductsBatuPage />);
} else {
  console.error('Root element #app not found');
}
