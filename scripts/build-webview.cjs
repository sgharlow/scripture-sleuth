#!/usr/bin/env node
/**
 * Build script for webview bundle
 * Uses esbuild with explicit React JSX configuration to avoid
 * inheriting Devvit's JSX settings from the root tsconfig
 */

const esbuild = require('esbuild');

esbuild.build({
  entryPoints: ['./src/webview/index.tsx'],
  bundle: true,
  outfile: './webroot/app.js',
  format: 'esm',
  target: 'es2020',
  loader: { '.tsx': 'tsx', '.ts': 'ts' },
  // Override tsconfig JSX settings to use React instead of Devvit
  tsconfigRaw: JSON.stringify({
    compilerOptions: {
      jsx: 'react-jsx',
      jsxImportSource: 'react',
      lib: ['ES2020', 'DOM'],
      module: 'ESNext',
      target: 'ES2020',
      strict: true,
      esModuleInterop: true,
      skipLibCheck: true,
    }
  }),
}).then(() => {
  console.log('Webview build complete');
}).catch((error) => {
  console.error('Webview build failed:', error);
  process.exit(1);
});
