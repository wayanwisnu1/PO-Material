import React from 'react';
import { createRoot } from 'react-dom/client';
import LoginPage from './pages/LoginPage';

const container = document.getElementById('app');
if (container) {
  createRoot(container).render(<LoginPage />);
}
