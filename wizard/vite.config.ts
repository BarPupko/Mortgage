import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: './',           // relative paths so dist works at wizard/dist/
  build: {
    outDir: 'dist',
  },
})
