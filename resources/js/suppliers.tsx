import './bootstrap';
import React from 'react';
import { createRoot } from 'react-dom/client';
import Suppliers from './pages/Suppliers';

const container = document.getElementById('app');
if (container) {
  const root = createRoot(container);
  root.render(<Suppliers />);
} else {
  console.error('Root element #app not found');
}
