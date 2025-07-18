import * as Geometry from './Geometry'
import { DrawOpts, Fill } from '../index'

import Konva from 'konva'

export default {
	square(opts: DrawOpts) {
		const { x, y, w, fill } = opts
		const s1 = new Konva.Rect({
			x,
			y,
			width: w,
			height: w,
		})

		fillShape(s1, fill, w)

		const group = new Konva.Group()
		group.add(s1)

		return group
	},
	rounded(opts: DrawOpts) {
		const { x, y, w, fill } = opts
		const s1 = new Konva.Rect({
			x,
			y,
			width: w,
			height: w,
			cornerRadius: w / 5,
		})

		fillShape(s1, fill, w)

		const group = new Konva.Group()
		group.add(s1)

		return group
	},
	rounded2(opts: DrawOpts) {
		const { x, y, w, fill } = opts
		const s1 = new Konva.Rect({
			x,
			y,
			width: w,
			height: w,
			cornerRadius: w / 3,
		})

		fillShape(s1, fill, w)

		const group = new Konva.Group()
		group.add(s1)

		return group
	},
	rounded3(opts: DrawOpts) {
		const { x, y, w, fill } = opts
		const s1 = new Konva.Rect({
			x,
			y,
			width: w,
			height: w,
			cornerRadius: [w / 4, 0, w / 2, 0],
		})

		fillShape(s1, fill, w)

		const group = new Konva.Group()
		group.add(s1)

		return group
	},
	rounded4(opts: DrawOpts) {
		const { x, y, w, fill } = opts
		const s1 = new Konva.Rect({
			x,
			y,
			width: w,
			height: w,
			cornerRadius: [w / 2, w / 2, w / 2, 0],
		})

		fillShape(s1, fill, w)

		const group = new Konva.Group()
		group.add(s1)

		return group
	},
	circle(opts: DrawOpts) {
		const { x, y, w, fill } = opts
		const s1 = new Konva.Circle({
			x: x + w / 2,
			y: y + w / 2,
			radius: w / 2,
		})

		fillShape(s1, fill, w)

		const group = new Konva.Group()
		group.add(s1)

		return group
	},

	diamond(opts: DrawOpts) {
		const { x, y, w, fill } = opts

		const x2 = x + (w * Math.sqrt(2) - w) / Math.sqrt(8)
		const y2 = y + (w * Math.sqrt(2) - w) / Math.sqrt(8)

		const w2 = w / Math.sqrt(2)

		const s1 = new Konva.Rect({
			x: x2,
			y: y2,
			width: w2,
			height: w2,
		})

		fillShape(s1, fill, w)

		Geometry.rotateAroundCenter(s1, 45)

		const group = new Konva.Group()
		group.add(s1)

		return group
	},
	cross(opts: DrawOpts) {
		const { x, y, w, fill } = opts

		const x2 = x
		const y2 = y + w / 4

		const w2 = w

		const s1 = new Konva.Rect({
			x: x2,
			y: y2,
			width: w2,
			height: w2 / 2,
		})

		fillShape(s1, fill, w)

		const s2 = s1.clone()
		Geometry.rotateAroundCenter(s2, 90)

		const group = new Konva.Group()
		group.add(s1)
		group.add(s2)

		return group
	},
	hexagon(opts: DrawOpts) {
		const { x, y, w, fill } = opts

		const s1 = new Konva.RegularPolygon({
			x: x + w / 2,
			y: y + w / 2,
			sides: 6,
			radius: w / 2,
		})

		fillShape(s1, fill, w)

		const group = new Konva.Group()
		group.add(s1)

		return group
	},
	sun(opts: DrawOpts) {
		const { x, y, w, fill } = opts

		const s1 = new Konva.Star({
			x: x + w / 2,
			y: y + w / 2,
			numPoints: 16,
			innerRadius: w / 3,
			outerRadius: w / 2,
		})

		fillShape(s1, fill, w)

		const group = new Konva.Group()

		group.add(s1)

		return group
	},

	octagon(opts: DrawOpts) {
		const { x, y, w, fill } = opts

		const s1 = new Konva.RegularPolygon({
			x: x + w / 2,
			y: y + w / 2,
			sides: 8,
			radius: w / 2,
		})

		fillShape(s1, fill, w)

		const group = new Konva.Group()
		group.add(s1)

		return group
	},
} as { [key: string]: (opts: DrawOpts) => Konva.Group }

function fillShape(shape: Konva.Shape, f: Fill, w: number) {
	try {
		if (!f) return
		if (f.type === 'solid') shape.fill(f.color as string)
		//
		else {
			const { type, colors } = f.gradient as any
			if (type === 'linear') {
				shape.fillLinearGradientStartPoint({ x: 0, y: 0 })
				shape.fillLinearGradientEndPoint({ x: w, y: w })
				shape.fillLinearGradientColorStops([0, colors[0], 1, colors[1]])
			} else if (type === 'radial') {
				shape.fillRadialGradientStartPoint({ x: w / 2, y: w / 2 })
				shape.fillRadialGradientEndPoint({ x: w / 2, y: w / 2 })
				shape.fillRadialGradientStartRadius(0)
				shape.fillRadialGradientEndRadius(w)
				shape.fillRadialGradientColorStops([0, colors[0], 1, colors[1]])
			}
		}
	} catch (error) {}
}
