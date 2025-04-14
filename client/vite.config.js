// CRIO_SOLUTION_START_MODULE_ONE
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
  },
})
// CRIO_SOLUTION_END_MODULE_ONE