import { encodeQR } from './encoder'
import type { QRMatrix } from './encoder'
import type { DotStyle, QRLogo, RenderOptions } from './types'

const QUIET_ZONE = 4
const DEFAULT_SIZE = 512
const LOGO_LOAD_TIMEOUT_MS = 15000

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

function getColor(ctx: CanvasRenderingContext2D, color: string): Uint8ClampedArray {
	if (typeof color !== 'string' || !color.trim() || !CSS.supports('color', color)) {
		throw new RangeError(`Invalid QR color: ${String(color)}`)
	}
	ctx.clearRect(0, 0, 1, 1)
	ctx.fillStyle = color
	ctx.fillRect(0, 0, 1, 1)
	return ctx.getImageData(0, 0, 1, 1).data
}

function validateColors(
	foreground: string,
	background: string,
	logoBackground?: string,
): void {
	const scratch = document.createElement('canvas')
	scratch.width = scratch.height = 1
	const ctx = scratch.getContext('2d')
	if (!ctx) throw new Error('Canvas 2D is unavailable')
	const front = getColor(ctx, foreground)
	const back = getColor(ctx, background)
	if (front[3] !== 255 || back[3] !== 255) {
		throw new RangeError('QR foreground and background must be opaque colors')
	}
	const frontLum = luminance(front)
	const backLum = luminance(back)
	if (backLum <= frontLum || (backLum + 0.05) / (frontLum + 0.05) < 4.5) {
		throw new RangeError(
			'QR colors need a dark foreground and light background with at least 4.5:1 contrast',
		)
	}
	if (logoBackground) {
		const badge = getColor(ctx, logoBackground)
		if (badge[3] !== 255) throw new RangeError('Logo background must be opaque')
	}
}

function isFinder(row: number, column: number, size: number): boolean {
	return (
		(row < 7 && column < 7) ||
		(row < 7 && column >= size - 7) ||
		(row >= size - 7 && column < 7)
	)
}

function drawDataModule(
	ctx: CanvasRenderingContext2D,
	x: number,
	y: number,
	width: number,
	height: number,
	style: DotStyle,
): void {
	if (style === 'square') {
		ctx.fillRect(x, y, width, height)
		return
	}
	ctx.beginPath()
	if (style === 'rounded') {
		roundedRect(ctx, x, y, width, height, Math.min(width, height) * 0.18)
	} else {
		ctx.ellipse(
			x + width / 2,
			y + height / 2,
			width * 0.48,
			height * 0.48,
			0,
			0,
			Math.PI * 2,
		)
	}
	ctx.fill()
}

function drawFinder(
	ctx: CanvasRenderingContext2D,
	edge: (index: number) => number,
	column: number,
	row: number,
	style: 'square' | 'rounded',
): void {
	const x0 = edge(column)
	const y0 = edge(row)
	const x1 = edge(column + 1)
	const y1 = edge(row + 1)
	const x6 = edge(column + 6)
	const y6 = edge(row + 6)
	const x7 = edge(column + 7)
	const y7 = edge(row + 7)
	const radius = style === 'rounded' ? Math.min(x1 - x0, y1 - y0) * 0.8 : 0
	ctx.beginPath()
	roundedRect(ctx, x0, y0, x7 - x0, y7 - y0, radius)
	roundedRect(ctx, x1, y1, x6 - x1, y6 - y1, Math.max(0, radius * 0.45))
	ctx.fill('evenodd')
	ctx.beginPath()
	roundedRect(
		ctx,
		edge(column + 2),
		edge(row + 2),
		edge(column + 5) - edge(column + 2),
		edge(row + 5) - edge(row + 2),
		radius * 0.6,
	)
	ctx.fill()
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
	const finderStyle = options.finderStyle ?? 'square'
	if (!['square', 'rounded', 'circle'].includes(dotStyle))
		throw new RangeError('Invalid QR dot style')
	if (!['square', 'rounded'].includes(finderStyle))
		throw new RangeError('Invalid QR finder style')
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
	if (size < totalModules)
		throw new RangeError(
			`Canvas needs at least ${totalModules} pixels for this QR version`,
		)
	const foreground = options.foreground ?? '#111827'
	const background = options.background ?? '#ffffff'
	validateColors(foreground, background, options.logo?.background)
	const image = options.logo ? await loadLogo(options.logo.src) : undefined
	const canvas = document.createElement('canvas')
	canvas.width = canvas.height = size
	const ctx = canvas.getContext('2d', { willReadFrequently: false })
	if (!ctx) throw new Error('Canvas 2D is unavailable')
	const edge = (index: number) => Math.round((index * size) / totalModules)
	ctx.fillStyle = background
	ctx.fillRect(0, 0, size, size)
	ctx.fillStyle = foreground
	for (let row = 0; row < qr.size; row++) {
		for (let column = 0; column < qr.size; column++) {
			const offset = row * qr.size + column
			if (!qr.modules[offset] || isFinder(row, column, qr.size)) continue
			const x = edge(QUIET_ZONE + column)
			const y = edge(QUIET_ZONE + row)
			const width = edge(QUIET_ZONE + column + 1) - x
			const height = edge(QUIET_ZONE + row + 1) - y
			drawDataModule(
				ctx,
				x,
				y,
				width,
				height,
				qr.functionModules[offset] ? 'square' : dotStyle,
			)
		}
	}
	drawFinder(ctx, edge, QUIET_ZONE, QUIET_ZONE, finderStyle)
	drawFinder(ctx, edge, QUIET_ZONE + qr.size - 7, QUIET_ZONE, finderStyle)
	drawFinder(ctx, edge, QUIET_ZONE, QUIET_ZONE + qr.size - 7, finderStyle)
	if (image && options.logo) drawLogo(ctx, qr, edge, options.logo, image, size)
	return canvas
}
