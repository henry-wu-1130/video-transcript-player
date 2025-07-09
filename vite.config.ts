/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { resolve } from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    headers: {
      'Cache-Control': 'no-store',
    },
    host: true, // 允許外部訪問
    strictPort: true, // 如果端口被佔用就報錯，而不是嘗試下一個端口
    port: 5173, // 需要明確指定端口
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        mockServiceWorker: resolve(__dirname, 'public/mockServiceWorker.js'),
      },
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/setupTests.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text'],
      reportsDirectory: './coverage',
      all: false,
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        '**/*.{test,spec}.{ts,tsx}',
        '**/node_modules/**',
        '**/dist/**',
        '**/coverage/**',
        '**/public/**',
        '**/mocks/**',
        '**/tests/**',
        '**/src/App.tsx',
        '**/src/main.tsx',
        '**/src/setupTests.ts',
        '**/src/vite-env.d.ts',
        '**/src/services/**',
        '**/*.d.ts',
      ],
      thresholds: {
        branches: 70,
        functions: 70,
        lines: 70,
        statements: 70,
      },
      reportOnFailure: false,
    },
    // 排除不需要測試的文件
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/cypress/**',
      '**/.{idea,git,cache,output,temp}/**',
      '**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress}.config.*',
    ],
  },
});
