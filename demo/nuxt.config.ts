import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
	compatibilityDate: '2024-04-03',
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

	tailwindcss: {
		configPath: 'tailwind.config.js',
	},
})
