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

	moveTo() {
		this.pathPoints++
	}

	lineTo() {
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

	drawImage() {}
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

test('styles every non-finder dark module and joins adjacent circles', async () => {
	const data = 'https://example.com/coolqr'
	const qr = encodeQR(data)
	const darkCells = []
	for (let row = 0; row < qr.size; row++)
		for (let column = 0; column < qr.size; column++) {
			const offset = row * qr.size + column
			if (qr.modules[offset] && !isFinder(row, column, qr.size))
				darkCells.push({ row, column, function: Boolean(qr.functionModules[offset]) })
		}
	assert.ok(darkCells.some(cell => cell.function))
	const isolated = await renderQR(data, { dotStyle: 'circle', dotLayout: 'isolated' })
	const connected = await renderQR(data, { dotStyle: 'circle', dotLayout: 'connected' })
	assert.equal(isolated.context.ellipseStyles.length, darkCells.length)
	assert.equal(connected.context.ellipseStyles.length, darkCells.length)
	assert.ok(connected.context.fillRectCalls > isolated.context.fillRectCalls)

	const checker = await renderQR(data, {
		dotStyle: 'circle',
		dotLayout: 'isolated',
		pattern: 'checker',
		foreground: '#111827',
		accent: '#1e40af',
	})
	for (const [index, cell] of darkCells.entries()) {
		if (!cell.function) continue
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
	for (const [style, vertices] of [
		['diamond', 4],
		['hexagon', 6],
		['octagon', 8],
	]) {
		const canvas = await renderQR('https://example.com/coolqr', {
			dotStyle: style,
			dotLayout: 'connected',
		})
		assert.deepEqual([...new Set(canvas.context.filledPathPoints)], [vertices])
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
