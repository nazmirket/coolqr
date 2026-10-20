import fs from 'node:fs'
import { createRequire } from 'node:module'
import assert from 'node:assert/strict'

const require = createRequire(import.meta.url)
if (!process.env.COOLQR_DECODER_PATH)
	throw new Error('Set COOLQR_DECODER_PATH to a local jsQR 1.4.0 browser bundle')
const { chromium } = require(process.env.COOLQR_PLAYWRIGHT_MODULE || 'playwright')
const root = process.cwd()
const source = name => fs.readFileSync(`${root}/dist/${name}.js`, 'utf8')
const bundle = `const penalty={};((exports)=>{${source('encoder/penalty')}})(penalty);const encoder={};((exports,require)=>{${source('encoder/index')}})(encoder,()=>penalty);const logo={};((exports)=>{${source('logo')}})(logo);const renderer={};((exports,require)=>{${source('Render')}})(renderer,name=>name==='./logo'?logo:encoder);window.qr={...encoder,...renderer};`
;(async () => {
	const browser = await chromium.launch({
		executablePath: process.env.COOLQR_BROWSER_PATH,
		headless: true,
	})
	try {
		const page = await browser.newPage()
		await page.setContent('<html></html>')
		await page.addScriptTag({ content: bundle })
		await page.addScriptTag({ path: process.env.COOLQR_DECODER_PATH })
		const result = await page.evaluate(async () => {
			const failures = []
			let decoded = 0,
				pixelCases = 0
			const styles = [
				'square',
				'rounded',
				'circle',
				'diamond',
				'hexagon',
				'octagon',
				'squircle',
				'leaf',
				'horizontal',
				'vertical',
			]
			const svg = s => 'data:image/svg+xml,' + encodeURIComponent(s)
			const logos = [
				undefined,
				{
					src: svg(
						'<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><circle cx="50" cy="50" r="30" fill="#127542"/></svg>',
					),
					padding: 0,
				},
				{
					src: svg(
						'<svg xmlns="http://www.w3.org/2000/svg" width="180" height="45"><rect width="180" height="45" fill="#294536"/></svg>',
					),
					padding: 3,
				},
			]
			for (const data of [
				'https://example.com/coolqr',
				'Hello, İstanbul 🌿',
				'0123456789012345678901234567890123456789',
			])
				for (const dotStyle of styles)
					for (const dotLayout of ['connected', 'isolated'])
						for (const logo of logos) {
							const canvas = await window.qr.renderQR(data, {
								size: 420,
								dotStyle,
								dotLayout,
								logo,
								background: '#f2f6e9',
							})
							const ctx = canvas.getContext('2d')
							const pixels = ctx.getImageData(0, 0, 420, 420).data
							const read = window.jsQR(pixels, 420, 420)
							if (read?.data !== data)
								failures.push({ data, dotStyle, dotLayout, logo: !!logo })
							else decoded++
							if (!logo) {
								const matrix = window.qr.encodeQR(data)
								const edge = i => Math.round((i * 420) / (matrix.size + 8))
								for (let r = 0; r < matrix.size; r++)
									for (let c = 0; c < matrix.size; c++) {
										const x = Math.floor((edge(c + 4) + edge(c + 5)) / 2),
											y = Math.floor((edge(r + 4) + edge(r + 5)) / 2)
										// Light cells must stay entirely clear, not merely retain a light center.
										if (!matrix.modules[r * matrix.size + c])
											for (let py = edge(r + 4); py < edge(r + 5); py++)
												for (let px = edge(c + 4); px < edge(c + 5); px++)
													if (pixels[(py * 420 + px) * 4] !== 242)
														throw Error('Ink entered a light cell: ' + dotStyle)
										const dark = pixels[(y * 420 + x) * 4] < 120
										if (dark !== !!matrix.modules[r * matrix.size + c])
											throw Error('Module center changed ' + dotStyle + ' ' + r + ',' + c)
									}
								pixelCases++
							}
						}
			// A transparent image must leave every pixel unchanged, including connected contours.
			const invisible = {
				src: svg('<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"/>'),
				padding: 8,
			}
			const base = await window.qr.renderQR('transparent test', {
				errorCorrectionLevel: 'H',
				dotStyle: 'circle',
			})
			const clear = await window.qr.renderQR('transparent test', {
				logo: invisible,
				dotStyle: 'circle',
			})
			if (base.toDataURL() !== clear.toDataURL())
				throw Error('Transparent logo erased modules')
			return { decoded, pixelCases, failures }
		})
		process.stdout.write(JSON.stringify(result, null, 2) + '\n')
		assert.equal(result.failures.length, 0)
	} finally {
		await browser.close()
	}
})()
