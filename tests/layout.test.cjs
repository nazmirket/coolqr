const assert = require('node:assert/strict')
const test = require('node:test')

const { colorStops } = require('../dist/Gradient.js')
const { loadImage } = require('../dist/ImageLoader.js')
const { createLayout, normalizeImageMargin } = require('../dist/Layout.js')

test('uses the requested size as the exact canvas size', () => {
	const layout = createLayout(1000, 25)

	assert.equal(layout.size, 1000)
	assert.equal(layout.moduleSize, 40)
})

test('supports fractional module sizes without changing the requested size', () => {
	const layout = createLayout(200, 21)

	assert.equal(layout.size, 200)
	assert.equal(layout.moduleSize, 200 / 21)
})

test('rejects invalid canvas sizes and module counts', () => {
	assert.throws(() => createLayout(0, 21), RangeError)
	assert.throws(() => createLayout(Number.NaN, 21), RangeError)
	assert.throws(() => createLayout(200, 0), RangeError)
	assert.throws(() => createLayout(200, 21.5), RangeError)
})

test('keeps image margins within valid image bounds', () => {
	assert.equal(normalizeImageMargin(-10, 100), 0)
	assert.equal(normalizeImageMargin(Number.NaN, 100), 0)
	assert.equal(normalizeImageMargin(20, 100), 20)
	assert.equal(normalizeImageMargin(75, 100), 50)
})

test('distributes every gradient color evenly', () => {
	assert.deepEqual(colorStops(['red', 'green', 'blue']), [
		0,
		'red',
		0.5,
		'green',
		1,
		'blue',
	])
})

test('resolves and rejects callback-based image loading', async () => {
	const image = { src: 'logo.png' }
	await assert.doesNotReject(loadImage('logo.png', (_src, onLoad) => onLoad(image)))
	assert.equal(await loadImage('logo.png', (_src, onLoad) => onLoad(image)), image)

	await assert.rejects(
		loadImage('missing.png', (_src, _onLoad, onError) => onError()),
		/Unable to load QR image: missing\.png/,
	)
})
