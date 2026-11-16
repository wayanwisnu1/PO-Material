import './bootstrap';
import React from 'react';
import { createRoot } from 'react-dom/client';
import Team from './pages/Team';

const container = document.getElementById('app');
if (container) {
  const root = createRoot(container);
  root.render(<Team />);
} else {
  console.error('Root element #app not found');
}
