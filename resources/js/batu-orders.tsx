import React from 'react';
import { createRoot } from 'react-dom/client';
import BatuOrdersPage from './pages/BatuOrdersPage';

const container = document.getElementById('app');
if (container) {
  const root = createRoot(container);
  root.render(<BatuOrdersPage />);
} else {
  console.error('Root element #app not found');
}
