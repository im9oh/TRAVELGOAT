import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// On GitHub Pages this is served from https://<user>.github.io/TRAVELGOAT/,
// so production assets must be referenced under that sub-path. Dev stays at /.
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/TRAVELGOAT/' : '/',
  plugins: [react(), tailwindcss()],
}))
