const assert = require('node:assert/strict')
const test = require('node:test')

class FakeGradient {
	addColorStop() {}
}

class FakeContext {
	_fillStyle = '#000000'
	gradientCount = 0
	shapeCount = 0

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
	}

	beginPath() {}

	closePath() {}

	moveTo() {}

	lineTo() {}

	quadraticCurveTo() {}

	ellipse() {
		this.shapeCount++
	}

	fill() {
		this.shapeCount++
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

const { renderQR } = require('../dist/index.js')

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
