import { QROptions, Frame, Shape, Fill } from '../index'

import Konva from 'konva'
import * as qr from 'qrcode'

import Shapes from './Shapes'
import Frames from './Frames'
import Catalog from './Catalog'

function to2DArray<T>(data: T[], size: number): T[][] {
	const bits = [] as T[][]
	// CONVERT TO 2D ARRAY
	for (let c1 = 0; c1 < size; c1++) {
		bits[c1] = []
		for (let c2 = 0; c2 < size; c2++) bits[c1][c2] = data[c1 * size + c2]
	}
	return bits
}

function mark(bits: any[][], size: number): any[][] {
	const marked = [] as any[][]
	// MARK EYE AREA
	for (let c1 = 0; c1 < size; c1++) {
		marked[c1] = []
		for (let c2 = 0; c2 < size; c2++) {
			if (c1 < 7 && c2 < 7) marked[c1][c2] = 'e'
			else if (c1 < 7 && c2 > size - 8) marked[c1][c2] = 'e'
			else if (c1 > size - 8 && c2 < 7) marked[c1][c2] = 'e'
			else marked[c1][c2] = bits[c1][c2]
		}
	}

	// MARK LOGO AREA
	const offset = size > 35 ? 7 : 3
	for (let c1 = 0; c1 < size; c1++) {
		for (let c2 = 0; c2 < size; c2++) {
			if (c1 > size / 2 - offset && c1 < size / 2 + offset) {
				if (c2 > size / 2 - offset && c2 < size / 2 + offset) {
					if (marked[c1][c2] === 1) marked[c1][c2] = 'l1'
					else marked[c1][c2] = 'l0'
				}
			}
		}
	}

	return marked
}

function shape(i: number, j: number, l: number, opts: { shape: Shape; fill?: Fill }) {
	const fun = Shapes[opts.shape]

	if (!fun) return null

	const w = l * 30
	const x = i * 30
	const y = j * 30

	return fun({ x, y, w, fill: opts.fill as any })
}

function frame(
	i: number,
	j: number,
	l: number,
	opts: { shape: Frame; fill?: Fill },
	flip?: 'v' | 'h' | undefined,
) {
	const fun = Frames[opts.shape]

	if (!fun) return null

	const w = l * 30
	const x = i * 30
	const y = j * 30

	return fun({ x, y, w, fill: opts.fill as any, flip })
}

async function draw(
	data: string,
	container: HTMLDivElement,
	options: QROptions,
): Promise<Konva.Stage> {
	const raw = qr.create(data, {
		errorCorrectionLevel: 'Q',
	}).modules
	const s = raw.size
	const MarkedBits = mark(to2DArray(raw.data as any, s), s)

	// RENDER EYES
	const e1 = { i: 0, j: 0, l: 7 }
	const e2 = { i: 0, j: s - 7, l: 7 }
	const e3 = { i: s - 7, j: 0, l: 7 }

	const e1i = { i: 2, j: 2, l: 3 }
	const e2i = { i: 2, j: s - 5, l: 3 }
	const e3i = { i: s - 5, j: 2, l: 3 }

	const stage = new Konva.Stage({
		container,
		width: s * 30,
		height: s * 30,
	})

	const layer = new Konva.Layer({})

	// background
	const background = new Konva.Rect({ x: 0, y: 0, width: s * 30, height: s * 30 })
	//
	if (options.background.fill.type === 'solid') {
		background.fill(options.background.fill.color as string)
	}
	//
	else {
		const { type, colors } = options.background.fill.gradient as any
		if (type === 'linear') {
			background.fillLinearGradientStartPoint({ x: 0, y: 0 })
			background.fillLinearGradientEndPoint({ x: s * 30, y: s * 30 })
			background.fillLinearGradientColorStops([0, colors[0], 1, colors[1]])
		} else if (type === 'radial') {
			background.fillRadialGradientStartPoint({ x: (s * 30) / 2, y: (s * 30) / 2 })
			background.fillRadialGradientEndPoint({ x: (s * 30) / 2, y: (s * 30) / 2 })
			background.fillRadialGradientStartRadius(0)
			background.fillRadialGradientEndRadius(s * 30)
			background.fillRadialGradientColorStops([0, colors[0], 1, colors[1]])
		}
	}

	layer.add(background)

	// Render eyes
	layer.add(
		...([
			// eyes outer
			frame(e1.i, e1.j, e1.l, options.eyes.outer),
			frame(e2.i, e2.j, e2.l, options.eyes.outer, 'v'),
			frame(e3.i, e3.j, e3.l, options.eyes.outer, 'h'),
			// eyes inner
			shape(e1i.i, e1i.j, e1i.l, options.eyes.inner),
			shape(e2i.i, e2i.j, e2i.l, options.eyes.inner),
			shape(e3i.i, e3i.j, e3i.l, options.eyes.inner),
		].filter(x => x !== null) as Konva.Group[]),
	)

	// Render dots
	const dots = [] as Konva.Group[]
	for (let c1 = 0; c1 < s; c1++) {
		for (let c2 = 0; c2 < s; c2++) {
			if (
				MarkedBits[c1][c2] === 1 ||
				((!options.image?.hideDots || !(options.image.src?.length > 0)) &&
					MarkedBits[c1][c2] === 'l1')
			) {
				const dot = shape(c1, c2, 1, options.dots)
				if (dot) dots.push(dot)
			}
		}
	}
	layer.add(...dots)

	// determine logo rect
	const offset = s > 35 ? 7 : 3
	const logo = {
		i: Math.ceil(s / 2) - offset,
		j: Math.ceil(s / 2) - offset,
		l: offset * 2,
	}

	// Render logo
	try {
		if (options.image?.src) {
			const img = await new Promise<Konva.Image>((resolve, reject) => {
				if (!options.image?.src) return reject('No image')
				Konva.Image.fromURL(options.image?.src, resolve)
			})

			const margin = parseInt(options.image?.margin as any) || 0
			img.setAttrs({
				x: logo.i * 30 + margin,
				y: logo.j * 30 + margin,
				width: logo.l * 30 - margin * 2,
				height: logo.l * 30 - margin * 2,
			})

			layer.add(img)
		}
	} catch (error) {
		console.error(error)
	}

	stage.add(layer)

	return stage
}

export default { draw, catalog: Catalog }
