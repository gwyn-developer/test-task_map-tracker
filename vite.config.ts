import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
	base: './',

	build: {
		sourcemap: true,

		rollupOptions: {
			output: {
				entryFileNames: 'assets/[name].js',
				chunkFileNames: 'assets/[name].js',
				assetFileNames: 'assets/[name].[ext]',
				sourcemap: true
			}
		}
	},

	plugins: [vue()],

	resolve: {
		alias: {
			'@': fileURLToPath(new URL('./src', import.meta.url))
		}
	},

	server: {
		port: 8787
	},

	css: {
		preprocessorOptions: {
			scss: {
				additionalData: ' @import "./src/assets/scss/utils/vars.scss"; '
			}
		}
	}
})
