import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
	compatibilityDate: '2024-04-03',
	devtools: { enabled: false },
	app: {
		head: {
			htmlAttrs: {
				lang: 'en',
			},
			title: 'CoolQR – Custom QR Code Generator with Shapes and Logo',
			meta: [
				{
					charset: 'utf-8',
				},
				{
					name: 'viewport',
					content: 'width=device-width, initial-scale=1',
				},
				{
					name: 'description',
					content:
						'Create custom QR codes with geometric shapes, color patterns, and your logo. Preview and download a crisp PNG privately in your browser.',
				},
				{
					name: 'robots',
					content: 'index, follow',
				},
				{
					name: 'theme-color',
					content: '#17191d',
				},
				{
					name: 'application-name',
					content: 'CoolQR',
				},
				{
					property: 'og:type',
					content: 'website',
				},
				{
					property: 'og:title',
					content: 'CoolQR – Custom QR Code Generator with Shapes and Logo',
				},
				{
					property: 'og:description',
					content:
						'Design a QR code with visual shape pickers, color patterns, and your logo. Preview and download privately in your browser.',
				},
				{
					property: 'og:url',
					content: 'https://qr.mirket.dev/',
				},
				{
					property: 'og:image',
					content: 'https://qr.mirket.dev/og-image.png',
				},
				{
					property: 'og:image:alt',
					content: 'CoolQR free QR code generator with logo',
				},
				{
					property: 'og:image:type',
					content: 'image/png',
				},
				{
					property: 'og:image:width',
					content: '1200',
				},
				{
					property: 'og:image:height',
					content: '630',
				},
				{
					name: 'twitter:card',
					content: 'summary_large_image',
				},
				{
					name: 'twitter:title',
					content: 'CoolQR – Custom QR Code Generator with Shapes and Logo',
				},
				{
					name: 'twitter:description',
					content:
						'Design a QR code with visual shape pickers, color patterns, and your logo. Preview and download privately in your browser.',
				},
				{
					name: 'twitter:image',
					content: 'https://qr.mirket.dev/og-image.png',
				},
				{
					name: 'twitter:image:alt',
					content: 'CoolQR free QR code generator with logo',
				},
			],
			link: [
				{
					rel: 'canonical',
					href: 'https://qr.mirket.dev/',
				},
				{
					rel: 'icon',
					type: 'image/x-icon',
					href: '/favicon.ico',
				},
				{
					rel: 'icon',
					type: 'image/svg+xml',
					href: '/favicon.svg',
				},
				{
					rel: 'icon',
					type: 'image/png',
					sizes: '192x192',
					href: '/icon-192.png',
				},
				{
					rel: 'apple-touch-icon',
					sizes: '180x180',
					href: '/apple-touch-icon.png',
				},
				{
					rel: 'manifest',
					href: '/site.webmanifest',
				},
			],
			script: [
				{
					type: 'application/ld+json',
					innerHTML: JSON.stringify({
						'@context': 'https://schema.org',
						'@type': 'WebApplication',
						name: 'CoolQR',
						url: 'https://qr.mirket.dev/',
						description:
							'Create custom QR codes for links and messages with geometric shapes, color patterns, a logo, and PNG download in your browser.',
						applicationCategory: 'UtilitiesApplication',
						operatingSystem: 'Any',
						isAccessibleForFree: true,
						featureList: [
							'Visual data dot and finder shape selection',
							'Solid, gradient, and alternating color patterns',
							'Custom colors and brand logo',
							'Instant browser preview',
							'PNG download',
							'On-device rendering without uploads',
						],
						offers: {
							'@type': 'Offer',
							price: '0',
							priceCurrency: 'USD',
						},
						sameAs: [
							'https://github.com/nazmirket/coolqr',
							'https://www.npmjs.com/package/coolqr',
						],
					}),
				},
			],
		},
	},
	modules: ['@nuxtjs/tailwindcss'],

	devServer: {
		port: 9393,
	},

	ssr: true,

	tailwindcss: {
		configPath: 'tailwind.config.js',
	},
})
