import './bootstrap';
import React from 'react';
import { createRoot } from 'react-dom/client';
import HotmixOrdersPage from './pages/HotmixOrdersPage';

const container = document.getElementById('app');
if (container) {
  const root = createRoot(container);
  root.render(<HotmixOrdersPage />);
} else {
  console.error('Root element #app not found');
}
