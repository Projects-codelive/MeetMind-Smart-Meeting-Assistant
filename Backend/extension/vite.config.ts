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
      const destDir = resolve(__dirname, 'dist/src/popup');
      const destOffscreen = resolve(__dirname, 'dist');
      
      if (!existsSync(destDir)) {
        mkdirSync(destDir, { recursive: true });
      }
      
      const srcPopup = resolve(__dirname, 'src/popup/popup.js');
      const destPopup = resolve(destDir, 'popup.js');
      if (existsSync(srcPopup)) {
        copyFileSync(srcPopup, destPopup);
      }
      
      const srcOffscreen = resolve(__dirname, 'src/offscreen.html');
      const destOffscreenFile = resolve(destOffscreen, 'offscreen.html');
      if (existsSync(srcOffscreen)) {
        copyFileSync(srcOffscreen, destOffscreenFile);
      }
    },
  };
}

export default defineConfig({
  plugins: [
    react(),
    crx({ manifest }),
    copyPopupPlugin()
  ],
  build: {
    outDir: 'dist',
    modulePreload: {
      polyfill: false,
    },
  },
});