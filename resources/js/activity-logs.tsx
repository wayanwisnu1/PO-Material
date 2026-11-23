import React from 'react';
import { createRoot } from 'react-dom/client';
import ActivityLogsPage from './pages/ActivityLogsPage';

const container = document.getElementById('app');
if (container) {
  const root = createRoot(container);
  root.render(<ActivityLogsPage />);
} else {
  console.error('Root element #app not found');
}
