import Konva from 'konva'
import * as qr from 'qrcode'

import Catalog from './Catalog'
import { fillShape } from './Fill'
import Frames from './Frames'
import { loadImage } from './ImageLoader'
import { createLayout, normalizeImageMargin } from './Layout'
import Shapes from './Shapes'
import { Fill, Frame, QROptions, Shape } from './types'

export type { DrawOpts, Fill, Frame, Gradient, QROptions, Shape } from './types'

type QRBit = 0 | 1
type MarkedBit = QRBit | 'e' | 'l0' | 'l1'

function to2DArray(data: ArrayLike<number>, size: number): QRBit[][] {
	const bits: QRBit[][] = []
	for (let row = 0; row < size; row++) {
		bits[row] = []
		for (let column = 0; column < size; column++) {
			bits[row][column] = data[row * size + column] === 1 ? 1 : 0
		}
	}
	return bits
}

function mark(bits: QRBit[][], size: number): MarkedBit[][] {
	const marked: MarkedBit[][] = []
	for (let row = 0; row < size; row++) {
		marked[row] = []
		for (let column = 0; column < size; column++) {
			if (row < 7 && column < 7) marked[row][column] = 'e'
			else if (row < 7 && column > size - 8) marked[row][column] = 'e'
			else if (row > size - 8 && column < 7) marked[row][column] = 'e'
			else marked[row][column] = bits[row][column]
		}
	}

	const offset = size > 35 ? 7 : 3
	for (let row = 0; row < size; row++) {
		for (let column = 0; column < size; column++) {
			const insideRows = row > size / 2 - offset && row < size / 2 + offset
			const insideColumns = column > size / 2 - offset && column < size / 2 + offset

			if (insideRows && insideColumns) {
				marked[row][column] = marked[row][column] === 1 ? 'l1' : 'l0'
			}
		}
	}

	return marked
}

function createShape(
	column: number,
	row: number,
	length: number,
	moduleSize: number,
	options: { shape: Shape; fill: Fill },
) {
	const width = length * moduleSize
	return Shapes[options.shape]({
		x: column * moduleSize,
		y: row * moduleSize,
		w: width,
		fill: options.fill,
	})
}

function createFrame(
	column: number,
	row: number,
	length: number,
	moduleSize: number,
	options: { shape: Frame; fill: Fill },
	flip?: 'v' | 'h',
) {
	const width = length * moduleSize
	return Frames[options.shape]({
		x: column * moduleSize,
		y: row * moduleSize,
		w: width,
		fill: options.fill,
		flip,
	})
}

export async function draw(
	data: string,
	container: HTMLDivElement,
	options: QROptions,
): Promise<Konva.Stage> {
	const raw = qr.create(data, {
		errorCorrectionLevel: 'Q',
	}).modules
	const moduleCount = raw.size
	const { size, moduleSize } = createLayout(options.size, moduleCount)
	const markedBits = mark(to2DArray(raw.data, moduleCount), moduleCount)

	const stage = new Konva.Stage({
		container,
		width: size,
		height: size,
	})

	try {
		const layer = new Konva.Layer()
		const background = new Konva.Rect({ x: 0, y: 0, width: size, height: size })
		fillShape(background, options.background.fill, size)
		layer.add(background)

		const outerEyes = [
			createFrame(0, 0, 7, moduleSize, options.eyes.outer),
			createFrame(0, moduleCount - 7, 7, moduleSize, options.eyes.outer, 'v'),
			createFrame(moduleCount - 7, 0, 7, moduleSize, options.eyes.outer, 'h'),
		]
		const innerEyes = [
			createShape(2, 2, 3, moduleSize, options.eyes.inner),
			createShape(2, moduleCount - 5, 3, moduleSize, options.eyes.inner),
			createShape(moduleCount - 5, 2, 3, moduleSize, options.eyes.inner),
		]
		layer.add(...outerEyes, ...innerEyes)

		let logoImage: Konva.Image | undefined
		if (options.image?.src) {
			try {
				logoImage = await loadImage(options.image.src, Konva.Image.fromURL)
			} catch {
				logoImage = undefined
			}
		}

		const hideLogoDots = Boolean(logoImage && options.image?.hideDots)
		const dots: Konva.Group[] = []
		for (let row = 0; row < moduleCount; row++) {
			for (let column = 0; column < moduleCount; column++) {
				const bit = markedBits[row][column]
				if (bit === 1 || (!hideLogoDots && bit === 'l1')) {
					dots.push(createShape(column, row, 1, moduleSize, options.dots))
				}
			}
		}
		layer.add(...dots)

		if (logoImage && options.image) {
			const offset = moduleCount > 35 ? 7 : 3
			const logo = {
				column: Math.ceil(moduleCount / 2) - offset,
				row: Math.ceil(moduleCount / 2) - offset,
				length: offset * 2,
			}
			const logoSize = logo.length * moduleSize
			const margin = normalizeImageMargin(options.image.margin, logoSize)
			logoImage.setAttrs({
				x: logo.column * moduleSize + margin,
				y: logo.row * moduleSize + margin,
				width: logoSize - margin * 2,
				height: logoSize - margin * 2,
			})
			layer.add(logoImage)
		}

		stage.add(layer)
		return stage
	} catch (error) {
		stage.destroy()
		throw error
	}
}

export default { draw, catalog: Catalog }
