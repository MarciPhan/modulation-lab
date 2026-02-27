import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
    root: 'src',
    base: './',
    build: {
        outDir: '../dist',
        emptyOutDir: true,
        rollupOptions: {
            external: ['plotly.js-dist-min'],
            output: {
                globals: {
                    'plotly.js-dist-min': 'Plotly'
                }
            }
        }
    },
    server: {
        port: 5173,
    }
});
