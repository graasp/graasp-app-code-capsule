/// <reference types="./src/env"/>
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { UserConfigExport, defineConfig, loadEnv } from 'vite';
import checker from 'vite-plugin-checker';
import istanbul from 'vite-plugin-istanbul';

// https://vitejs.dev/config/
export default ({ mode }: { mode: string }): UserConfigExport => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

  return defineConfig({
    base: '',
    server: {
      port: parseInt(process.env.VITE_PORT, 10) || 4001,
      open: mode !== 'test', // open only when mode is different form test
      watch: {
        ignored: ['**/coverage/**'],
      },
    },
    preview: {
      strictPort: true,
      port: parseInt(process.env.VITE_PORT, 10) || 4001,
    },
    build: {
      outDir: 'build',
    },
    plugins: [
      checker({
        typescript: true,
        eslint: { lintCommand: 'eslint "./**/*.{ts,tsx}"' },
        overlay: {
          initialIsOpen: false,
        },
      }),
      react(),
      istanbul({
        include: 'src/*',
        exclude: ['node_modules', 'test/'],
        extension: ['.js', '.ts', '.tsx'],
        requireEnv: false,
        forceBuildInstrument: mode === 'test',
        checkProd: true,
      }),
    ],
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
      },
    },
  });
};
