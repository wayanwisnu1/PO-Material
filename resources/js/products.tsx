import './bootstrap';
import React from 'react';
import { createRoot } from 'react-dom/client';
import ProductsPage from './pages/ProductsPage';

const container = document.getElementById('app');
if (container) {
  const root = createRoot(container);
  root.render(<ProductsPage />);
} else {
  console.error('Root element #app not found');
}
