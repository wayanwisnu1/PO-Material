import './bootstrap';
import React from 'react';
import { createRoot } from 'react-dom/client';
import Reports from './pages/Reports';

const container = document.getElementById('app');
if (container) {
  const root = createRoot(container);
  root.render(<Reports />);
} else {
  console.error('Root element #app not found');
}
