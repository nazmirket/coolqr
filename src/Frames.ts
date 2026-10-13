import Konva from 'konva'

import { fillShape } from './Fill'
import * as Geometry from './Geometry'
import { DrawOpts, Frame } from './types'

type CornerRadius = number | [number, number, number, number]

function insetRadius(radius: CornerRadius, inset: number): CornerRadius {
	if (typeof radius === 'number') return Math.max(0, radius - inset)
	return radius.map(value => Math.max(0, value - inset)) as CornerRadius
}

function createMaskedFrame(
	opts: DrawOpts,
	outer: Konva.Shape,
	inner: Konva.Shape,
): Konva.Group {
	const { x, y, w, fill, flip } = opts
	fillShape(outer, fill, w)
	inner.fill('#000000')
	inner.globalCompositeOperation('destination-out')

	const group = new Konva.Group({ x, y, width: w, height: w })
	group.add(outer, inner)
	group.cache({ x: 0, y: 0, width: w, height: w, pixelRatio: 1 })
	Geometry.flip(group, flip)

	return group
}

function createRectFrame(opts: DrawOpts, cornerRadius: CornerRadius): Konva.Group {
	const moduleSize = opts.w / 7
	const outer = new Konva.Rect({
		x: 0,
		y: 0,
		width: opts.w,
		height: opts.w,
		cornerRadius,
	})
	const inner = new Konva.Rect({
		x: moduleSize,
		y: moduleSize,
		width: opts.w - moduleSize * 2,
		height: opts.w - moduleSize * 2,
		cornerRadius: insetRadius(cornerRadius, moduleSize),
	})

	return createMaskedFrame(opts, outer, inner)
}

const Frames = {
	square(opts: DrawOpts) {
		return createRectFrame(opts, 0)
	},
	rounded(opts: DrawOpts) {
		return createRectFrame(opts, opts.w / 5)
	},
	rounded2(opts: DrawOpts) {
		return createRectFrame(opts, opts.w / 3)
	},
	rounded3(opts: DrawOpts) {
		return createRectFrame(opts, [opts.w / 4, 0, opts.w / 4, 0])
	},
	rounded4(opts: DrawOpts) {
		return createRectFrame(opts, [opts.w / 2, 0, opts.w / 2, 0])
	},
	rounded5(opts: DrawOpts) {
		return createRectFrame(opts, [opts.w / 2, 0, opts.w / 4, 0])
	},
	rounded6(opts: DrawOpts) {
		return createRectFrame(opts, [0, opts.w / 4, opts.w / 4, opts.w / 4])
	},
	circle(opts: DrawOpts) {
		const moduleSize = opts.w / 7
		const outer = new Konva.Circle({
			x: opts.w / 2,
			y: opts.w / 2,
			radius: opts.w / 2,
		})
		const inner = new Konva.Circle({
			x: opts.w / 2,
			y: opts.w / 2,
			radius: opts.w / 2 - moduleSize,
		})

		return createMaskedFrame(opts, outer, inner)
	},
	squarecircle(opts: DrawOpts) {
		const moduleSize = opts.w / 7
		const outer = new Konva.Rect({
			x: 0,
			y: 0,
			width: opts.w,
			height: opts.w,
			cornerRadius: opts.w / 12,
		})
		const inner = new Konva.Circle({
			x: opts.w / 2,
			y: opts.w / 2,
			radius: opts.w / 2 - moduleSize,
		})

		return createMaskedFrame(opts, outer, inner)
	},
} as const satisfies Record<Frame, (opts: DrawOpts) => Konva.Group>

export default Frames
