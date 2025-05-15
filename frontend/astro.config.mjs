// @ts-check
import { defineConfig } from 'astro/config';
import vue from '@astrojs/vue';
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';

import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  integrations: [vue()],
  vite: {
    optimizeDeps: {
      esbuildOptions: {
        define: {
          global: 'globalThis',
        },
        plugins: [
          NodeGlobalsPolyfillPlugin({ buffer: true }),
        ],
      },
    },

    plugins: [tailwindcss()],
  },
});