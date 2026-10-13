export interface QRLayout {
	size: number
	moduleSize: number
}

export function createLayout(size: number, moduleCount: number): QRLayout {
	if (!Number.isFinite(size) || size <= 0) {
		throw new RangeError('QR size must be a positive, finite number')
	}

	if (!Number.isInteger(moduleCount) || moduleCount <= 0) {
		throw new RangeError('QR module count must be a positive integer')
	}

	return {
		size,
		moduleSize: size / moduleCount,
	}
}

export function normalizeImageMargin(margin: number, imageSize: number): number {
	if (!Number.isFinite(margin) || margin <= 0) return 0
	return Math.min(margin, imageSize / 2)
}
