const assert = require('node:assert/strict')
const test = require('node:test')
const { encodeQR } = require('../dist/index.js')
const { prepareLogo } = require('../dist/logo.js')

// Pixel fixture independent of Canvas drawing: a transparent border and a central mark.
function fixture(width, height, visible) {
	return {
		naturalWidth: width,
		naturalHeight: height,
		visible,
	}
}
global.document = {
	createElement() {
		const canvas = { width: 0, height: 0 }
		let image
		canvas.getContext = () => ({
			drawImage(source) {
				image = source
			},
			getImageData() {
				const data = new Uint8ClampedArray(canvas.width * canvas.height * 4)
				for (let y = 0; y < canvas.height; y++)
					for (let x = 0; x < canvas.width; x++)
						data[(y * canvas.width + x) * 4 + 3] = image.visible(
							x,
							y,
							canvas.width,
							canvas.height,
						)
							? 255
							: 0
				return { data }
			},
		})
		return canvas
	},
}

test('logo cutout removes exactly modules intersecting visible pixels and padding', () => {
	const qr = encodeQR('https://example.com/coolqr', { errorCorrectionLevel: 'H' })
	const edge = i => Math.round((i * 420) / (qr.size + 8))
	for (const padding of [0, 1.5, 5]) {
		const image = fixture(
			120,
			40,
			(x, y, w, h) => x >= w / 3 && x < (2 * w) / 3 && y >= h / 4 && y < (3 * h) / 4,
		)
		const placed = prepareLogo(qr, edge, { src: 'fixture', padding }, image, 420)
		assert.ok(placed.image.width > placed.image.height * 2)
		let removed = 0
		for (let row = 0; row < qr.size; row++)
			for (let column = 0; column < qr.size; column++) {
				let intersects = false
				for (let y = 0; y < placed.image.height; y++)
					for (let x = 0; x < placed.image.width; x++) {
						if (!image.visible(x, y, placed.image.width, placed.image.height)) continue
						if (
							placed.x + x + 1 + padding > edge(column + 4) &&
							placed.x + x - padding < edge(column + 5) &&
							placed.y + y + 1 + padding > edge(row + 4) &&
							placed.y + y - padding < edge(row + 5)
						)
							intersects = true
					}
				const offset = row * qr.size + column
				assert.equal(
					Boolean(placed.removed[offset]),
					intersects,
					`${row},${column} padding=${padding}`,
				)
				if (placed.removed[offset]) {
					removed++
					assert.equal(qr.functionModules[offset], 0)
				}
			}
		assert.ok(removed > 0)
	}
})

test('fully transparent logos preserve all modules; explicit backgrounds opt into a badge', () => {
	const qr = encodeQR('hello', { errorCorrectionLevel: 'H' })
	const edge = i => Math.round((i * 512) / (qr.size + 8))
	const image = fixture(100, 100, () => false)
	const transparent = prepareLogo(qr, edge, { src: 'fixture' }, image, 512)
	assert.equal(transparent.removed.some(Boolean), false)
	const badge = prepareLogo(qr, edge, { src: 'fixture', background: '#fff' }, image, 512)
	assert.ok(badge.removed.some(Boolean))
})
