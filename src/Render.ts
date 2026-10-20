import { alignmentCoordinates, encodeQR } from './encoder'
import { prepareLogo, validateLogo } from './logo'
import type {
	ColorPattern,
	DotLayout,
	DotStyle,
	FinderInnerStyle,
	FinderStyle,
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
	'squircle',
	'leaf',
	'horizontal',
	'vertical',
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
	if (logoBackground !== undefined) {
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
	if (
		style === 'squircle' ||
		style === 'leaf' ||
		style === 'horizontal' ||
		style === 'vertical'
	) {
		drawConnectedContour(ctx, x, y, width, height, style, {
			top: false,
			right: false,
			bottom: false,
			left: false,
		})
		return
	}
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
	if (style === 'horizontal') {
		// Small modules need heavier strokes to survive pixel quantization.
		const inset = height * (Math.min(width, height) < 6 ? 0.04 : 0.06)
		if (!neighbors.top) {
			y += inset
			height -= inset
		}
		if (!neighbors.bottom) height -= inset
	}
	if (style === 'vertical') {
		const inset = width * 0.08
		if (!neighbors.left) {
			x += inset
			width -= inset
		}
		if (!neighbors.right) width -= inset
	}
	// Only exposed corners are shaped. Shared edges stay flush, so straight
	// runs, elbows and solid 2x2 blocks form one silhouette without bridge seams.
	const exposed = [
		!neighbors.top && !neighbors.left,
		!neighbors.top && !neighbors.right,
		!neighbors.bottom && !neighbors.right,
		!neighbors.bottom && !neighbors.left,
	]
	const curved = !['diamond', 'hexagon', 'octagon'].includes(style)
	if (style === 'leaf') {
		exposed[1] = false
		exposed[3] = false
	}
	const ratioX =
		style === 'squircle'
			? 0.16
			: style === 'rounded'
				? 0.32
				: style === 'hexagon'
					? 0.25
					: style === 'octagon'
						? 0.2
						: 0.5
	const ratioY = style === 'hexagon' ? 0.5 : ratioX
	const corners = exposed.map(value => [
		value ? width * ratioX : 0,
		value ? height * ratioY : 0,
	])
	const [tl, tr, br, bl] = corners
	ctx.beginPath()
	ctx.moveTo(x + tl[0], y)
	ctx.lineTo(x + width - tr[0], y)
	if (curved) ctx.quadraticCurveTo(x + width, y, x + width, y + tr[1])
	else ctx.lineTo(x + width, y + tr[1])
	ctx.lineTo(x + width, y + height - br[1])
	if (curved) ctx.quadraticCurveTo(x + width, y + height, x + width - br[0], y + height)
	else ctx.lineTo(x + width - br[0], y + height)
	ctx.lineTo(x + bl[0], y + height)
	if (curved) ctx.quadraticCurveTo(x, y + height, x, y + height - bl[1])
	else ctx.lineTo(x, y + height - bl[1])
	ctx.lineTo(x, y + tl[1])
	if (curved) ctx.quadraticCurveTo(x, y, x + tl[0], y)
	else ctx.lineTo(x + tl[0], y)
	ctx.closePath()
	ctx.fill()
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

function drawLocator(
	ctx: CanvasRenderingContext2D,
	edge: (index: number) => number,
	column: number,
	row: number,
	style: FinderStyle,
	innerStyle: FinderInnerStyle,
	outerColor: string,
	innerColor: string,
	background: string,
	span = 7,
): void {
	const x0 = edge(column)
	const y0 = edge(row)
	const x1 = edge(column + 1)
	const y1 = edge(row + 1)
	const x6 = edge(column + span - 1)
	const y6 = edge(row + span - 1)
	const x7 = edge(column + span)
	const y7 = edge(row + span)
	ctx.fillStyle = outerColor
	drawShape(ctx, x0, y0, x7 - x0, y7 - y0, style)
	ctx.fillStyle = background
	drawShape(ctx, x1, y1, x6 - x1, y6 - y1, style)
	ctx.fillStyle = innerColor
	const centerX = (x0 + x7) / 2
	const centerY = (y0 + y7) / 2
	// Balance unlike frame/center shapes optically without changing their silhouettes.
	// Diamond centers need more ink; square centers inside circles need more clear ring.
	const centerScale =
		innerStyle === 'diamond'
			? 1.2
			: style === 'circle' && innerStyle !== 'circle'
				? 0.85
				: 1
	const centerWidth = (edge(column + span - 2) - edge(column + 2)) * centerScale
	const centerHeight = (edge(row + span - 2) - edge(row + 2)) * centerScale
	drawShape(
		ctx,
		centerX - centerWidth / 2,
		centerY - centerHeight / 2,
		centerWidth,
		centerHeight,
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

/**
 * Render a QR symbol into a self-contained browser canvas. The caller owns the canvas.
 * A quiet zone and structural patterns are preserved even when data dots are styled.
 */
export async function renderQR(
	data: string,
	options: RenderOptions = {},
): Promise<HTMLCanvasElement> {
	if (typeof document === 'undefined') {
		throw new Error('renderQR requires a browser with Canvas 2D support')
	}
	if (!options || typeof options !== 'object')
		throw new RangeError('QR options must be an object')
	// Callers may change reactive options while an image is loading.
	options = {
		...options,
		...(options.logo !== undefined ? { logo: { ...options.logo } } : {}),
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
	if (options.logo) {
		validateLogo(options.logo, size)
		if (typeof Image === 'undefined')
			throw new Error('Logo rendering requires a browser Image implementation')
	}
	const image = options.logo ? await loadLogo(options.logo.src) : undefined
	const canvas = document.createElement('canvas')
	canvas.width = canvas.height = size
	const ctx = canvas.getContext('2d', { willReadFrequently: false })
	if (!ctx) throw new Error('Canvas 2D is unavailable')
	const edge = (index: number) => Math.round((index * size) / totalModules)
	const logo =
		image && options.logo ? prepareLogo(qr, edge, options.logo, image, size) : undefined
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
	// Alignment targets are continuous locator rings, styled like the finder eyes.
	// Keep them separate from data contours, even in isolated-dot layouts.
	const alignment = alignmentCoordinates(qr.version, qr.size)
	const alignmentOrigins: { row: number; column: number }[] = []
	const alignmentModules = new Uint8Array(qr.modules.length)
	for (let r = 0; r < alignment.length; r++) {
		for (let c = 0; c < alignment.length; c++) {
			if (
				(r === 0 && c === 0) ||
				(r === 0 && c === alignment.length - 1) ||
				(c === 0 && r === alignment.length - 1)
			)
				continue
			const row = alignment[r] - 2
			const column = alignment[c] - 2
			alignmentOrigins.push({ row, column })
			for (let y = row; y < row + 5; y++)
				for (let x = column; x < column + 5; x++) alignmentModules[y * qr.size + x] = 1
		}
	}
	const darkOutsideFinder = (row: number, column: number): boolean =>
		row >= 0 &&
		column >= 0 &&
		row < qr.size &&
		column < qr.size &&
		qr.modules[row * qr.size + column] === 1 &&
		!logo?.removed[row * qr.size + column] &&
		!alignmentModules[row * qr.size + column] &&
		!isFinder(row, column, qr.size)
	for (let row = 0; row < qr.size; row++) {
		for (let column = 0; column < qr.size; column++) {
			const offset = row * qr.size + column
			if (
				!qr.modules[offset] ||
				logo?.removed[offset] ||
				alignmentModules[offset] ||
				isFinder(row, column, qr.size)
			)
				continue
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
			})
		}
	}
	drawLocator(
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
	drawLocator(
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
	drawLocator(
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
	for (const { row, column } of alignmentOrigins) {
		drawLocator(
			ctx,
			edge,
			column + QUIET_ZONE,
			row + QUIET_ZONE,
			finderStyle,
			finderInnerStyle,
			finderColor,
			finderInnerColor,
			background,
			5,
		)
	}
	if (logo) {
		if (options.logo?.background !== undefined) {
			ctx.fillStyle = options.logo.background
			ctx.fillRect(
				logo.x - logo.padding,
				logo.y - logo.padding,
				logo.image.width + logo.padding * 2,
				logo.image.height + logo.padding * 2,
			)
		}
		ctx.drawImage(logo.image, logo.x, logo.y)
	}
	return canvas
}
