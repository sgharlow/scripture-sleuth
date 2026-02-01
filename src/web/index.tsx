/**
 * Web entry point for Comment Conspiracy
 * This file is bundled to webroot/app.js
 */

import React from 'react';
import { createRoot } from 'react-dom/client';
import { App } from '../components/App';

// Mount the React app
const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
