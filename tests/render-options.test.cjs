const assert = require('node:assert/strict')
const test = require('node:test')

class FakeGradient {
	addColorStop() {}
}

class FakeContext {
	_fillStyle = '#000000'
	gradientCount = 0
	shapeCount = 0
	ellipseStyles = []
	fillRectCalls = 0
	filledPathPoints = []
	pathPoints = 0
	coordinates = []
	imageCalls = 0

	get fillStyle() {
		return this._fillStyle
	}

	set fillStyle(value) {
		if (typeof value === 'string' && value.startsWith('var(')) return
		this._fillStyle = value
	}

	clearRect() {}

	fillRect() {
		this.shapeCount++
		this.fillRectCalls++
	}

	beginPath() {
		this.pathPoints = 0
	}

	closePath() {}

	moveTo(...args) {
		this.coordinates.push(args)
		this.pathPoints++
	}

	lineTo(...args) {
		this.coordinates.push(args)
		this.pathPoints++
	}

	quadraticCurveTo() {}

	ellipse() {
		this.shapeCount++
		this.ellipseStyles.push(this.fillStyle)
	}

	fill() {
		this.shapeCount++
		if (this.pathPoints) this.filledPathPoints.push(this.pathPoints)
	}

	createLinearGradient() {
		this.gradientCount++
		return new FakeGradient()
	}

	createRadialGradient() {
		this.gradientCount++
		return new FakeGradient()
	}

	getImageData() {
		const color = String(this.fillStyle)
		const match = color.match(/^#([\da-f]{3}|[\da-f]{6})$/i)
		if (!match) return { data: new Uint8ClampedArray([255, 255, 255, 255]) }
		const hex =
			match[1].length === 3
				? match[1]
						.split('')
						.map(channel => channel + channel)
						.join('')
				: match[1]
		return {
			data: new Uint8ClampedArray([
				parseInt(hex.slice(0, 2), 16),
				parseInt(hex.slice(2, 4), 16),
				parseInt(hex.slice(4, 6), 16),
				255,
			]),
		}
	}

	drawImage() {
		this.imageCalls++
	}
}

class FakeCanvas {
	constructor() {
		this.context = new FakeContext()
	}

	getContext() {
		return this.context
	}
}

global.CSS = { supports: () => true }
global.Image = class FakeImage {
	constructor() {
		this.naturalWidth = 1
		this.naturalHeight = 1
	}

	set src(_) {
		queueMicrotask(() => this.onload?.())
	}
}
global.document = { createElement: () => new FakeCanvas() }

const { encodeQR, renderQR } = require('../dist/index.js')

function isFinder(row, column, size) {
	return (
		(row < 7 && column < 7) ||
		(row < 7 && column >= size - 7) ||
		(row >= size - 7 && column < 7)
	)
}

test('styles timing and metadata dots while keeping alignment targets continuous', async () => {
	const data = 'https://example.com/coolqr'
	const qr = encodeQR(data)
	assert.equal(qr.version, 2)
	const isAlignment = (row, column) =>
		row >= qr.size - 9 &&
		row <= qr.size - 5 &&
		column >= qr.size - 9 &&
		column <= qr.size - 5
	const darkCells = []
	for (let row = 0; row < qr.size; row++)
		for (let column = 0; column < qr.size; column++) {
			const offset = row * qr.size + column
			if (
				qr.modules[offset] &&
				!isFinder(row, column, qr.size) &&
				!isAlignment(row, column)
			)
				darkCells.push({ row, column, function: Boolean(qr.functionModules[offset]) })
		}
	assert.ok(darkCells.some(cell => cell.function))
	const isolated = await renderQR(data, { dotStyle: 'circle', dotLayout: 'isolated' })
	const connected = await renderQR(data, { dotStyle: 'circle', dotLayout: 'connected' })
	assert.equal(isolated.context.ellipseStyles.length, darkCells.length)
	assert.equal(connected.context.filledPathPoints.length, darkCells.length)
	assert.equal(connected.context.fillRectCalls, isolated.context.fillRectCalls)

	const checker = await renderQR(data, {
		dotStyle: 'circle',
		dotLayout: 'isolated',
		pattern: 'checker',
		foreground: '#111827',
		accent: '#1e40af',
	})
	for (const [index, cell] of darkCells.entries()) {
		const expected =
			(Math.floor(cell.row / 3) + Math.floor(cell.column / 3)) % 2 === 0
				? '#111827'
				: '#1e40af'
		assert.equal(checker.context.ellipseStyles[index], expected)
	}
})

test('renders every creative pattern and shape family through the canvas API', async () => {
	for (const pattern of ['solid', 'linear', 'radial', 'checker']) {
		const canvas = await renderQR('https://example.com/coolqr', {
			size: 320,
			dotStyle: 'hexagon',
			finderStyle: 'circle',
			finderInnerStyle: 'diamond',
			finderColor: '#0f172a',
			finderInnerColor: '#2563eb',
			pattern,
			accent: '#1e40af',
			patternAngle: 135,
		})
		assert.equal(canvas.width, 320)
		assert.equal(canvas.height, 320)
		assert.ok(canvas.context.shapeCount > 0)
		assert.equal(
			canvas.context.gradientCount,
			pattern === 'linear' || pattern === 'radial' ? 1 : 0,
		)
	}
})

test('connected polygon families retain distinct silhouettes', async () => {
	const signatures = []
	for (const style of ['diamond', 'hexagon', 'octagon']) {
		const canvas = await renderQR('https://example.com/coolqr', { dotStyle: style })
		signatures.push(JSON.stringify(canvas.context.coordinates))
	}
	assert.equal(new Set(signatures).size, 3)
})

test('new styles support both layouts and reject invalid options before loading images', async () => {
	for (const dotStyle of ['squircle', 'leaf', 'horizontal', 'vertical'])
		for (const dotLayout of ['connected', 'isolated']) {
			const canvas = await renderQR('hello', { dotStyle, dotLayout })
			assert.ok(canvas.context.filledPathPoints.length > 0)
		}
	await assert.rejects(renderQR('hello', null), /options must be an object/)
	await assert.rejects(
		renderQR('hello', { logo: { src: 'unused', scale: NaN } }),
		/Logo scale/,
	)
	await assert.rejects(
		renderQR('hello', { logo: { src: 'unused', background: '' } }),
		/Invalid QR color/,
	)
	const Image = global.Image
	delete global.Image
	try {
		assert.ok(await renderQR('hello'))
	} finally {
		global.Image = Image
	}
})

test('rejects canvases too small to preserve styled module detail', async () => {
	await assert.rejects(
		renderQR('https://example.com/coolqr/v9/' + 'a'.repeat(130), {
			size: 64,
		}),
		/two per module/,
	)
})

test('rejects low contrast creative colors and invalid pattern angles', async () => {
	await assert.rejects(
		renderQR('hello', { finderInnerColor: '#ffffff' }),
		/QR finder inner color must be darker/,
	)
	await assert.rejects(
		renderQR('hello', { pattern: 'linear', accent: '#ffffff' }),
		/QR accent must be darker/,
	)
	await assert.rejects(
		renderQR('hello', { patternAngle: 361 }),
		/QR pattern angle must be between 0 and 360/,
	)
	await assert.rejects(
		renderQR('hello', { dotLayout: 'scattered' }),
		/Invalid QR dot layout/,
	)
	await assert.rejects(
		renderQR('hello', { foreground: 'var(--ink)' }),
		/Invalid QR color/,
	)
	await assert.rejects(
		renderQR('hello', {
			logo: { src: 'data:image/png;base64,AA==', background: '#111827' },
		}),
		/QR logo background must be lighter/,
	)
})

test('in-flight renders retain their logo when callers edit the options object', async () => {
	const options = { logo: { src: 'fixture', scale: 0.16 } }
	const pending = renderQR('hello', options)
	options.logo.scale = 0.9
	options.logo = undefined
	const canvas = await pending
	assert.equal(canvas.context.imageCalls, 1)
})

test('isolated diamonds with circular eyes never silently render square modules', async () => {
	const canvas = await renderQR('https://example.com/portfolio', {
		dotStyle: 'diamond',
		dotLayout: 'isolated',
		finderStyle: 'circle',
		finderInnerStyle: 'circle',
		finderColor: '#20245d',
		finderInnerColor: '#4549a3',
		background: '#f4f4ff',
	})
	// Only the canvas background is a rectangle. Both large and small eyes are circles.
	assert.equal(canvas.context.fillRectCalls, 1)
	assert.equal(canvas.context.ellipseStyles.length, 12)
	assert.deepEqual([...new Set(canvas.context.filledPathPoints)], [4])
	assert.equal(
		canvas.context.ellipseStyles.filter(color => color === '#4549a3').length,
		4,
	)
})

test('dense codes style every alignment target, including those crossing timing lines', async () => {
	const data = 'A'.repeat(500)
	const qr = encodeQR(data)
	assert.ok(qr.version >= 7)
	const positions = Math.floor(qr.version / 7) + 2
	const targets = positions * positions - 3
	const canvas = await renderQR(data, {
		dotStyle: 'diamond',
		dotLayout: 'isolated',
		finderStyle: 'circle',
		finderInnerStyle: 'circle',
	})
	assert.equal(canvas.context.ellipseStyles.length, (3 + targets) * 3)
	assert.equal(canvas.context.fillRectCalls, 1)
})
