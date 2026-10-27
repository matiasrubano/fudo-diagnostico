/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { apiDevServer } from './scripts/vite-api-plugin.mts'

export default defineConfig({
  plugins: [react(), apiDevServer()],
  test: {
    environment: 'node',
    include: ['tests/**/*.test.ts'],
  },
})
