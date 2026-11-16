import './bootstrap';
import React from 'react';
import { createRoot } from 'react-dom/client';
import Dashboard from './pages/Dashboard';
import OrdersPage from './pages/OrdersPage';

const container = document.getElementById('app');
if (container) {
  const root = createRoot(container);
  
  // Routing sederhana berdasarkan path
  const path = window.location.pathname;
  if (path === '/orders') {
    root.render(<OrdersPage />);
  } else {
    root.render(<Dashboard />);
  }
} else {
  console.error('Root element #app not found');
}
