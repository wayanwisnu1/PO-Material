import './bootstrap';
import React from 'react';
import { createRoot } from 'react-dom/client';
import Integrations from './pages/Integrations';

const container = document.getElementById('app');
if (container) {
  const root = createRoot(container);
  root.render(<Integrations />);
} else {
  console.error('Root element #app not found');
}
