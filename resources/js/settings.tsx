import './bootstrap';
import React from 'react';
import { createRoot } from 'react-dom/client';
import Settings from './pages/Settings';

const container = document.getElementById('app');
if (container) {
  const root = createRoot(container);
  root.render(<Settings />);
} else {
  console.error('Root element #app not found');
}
