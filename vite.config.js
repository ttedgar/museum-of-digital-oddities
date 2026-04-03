import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// If deploying to https://USERNAME.github.io/REPO-NAME/ set base to '/REPO-NAME/'
// If deploying to https://USERNAME.github.io/ leave as '/'
export default defineConfig({
  plugins: [react()],
  base: '/',
})
