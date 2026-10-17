import { createError, defineEventHandler, getRequestURL } from 'h3'

const publicAssets = new Set([
	'/apple-touch-icon.png',
	'/favicon.ico',
	'/favicon.svg',
	'/icon-192.png',
	'/icon-512.png',
	'/og-image.png',
	'/og-image.svg',
	'/robots.txt',
	'/site.webmanifest',
	'/sitemap.xml',
])

export default defineEventHandler(event => {
	const pathname = getRequestURL(event).pathname

	if (
		pathname === '/' ||
		pathname.startsWith('/_nuxt/') ||
		pathname.startsWith('/api/') ||
		publicAssets.has(pathname)
	) {
		return
	}

	throw createError({ statusCode: 404, statusMessage: 'Page not found' })
})
