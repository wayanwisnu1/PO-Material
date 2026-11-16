import './bootstrap';
import React from 'react';
import { createRoot } from 'react-dom/client';
import Analytics from './pages/Analytics';

const container = document.getElementById('app');
if (container) {
  const root = createRoot(container);
  root.render(<Analytics />);
} else {
  console.error('Root element #app not found');
}
