/**
 * WebView Entry Point
 * Renders the React app inside the Devvit WebView
 */

import React from 'react';
import { createRoot } from 'react-dom/client';
import { App } from '../components/App';

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}
