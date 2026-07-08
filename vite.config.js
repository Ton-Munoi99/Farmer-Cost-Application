import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { createHash } from 'node:crypto';
import { copyFileSync, cpSync, existsSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { basename, join, relative, resolve } from 'node:path';

const rootDir = process.cwd();
const distDir = resolve(rootDir, 'dist');

function listFiles(dir) {
  return readdirSync(dir).flatMap(name => {
    const fullPath = join(dir, name);
    const stat = statSync(fullPath);
    if (stat.isDirectory()) return listFiles(fullPath);
    return [fullPath];
  });
}

function createBuildHash(files) {
  const hash = createHash('sha256');
  files
    .map(file => ({
      path: `./${relative(distDir, file).replaceAll('\\', '/')}`,
      fullPath: file,
    }))
    .sort((a, b) => a.path.localeCompare(b.path))
    .forEach(file => {
      hash.update(file.path);
      hash.update('\0');
      hash.update(readFileSync(file.fullPath));
      hash.update('\0');
    });
  return hash.digest('hex').slice(0, 12);
}

function copyPwaAssets() {
  return {
    name: 'copy-pwa-assets',
    closeBundle() {
      copyFileSync(resolve(rootDir, 'manifest.json'), resolve(distDir, 'manifest.json'));
      cpSync(resolve(rootDir, 'icons'), resolve(distDir, 'icons'), { recursive: true });
      cpSync(resolve(rootDir, 'fonts'), resolve(distDir, 'fonts'), { recursive: true });

      const prodHtml = resolve(distDir, 'index.prod.html');
      const indexHtml = resolve(distDir, 'index.html');
      if (existsSync(prodHtml)) copyFileSync(prodHtml, indexHtml);
      if (existsSync(indexHtml)) {
        const html = readFileSync(indexHtml, 'utf8')
          .replaceAll('href="/manifest.json"', 'href="manifest.json"')
          .replaceAll('href="/icons/icon.svg"', 'href="icons/icon.svg"')
          .replaceAll('href="/icons/icon-192.png"', 'href="icons/icon-192.png"')
          .replaceAll('href="./assets/manifest.json"', 'href="manifest.json"')
          .replaceAll('href="./assets/icon.svg"', 'href="icons/icon.svg"')
          .replaceAll('href="./assets/icon-192.png"', 'href="icons/icon-192.png"');
        writeFileSync(indexHtml, html);
      }

      const precacheFiles = listFiles(distDir)
        .filter(file => basename(file) !== 'sw.js');
      const buildHash = createBuildHash(precacheFiles);
      const files = precacheFiles
        .map(file => `./${relative(distDir, file).replaceAll('\\', '/')}`);

      writeFileSync(resolve(distDir, 'sw.js'), `const CACHE_VERSION = 'ricecost-prod-${buildHash}';
const APP_CACHE = CACHE_VERSION + '-app';
const RUNTIME_CACHE = CACHE_VERSION + '-runtime';
const PRECACHE_ASSETS = ${JSON.stringify(files, null, 2)};

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(APP_CACHE);
    await cache.addAll(PRECACHE_ASSETS);
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(key => ![APP_CACHE, RUNTIME_CACHE].includes(key)).map(key => caches.delete(key)));
    await self.clients.claim();
  })());
});

async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;
  const response = await fetch(request);
  if (request.method === 'GET' && response && response.ok) {
    const cache = await caches.open(RUNTIME_CACHE);
    cache.put(request, response.clone());
  }
  return response;
}

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  if (event.request.mode === 'navigate') {
    event.respondWith(cacheFirst(event.request).catch(() => caches.match('./index.html')));
    return;
  }
  event.respondWith(cacheFirst(event.request).catch(() => caches.match(event.request)));
});
`);
    },
  };
}

function reactGlobalCompat() {
  return {
    name: 'react-global-compat',
    enforce: 'pre',
    transform(code, id) {
      if (id.endsWith('components.jsx')) {
        return {
          code: `import React from 'react';\n${code.replaceAll('window.React', 'React')}`,
          map: null,
        };
      }

      if (id.endsWith('RiceCostApp.jsx')) {
        return {
          code: `import React from 'react';\nimport { createRoot } from 'react-dom/client';\nconst ReactDOM = { createRoot };\n${code.replaceAll('window.ReactDOM', 'ReactDOM').replaceAll('window.React', 'React')}`,
          map: null,
        };
      }

      return null;
    },
  };
}

export default defineConfig({
  base: './',
  plugins: [reactGlobalCompat(), react({ jsxRuntime: 'classic' }), copyPwaAssets()],
  build: {
    emptyOutDir: true,
    rollupOptions: {
      input: resolve(rootDir, 'index.prod.html'),
      output: {
        inlineDynamicImports: true,
        entryFileNames: 'assets/ricecost-app.js',
        chunkFileNames: 'assets/ricecost-app.js',
        assetFileNames: 'assets/[name][extname]',
      },
    },
  },
});
