import './bootstrap';
import React from 'react';
import { createRoot } from 'react-dom/client';
import ProductsHotmixPage from './pages/ProductsHotmixPage';

const container = document.getElementById('app');
if (container) {
  const root = createRoot(container);
  root.render(<ProductsHotmixPage />);
} else {
  console.error('Root element #app not found');
}