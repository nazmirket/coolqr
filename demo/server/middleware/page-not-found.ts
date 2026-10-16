import { createError, defineEventHandler, getRequestURL } from 'h3'

const publicAssets = new Set([
	'/apple-touch-icon.png',
	'/favicon.ico',
	'/favicon.svg',
	'/icon-192.png',
	'/icon-512.png',
	'/icon.png',
	'/og-image.png',
	'/robots.txt',
	'/site.webmanifest',
	'/sitemap.xml',
	'/circle.svg',
	'/cross.svg',
	'/diamond.svg',
	'/hexagon.svg',
	'/kite.svg',
	'/octagon.svg',
	'/rounded.svg',
	'/rounded2.svg',
	'/rounded3.svg',
	'/rounded4.svg',
	'/square.svg',
	'/sun.svg',
])

const frameAssets =
	/^\/frames\/(?:circle|rounded|rounded2|rounded3|rounded4|rounded5|rounded6|square|squarecircle)\.svg$/

export default defineEventHandler(event => {
	const pathname = getRequestURL(event).pathname

	if (
		pathname === '/' ||
		pathname.startsWith('/_nuxt/') ||
		pathname.startsWith('/api/') ||
		publicAssets.has(pathname) ||
		frameAssets.test(pathname)
	) {
		return
	}

	throw createError({ statusCode: 404, statusMessage: 'Page not found' })
})
