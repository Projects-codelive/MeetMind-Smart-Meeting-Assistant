import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { crx } from '@crxjs/vite-plugin';
import { resolve } from 'path';
import { copyFileSync, mkdirSync, existsSync } from 'fs';

import manifest from './public/manifest.json';

function copyPopupPlugin() {
  return {
    name: 'copy-popup',
    closeBundle() {
      const srcDir = resolve(__dirname, 'src/popup');
      const destDir = resolve(__dirname, 'dist/src/popup');
      if (!existsSync(destDir)) {
        mkdirSync(destDir, { recursive: true });
      }
      copyFileSync(
        resolve(srcDir, 'popup.js'),
        resolve(destDir, 'popup.js')
      );
    },
  };
}

export default defineConfig({
  plugins: [react(), crx({ manifest }), copyPopupPlugin()],
  build: {
    outDir: 'dist',
  },
});