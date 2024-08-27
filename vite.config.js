import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

import { readFileSync } from 'fs'
import { read, utils } from 'xlsx'

// https://vitejs.dev/config/
export default defineConfig({
  assetsInclude: ['**/*.xlsx'],
  plugins: [
    vue(),
    {
      // this plugin handles ?sheetjs tags
      name: 'vite-sheet',
      transform(code, id) {
        if (!id.match(/\?sheetjs$/)) return
        var wb = read(readFileSync(id.replace(/\?sheetjs$/, '')), {
          cellDates: true,
          dateNF: 'MM/DD/YYYY THH:mm:ss'
        })
        var data = utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]])
        return `export default JSON.parse('${JSON.stringify(data).replace(/\\/g, '\\\\')}')`
      }
    }
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  base: '/sandi-alumni-chart/'
})
