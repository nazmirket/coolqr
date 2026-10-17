import { encodeQR } from './encoder'
import type { QRMatrix } from './encoder'
import type {
	ColorPattern,
	DotLayout,
	DotStyle,
	FinderInnerStyle,
	FinderStyle,
	QRLogo,
	RenderOptions,
} from './types'

const QUIET_ZONE = 4
const DEFAULT_SIZE = 512
const LOGO_LOAD_TIMEOUT_MS = 15000
const DOT_STYLES: readonly DotStyle[] = [
	'square',
	'rounded',
	'circle',
	'diamond',
	'hexagon',
	'octagon',
]
const DOT_LAYOUTS: readonly DotLayout[] = ['connected', 'isolated']
const FINDER_STYLES: readonly FinderStyle[] = ['square', 'rounded', 'circle']
const FINDER_INNER_STYLES: readonly FinderInnerStyle[] = [
	'square',
	'rounded',
	'circle',
	'diamond',
]
const PATTERNS: readonly ColorPattern[] = ['solid', 'linear', 'radial', 'checker']

function roundedRect(
	ctx: CanvasRenderingContext2D,
	x: number,
	y: number,
	width: number,
	height: number,
	radius: number,
): void {
	const r = Math.min(radius, width / 2, height / 2)
	ctx.moveTo(x + r, y)
	ctx.lineTo(x + width - r, y)
	ctx.quadraticCurveTo(x + width, y, x + width, y + r)
	ctx.lineTo(x + width, y + height - r)
	ctx.quadraticCurveTo(x + width, y + height, x + width - r, y + height)
	ctx.lineTo(x + r, y + height)
	ctx.quadraticCurveTo(x, y + height, x, y + height - r)
	ctx.lineTo(x, y + r)
	ctx.quadraticCurveTo(x, y, x + r, y)
	ctx.closePath()
}

function luminance([red, green, blue]: Uint8ClampedArray): number {
	const channel = (value: number) => {
		const normalized = value / 255
		return normalized <= 0.04045
			? normalized / 12.92
			: ((normalized + 0.055) / 1.055) ** 2.4
	}
	return 0.2126 * channel(red) + 0.7152 * channel(green) + 0.0722 * channel(blue)
}

function contrastRatio(first: number, second: number): number {
	const lighter = Math.max(first, second)
	const darker = Math.min(first, second)
	return (lighter + 0.05) / (darker + 0.05)
}

function getColor(ctx: CanvasRenderingContext2D, color: string): Uint8ClampedArray {
	if (
		typeof color !== 'string' ||
		!color.trim() ||
		typeof CSS === 'undefined' ||
		!CSS.supports('color', color)
	) {
		throw new RangeError(`Invalid QR color: ${String(color)}`)
	}
	let accepted = false
	for (const sentinel of ['#010203', '#fefdfc']) {
		ctx.fillStyle = sentinel
		const before = ctx.fillStyle
		ctx.fillStyle = color
		if (ctx.fillStyle !== before) {
			accepted = true
			break
		}
	}
	if (!accepted) throw new RangeError(`Invalid QR color: ${String(color)}`)
	ctx.clearRect(0, 0, 1, 1)
	ctx.fillRect(0, 0, 1, 1)
	return ctx.getImageData(0, 0, 1, 1).data
}

function validateColors(
	background: string,
	usedDarkColors: readonly { name: string; value: string }[],
	logoBackground?: string,
): void {
	const scratch = document.createElement('canvas')
	scratch.width = scratch.height = 1
	const ctx = scratch.getContext('2d', { willReadFrequently: true })
	if (!ctx) throw new Error('Canvas 2D is unavailable')
	const back = getColor(ctx, background)
	if (back[3] !== 255) throw new RangeError('QR background must be an opaque color')
	const backLum = luminance(back)
	for (const { name, value } of usedDarkColors) {
		const color = getColor(ctx, value)
		const colorLum = luminance(color)
		if (color[3] !== 255) throw new RangeError(`QR ${name} must be an opaque color`)
		if (backLum <= colorLum || contrastRatio(colorLum, backLum) < 4.5) {
			throw new RangeError(
				`QR ${name} must be darker than the background with at least 4.5:1 contrast`,
			)
		}
	}
	if (logoBackground) {
		const badge = getColor(ctx, logoBackground)
		if (badge[3] !== 255) throw new RangeError('Logo background must be opaque')
		const badgeLum = luminance(badge)
		for (const { name, value } of usedDarkColors) {
			const dark = getColor(ctx, value)
			const darkLum = luminance(dark)
			if (badgeLum <= darkLum || contrastRatio(darkLum, badgeLum) < 4.5) {
				throw new RangeError(
					`QR logo background must be lighter than ${name} with at least 4.5:1 contrast`,
				)
			}
		}
	}
}

function isFinder(row: number, column: number, size: number): boolean {
	return (
		(row < 7 && column < 7) ||
		(row < 7 && column >= size - 7) ||
		(row >= size - 7 && column < 7)
	)
}

function polygon(
	ctx: CanvasRenderingContext2D,
	points: readonly [number, number][],
): void {
	ctx.beginPath()
	ctx.moveTo(points[0][0], points[0][1])
	for (const [x, y] of points.slice(1)) ctx.lineTo(x, y)
	ctx.closePath()
	ctx.fill()
}

function drawShape(
	ctx: CanvasRenderingContext2D,
	x: number,
	y: number,
	width: number,
	height: number,
	style: DotStyle | FinderStyle | FinderInnerStyle,
): void {
	if (style === 'square') {
		ctx.fillRect(x, y, width, height)
		return
	}
	if (style === 'rounded') {
		ctx.beginPath()
		roundedRect(ctx, x, y, width, height, Math.min(width, height) * 0.22)
		ctx.fill()
		return
	}
	if (style === 'circle') {
		ctx.beginPath()
		ctx.ellipse(
			x + width / 2,
			y + height / 2,
			width * 0.49,
			height * 0.49,
			0,
			0,
			Math.PI * 2,
		)
		ctx.fill()
		return
	}
	if (style === 'diamond') {
		polygon(ctx, [
			[x + width / 2, y + height * 0.04],
			[x + width * 0.96, y + height / 2],
			[x + width / 2, y + height * 0.96],
			[x + width * 0.04, y + height / 2],
		])
		return
	}
	if (style === 'hexagon') {
		const inset = width * 0.24
		polygon(ctx, [
			[x + inset, y],
			[x + width - inset, y],
			[x + width, y + height / 2],
			[x + width - inset, y + height],
			[x + inset, y + height],
			[x, y + height / 2],
		])
		return
	}
	if (style === 'octagon') {
		const inset = Math.min(width, height) * 0.2
		polygon(ctx, [
			[x + inset, y],
			[x + width - inset, y],
			[x + width, y + inset],
			[x + width, y + height - inset],
			[x + width - inset, y + height],
			[x + inset, y + height],
			[x, y + height - inset],
			[x, y + inset],
		])
	}
}

interface ModuleNeighbors {
	top: boolean
	right: boolean
	bottom: boolean
	left: boolean
	topLeft: boolean
	topRight: boolean
	bottomRight: boolean
	bottomLeft: boolean
}

function drawConnectedContour(
	ctx: CanvasRenderingContext2D,
	x: number,
	y: number,
	width: number,
	height: number,
	style: DotStyle,
	neighbors: ModuleNeighbors,
): void {
	if (style === 'square') {
		ctx.fillRect(x, y, width, height)
		return
	}
	if (style === 'circle' || style === 'diamond' || style === 'hexagon') {
		// Every bridge stays inside its own dark cell. The neighboring cell draws
		// the other half, so light modules and finder separators remain untouched.
		const bridgeRatio = style === 'circle' ? 0.8 : style === 'diamond' ? 0.55 : 0.66
		const bridgeWidth = width * bridgeRatio
		const bridgeHeight = height * bridgeRatio
		const cornerRatio = style === 'circle' ? 0.42 : 0.34
		const cornerWidth = width * cornerRatio
		const cornerHeight = height * cornerRatio
		// A fully dark 2x2 intersection has no pinhole in its center.
		if (neighbors.top && neighbors.left && neighbors.topLeft)
			ctx.fillRect(x, y, cornerWidth, cornerHeight)
		if (neighbors.top && neighbors.right && neighbors.topRight)
			ctx.fillRect(x + width - cornerWidth, y, cornerWidth, cornerHeight)
		if (neighbors.bottom && neighbors.right && neighbors.bottomRight)
			ctx.fillRect(
				x + width - cornerWidth,
				y + height - cornerHeight,
				cornerWidth,
				cornerHeight,
			)
		if (neighbors.bottom && neighbors.left && neighbors.bottomLeft)
			ctx.fillRect(x, y + height - cornerHeight, cornerWidth, cornerHeight)
		if (neighbors.left || neighbors.right) {
			ctx.fillRect(
				neighbors.left ? x : x + width / 2,
				y + (height - bridgeHeight) / 2,
				(neighbors.left && neighbors.right ? 1 : 0.5) * width,
				bridgeHeight,
			)
		}
		if (neighbors.top || neighbors.bottom) {
			ctx.fillRect(
				x + (width - bridgeWidth) / 2,
				neighbors.top ? y : y + height / 2,
				bridgeWidth,
				(neighbors.top && neighbors.bottom ? 1 : 0.5) * height,
			)
		}
		drawShape(ctx, x, y, width, height, style)
		return
	}
	const topLeft = !neighbors.top && !neighbors.left
	const topRight = !neighbors.top && !neighbors.right
	const bottomRight = !neighbors.bottom && !neighbors.right
	const bottomLeft = !neighbors.bottom && !neighbors.left
	if (style === 'rounded') {
		const radius = Math.min(width, height) * 0.32
		const tl = topLeft ? radius : 0
		const tr = topRight ? radius : 0
		const br = bottomRight ? radius : 0
		const bl = bottomLeft ? radius : 0
		ctx.beginPath()
		ctx.moveTo(x + tl, y)
		ctx.lineTo(x + width - tr, y)
		ctx.quadraticCurveTo(x + width, y, x + width, y + tr)
		ctx.lineTo(x + width, y + height - br)
		ctx.quadraticCurveTo(x + width, y + height, x + width - br, y + height)
		ctx.lineTo(x + bl, y + height)
		ctx.quadraticCurveTo(x, y + height, x, y + height - bl)
		ctx.lineTo(x, y + tl)
		ctx.quadraticCurveTo(x, y, x + tl, y)
		ctx.closePath()
		ctx.fill()
		return
	}
	// Octagon facets shape the exposed silhouette of the cluster, not every cell.
	const cut = Math.min(width, height) * 0.18
	polygon(ctx, [
		[x + (topLeft ? cut : 0), y],
		[x + width - (topRight ? cut : 0), y],
		[x + width, y + (topRight ? cut : 0)],
		[x + width, y + height - (bottomRight ? cut : 0)],
		[x + width - (bottomRight ? cut : 0), y + height],
		[x + (bottomLeft ? cut : 0), y + height],
		[x, y + height - (bottomLeft ? cut : 0)],
		[x, y + (topLeft ? cut : 0)],
	])
}

function drawDataModule(
	ctx: CanvasRenderingContext2D,
	x: number,
	y: number,
	width: number,
	height: number,
	style: DotStyle,
	layout: DotLayout,
	neighbors: ModuleNeighbors,
): void {
	if (layout === 'connected') {
		drawConnectedContour(ctx, x, y, width, height, style, neighbors)
	} else if (style === 'square') {
		ctx.fillRect(x + width * 0.04, y + height * 0.04, width * 0.92, height * 0.92)
	} else {
		drawShape(ctx, x, y, width, height, style)
	}
}

function drawFinder(
	ctx: CanvasRenderingContext2D,
	edge: (index: number) => number,
	column: number,
	row: number,
	style: FinderStyle,
	innerStyle: FinderInnerStyle,
	outerColor: string,
	innerColor: string,
	background: string,
): void {
	const x0 = edge(column)
	const y0 = edge(row)
	const x1 = edge(column + 1)
	const y1 = edge(row + 1)
	const x6 = edge(column + 6)
	const y6 = edge(row + 6)
	const x7 = edge(column + 7)
	const y7 = edge(row + 7)
	ctx.fillStyle = outerColor
	drawShape(ctx, x0, y0, x7 - x0, y7 - y0, style)
	ctx.fillStyle = background
	drawShape(ctx, x1, y1, x6 - x1, y6 - y1, style)
	ctx.fillStyle = innerColor
	drawShape(
		ctx,
		edge(column + 2),
		edge(row + 2),
		edge(column + 5) - edge(column + 2),
		edge(row + 5) - edge(row + 2),
		innerStyle,
	)
}

function createDataFill(
	ctx: CanvasRenderingContext2D,
	pattern: ColorPattern,
	foreground: string,
	accent: string,
	start: number,
	end: number,
	angle: number,
): string | CanvasGradient {
	if (pattern === 'solid' || pattern === 'checker') return foreground
	const center = (start + end) / 2
	const halfDiagonal = Math.hypot(end - start, end - start) / 2
	if (pattern === 'radial') {
		const gradient = ctx.createRadialGradient(
			center,
			center,
			0,
			center,
			center,
			halfDiagonal,
		)
		gradient.addColorStop(0, foreground)
		gradient.addColorStop(1, accent)
		return gradient
	}
	const radians = (angle * Math.PI) / 180
	const dx = Math.cos(radians) * halfDiagonal
	const dy = Math.sin(radians) * halfDiagonal
	const gradient = ctx.createLinearGradient(
		center - dx,
		center - dy,
		center + dx,
		center + dy,
	)
	gradient.addColorStop(0, foreground)
	gradient.addColorStop(1, accent)
	return gradient
}

function loadLogo(src: string): Promise<HTMLImageElement> {
	if (typeof src !== 'string' || !src.trim()) {
		return Promise.reject(new RangeError('Logo source must be a nonempty URL'))
	}
	return new Promise((resolve, reject) => {
		const image = new Image()
		let settled = false
		const finish = (result: HTMLImageElement | Error) => {
			if (settled) return
			settled = true
			clearTimeout(timeout)
			image.onload = image.onerror = null
			if (result instanceof Error) reject(result)
			else resolve(result)
		}
		const timeout = setTimeout(
			() => finish(new Error('Logo image took too long to load')),
			LOGO_LOAD_TIMEOUT_MS,
		)
		image.crossOrigin = 'anonymous'
		image.onload = () => {
			if (!image.naturalWidth || !image.naturalHeight) {
				finish(new Error('Logo image has no dimensions'))
			} else finish(image)
		}
		image.onerror = () =>
			finish(
				new Error('Unable to load logo image; use a local file or a CORS-enabled URL'),
			)
		image.src = src
	})
}

interface LogoPlacement {
	column: number
	row: number
	span: number
}

function findLogoPlacement(qr: QRMatrix, span: number): LogoPlacement {
	const middle = (qr.size - 1) / 2
	const reach = Math.max(8, Math.ceil(qr.size * 0.18))
	let best: LogoPlacement | undefined
	let bestScore = Infinity
	for (
		let row = Math.max(4, Math.floor(middle - span / 2 - reach));
		row <= Math.min(qr.size - span - 4, Math.ceil(middle - span / 2 + reach));
		row++
	) {
		for (
			let column = Math.max(4, Math.floor(middle - span / 2 - reach));
			column <= Math.min(qr.size - span - 4, Math.ceil(middle - span / 2 + reach));
			column++
		) {
			let safe = true
			for (let y = row; y < row + span && safe; y++) {
				for (let x = column; x < column + span; x++) {
					if (qr.functionModules[y * qr.size + x]) {
						safe = false
						break
					}
				}
			}
			if (!safe) continue
			const dx = column + span / 2 - qr.size / 2
			const dy = row + span / 2 - qr.size / 2
			const score = dx * dx + dy * dy
			if (score < bestScore) {
				bestScore = score
				best = { column, row, span }
			}
		}
	}
	if (!best)
		throw new RangeError(
			'No safe logo area fits this QR code; reduce logo scale or padding',
		)
	return best
}

function drawLogo(
	ctx: CanvasRenderingContext2D,
	qr: QRMatrix,
	edge: (index: number) => number,
	logo: QRLogo,
	image: HTMLImageElement,
	canvasSize: number,
): void {
	const scale = logo.scale ?? 0.16
	if (!Number.isFinite(scale) || scale < 0.06 || scale > 0.2) {
		throw new RangeError('Logo scale must be between 0.06 and 0.2')
	}
	const padding = logo.padding ?? Math.max(3, Math.round(canvasSize / 64))
	if (!Number.isFinite(padding) || padding < 0 || padding > canvasSize * 0.05) {
		throw new RangeError('Logo padding must be between 0 and 5% of canvas size')
	}
	const symbolPixels = edge(QUIET_ZONE + qr.size) - edge(QUIET_ZONE)
	const imageSide = symbolPixels * scale
	const badgeSide = imageSide + padding * 2
	if (badgeSide > symbolPixels * 0.25) {
		throw new RangeError('Logo and padding cover too much of the QR symbol')
	}
	const modulePixels = symbolPixels / qr.size
	const span = Math.ceil(badgeSide / modulePixels) + 1
	const placement = findLogoPlacement(qr, span)
	const cellLeft = edge(QUIET_ZONE + placement.column)
	const cellTop = edge(QUIET_ZONE + placement.row)
	const cellRight = edge(QUIET_ZONE + placement.column + span)
	const cellBottom = edge(QUIET_ZONE + placement.row + span)
	const badgeX = cellLeft + (cellRight - cellLeft - badgeSide) / 2
	const badgeY = cellTop + (cellBottom - cellTop - badgeSide) / 2
	ctx.fillStyle = logo.background ?? '#ffffff'
	ctx.beginPath()
	roundedRect(
		ctx,
		badgeX,
		badgeY,
		badgeSide,
		badgeSide,
		Math.min(modulePixels, badgeSide * 0.16),
	)
	ctx.fill()
	const fit = Math.min(imageSide / image.naturalWidth, imageSide / image.naturalHeight)
	const width = image.naturalWidth * fit
	const height = image.naturalHeight * fit
	ctx.drawImage(
		image,
		badgeX + padding + (imageSide - width) / 2,
		badgeY + padding + (imageSide - height) / 2,
		width,
		height,
	)
}

/**
 * Render a QR symbol into a self-contained browser canvas. The caller owns the canvas.
 * A quiet zone and structural patterns are preserved even when data dots are styled.
 */
export async function renderQR(
	data: string,
	options: RenderOptions = {},
): Promise<HTMLCanvasElement> {
	if (typeof document === 'undefined' || typeof Image === 'undefined') {
		throw new Error('renderQR requires a browser with Canvas 2D support')
	}
	const size = options.size ?? DEFAULT_SIZE
	if (!Number.isInteger(size) || size < 64 || size > 4096) {
		throw new RangeError('QR canvas size must be an integer from 64 to 4096 pixels')
	}
	const dotStyle = options.dotStyle ?? 'square'
	const dotLayout = options.dotLayout ?? 'connected'
	const finderStyle = options.finderStyle ?? 'square'
	const finderInnerStyle = options.finderInnerStyle ?? 'square'
	const pattern = options.pattern ?? 'solid'
	if (!(DOT_STYLES as readonly string[]).includes(dotStyle))
		throw new RangeError('Invalid QR dot style')
	if (!(DOT_LAYOUTS as readonly string[]).includes(dotLayout))
		throw new RangeError('Invalid QR dot layout')
	if (!(FINDER_STYLES as readonly string[]).includes(finderStyle))
		throw new RangeError('Invalid QR finder style')
	if (!(FINDER_INNER_STYLES as readonly string[]).includes(finderInnerStyle))
		throw new RangeError('Invalid QR finder inner style')
	if (!(PATTERNS as readonly string[]).includes(pattern))
		throw new RangeError('Invalid QR color pattern')
	if (
		options.patternAngle !== undefined &&
		(!Number.isFinite(options.patternAngle) ||
			options.patternAngle < 0 ||
			options.patternAngle > 360)
	) {
		throw new RangeError('QR pattern angle must be between 0 and 360 degrees')
	}
	if (
		options.logo &&
		options.errorCorrectionLevel &&
		options.errorCorrectionLevel !== 'H'
	) {
		throw new RangeError('A logo requires error correction level H')
	}
	const errorCorrectionLevel = options.errorCorrectionLevel ?? (options.logo ? 'H' : 'M')
	const qr = encodeQR(data, { errorCorrectionLevel })
	const totalModules = qr.size + QUIET_ZONE * 2
	if (size < totalModules * 2)
		throw new RangeError(
			`Canvas needs at least ${totalModules * 2} pixels (two per module) for this QR version`,
		)
	const foreground = options.foreground ?? '#111827'
	const background = options.background ?? '#ffffff'
	const finderColor = options.finderColor ?? foreground
	const finderInnerColor = options.finderInnerColor ?? finderColor
	const accent = options.accent ?? foreground
	const darkColors = [
		{ name: 'foreground', value: foreground },
		{ name: 'finder color', value: finderColor },
		{ name: 'finder inner color', value: finderInnerColor },
	]
	if (pattern !== 'solid') darkColors.push({ name: 'accent', value: accent })
	validateColors(background, darkColors, options.logo?.background)
	const image = options.logo ? await loadLogo(options.logo.src) : undefined
	const canvas = document.createElement('canvas')
	canvas.width = canvas.height = size
	const ctx = canvas.getContext('2d', { willReadFrequently: false })
	if (!ctx) throw new Error('Canvas 2D is unavailable')
	const edge = (index: number) => Math.round((index * size) / totalModules)
	ctx.fillStyle = background
	ctx.fillRect(0, 0, size, size)
	const symbolStart = edge(QUIET_ZONE)
	const symbolEnd = edge(QUIET_ZONE + qr.size)
	const dataFill = createDataFill(
		ctx,
		pattern,
		foreground,
		accent,
		symbolStart,
		symbolEnd,
		options.patternAngle ?? 45,
	)
	const darkOutsideFinder = (row: number, column: number): boolean =>
		row >= 0 &&
		column >= 0 &&
		row < qr.size &&
		column < qr.size &&
		qr.modules[row * qr.size + column] === 1 &&
		!isFinder(row, column, qr.size)
	for (let row = 0; row < qr.size; row++) {
		for (let column = 0; column < qr.size; column++) {
			const offset = row * qr.size + column
			if (!qr.modules[offset] || isFinder(row, column, qr.size)) continue
			if (pattern === 'checker') {
				// Larger ink blocks preserve the sense of a continuous cluster.
				ctx.fillStyle =
					(Math.floor(row / 3) + Math.floor(column / 3)) % 2 === 0 ? foreground : accent
			} else {
				ctx.fillStyle = dataFill
			}
			const x = edge(QUIET_ZONE + column)
			const y = edge(QUIET_ZONE + row)
			const width = edge(QUIET_ZONE + column + 1) - x
			const height = edge(QUIET_ZONE + row + 1) - y
			drawDataModule(ctx, x, y, width, height, dotStyle, dotLayout, {
				top: darkOutsideFinder(row - 1, column),
				right: darkOutsideFinder(row, column + 1),
				bottom: darkOutsideFinder(row + 1, column),
				left: darkOutsideFinder(row, column - 1),
				topLeft: darkOutsideFinder(row - 1, column - 1),
				topRight: darkOutsideFinder(row - 1, column + 1),
				bottomRight: darkOutsideFinder(row + 1, column + 1),
				bottomLeft: darkOutsideFinder(row + 1, column - 1),
			})
		}
	}
	drawFinder(
		ctx,
		edge,
		QUIET_ZONE,
		QUIET_ZONE,
		finderStyle,
		finderInnerStyle,
		finderColor,
		finderInnerColor,
		background,
	)
	drawFinder(
		ctx,
		edge,
		QUIET_ZONE + qr.size - 7,
		QUIET_ZONE,
		finderStyle,
		finderInnerStyle,
		finderColor,
		finderInnerColor,
		background,
	)
	drawFinder(
		ctx,
		edge,
		QUIET_ZONE,
		QUIET_ZONE + qr.size - 7,
		finderStyle,
		finderInnerStyle,
		finderColor,
		finderInnerColor,
		background,
	)
	if (image && options.logo) drawLogo(ctx, qr, edge, options.logo, image, size)
	return canvas
}
