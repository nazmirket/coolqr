import { defineNuxtConfig } from 'nuxt/config'
import eslint from 'vite-plugin-eslint'

export default defineNuxtConfig({
	devtools: { enabled: true },
	app: {
		head: {
			title: 'CoolQR - Generate Custom QR Codes',
			meta: [
				{
					charset: 'utf-8',
				},
			],
			link: [
				{
					rel: 'icon',
					type: 'image/x-icon',
					href: '/icon.png',
				},
			],
		},
	},
	modules: ['@nuxtjs/tailwindcss'],

	devServer: {
		port: 9393,
	},

	ssr: false,

	vite: {
		plugins: [eslint()],
	},
	tailwindcss: {
		configPath: 'tailwind.config.js',
		injectPosition: 'first',
	},
})
