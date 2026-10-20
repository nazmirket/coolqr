import type { QRMatrix } from './encoder'
import type { QRLogo } from './types'

export function validateLogo(logo: QRLogo, canvasSize: number): void {
	if (
		!logo ||
		typeof logo !== 'object' ||
		typeof logo.src !== 'string' ||
		!logo.src.trim()
	)
		throw new RangeError('Logo source must be a nonempty URL')
	const scale = logo.scale ?? 0.16
	if (!Number.isFinite(scale) || scale < 0.06 || scale > 0.2)
		throw new RangeError('Logo scale must be between 0.06 and 0.2')
	const padding = logo.padding ?? Math.max(3, Math.round(canvasSize / 64))
	if (!Number.isFinite(padding) || padding < 0 || padding > canvasSize * 0.05)
		throw new RangeError('Logo padding must be between 0 and 5% of canvas size')
}

export interface PreparedLogo {
	image: HTMLCanvasElement
	x: number
	y: number
	padding: number
	removed: Uint8Array
}

/** Rasterize once, then clear whole modules intersecting visible pixels plus padding. */
export function prepareLogo(
	qr: QRMatrix,
	edge: (index: number) => number,
	logo: QRLogo,
	image: HTMLImageElement,
	canvasSize: number,
): PreparedLogo {
	const symbolPixels = edge(qr.size + 4) - edge(4)
	const imageSide = symbolPixels * (logo.scale ?? 0.16)
	const padding = logo.padding ?? Math.max(3, Math.round(canvasSize / 64))
	if (imageSide + padding * 2 > symbolPixels * 0.25)
		throw new RangeError('Logo and padding cover too much of the QR symbol')
	const fit = imageSide / Math.max(image.naturalWidth, image.naturalHeight)
	const raster = document.createElement('canvas')
	raster.width = Math.max(1, Math.round(image.naturalWidth * fit))
	raster.height = Math.max(1, Math.round(image.naturalHeight * fit))
	const ctx = raster.getContext('2d', { willReadFrequently: true })
	if (!ctx) throw new Error('Canvas 2D is unavailable')
	ctx.drawImage(image, 0, 0, raster.width, raster.height)
	const pixels = ctx.getImageData(0, 0, raster.width, raster.height).data
	// Summed-area alpha occupancy makes each module query constant-time.
	const stride = raster.width + 1
	const sums = new Uint32Array(stride * (raster.height + 1))
	for (let y = 0; y < raster.height; y++) {
		let count = 0
		for (let x = 0; x < raster.width; x++) {
			count += pixels[(y * raster.width + x) * 4 + 3] > 0 ? 1 : 0
			sums[(y + 1) * stride + x + 1] = sums[y * stride + x + 1] + count
		}
	}
	const minModule = Math.floor(canvasSize / (qr.size + 8))
	const columns = Math.ceil((raster.width + padding * 2 + 1) / minModule)
	const rows = Math.ceil((raster.height + padding * 2 + 1) / minModule)
	let best: { column: number; row: number; score: number } | undefined
	for (let row = 0; row <= qr.size - rows; row++) {
		for (let column = 0; column <= qr.size - columns; column++) {
			const score =
				(column + columns / 2 - qr.size / 2) ** 2 + (row + rows / 2 - qr.size / 2) ** 2
			if (best && score >= best.score) continue
			let safe = true
			for (let y = row; y < row + rows && safe; y++)
				for (let x = column; x < column + columns; x++)
					if (qr.functionModules[y * qr.size + x]) {
						safe = false
						break
					}
			if (safe) best = { column, row, score }
		}
	}
	if (!best)
		throw new RangeError(
			'No safe logo area fits this QR code; reduce logo scale or padding',
		)
	const x = Math.round(
		(edge(best.column + 4) + edge(best.column + columns + 4) - raster.width) / 2,
	)
	const y = Math.round(
		(edge(best.row + 4) + edge(best.row + rows + 4) - raster.height) / 2,
	)
	const removed = new Uint8Array(qr.modules.length)
	for (let row = best.row; row < best.row + rows; row++) {
		for (let column = best.column; column < best.column + columns; column++) {
			const left = Math.max(
				0,
				Math.min(raster.width, Math.floor(edge(column + 4) - x - padding)),
			)
			const right = Math.max(
				0,
				Math.min(raster.width, Math.ceil(edge(column + 5) - x + padding)),
			)
			const top = Math.max(
				0,
				Math.min(raster.height, Math.floor(edge(row + 4) - y - padding)),
			)
			const bottom = Math.max(
				0,
				Math.min(raster.height, Math.ceil(edge(row + 5) - y + padding)),
			)
			const occupied =
				logo.background !== undefined
					? right > left && bottom > top
					: sums[bottom * stride + right] -
							sums[top * stride + right] -
							sums[bottom * stride + left] +
							sums[top * stride + left] >
						0
			if (occupied) removed[row * qr.size + column] = 1
		}
	}
	return { image: raster, x, y, padding, removed }
}
