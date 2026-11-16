import './bootstrap';
import React from 'react';
import { createRoot } from 'react-dom/client';
import OrdersPage from './pages/OrdersPage';

const container = document.getElementById('app');
if (container) {
  const root = createRoot(container);
  root.render(<OrdersPage />);
} else {
  console.error('Root element #app not found');
}