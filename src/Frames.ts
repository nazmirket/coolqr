import * as Geometry from './Geometry'

import { DrawOpts } from '../index'
import Konva from 'konva'

export default {
	square(opts: DrawOpts) {
		const { x, y, w, fill } = opts
		const s1 = new Konva.Rect({
			x: x + 10,
			y: y + 10,
			width: w - 20,
			height: w - 20,
			strokeWidth: 30,
			stroke: fill.color,
		})

		const group = new Konva.Group()
		group.add(s1)

		return group
	},
	rounded(opts: DrawOpts) {
		const { x, y, w, fill } = opts
		const s1 = new Konva.Rect({
			x: x + 10,
			y: y + 10,
			width: w - 20,
			height: w - 20,
			cornerRadius: w / 5,
			strokeWidth: 30,
			stroke: fill.color,
		})

		const group = new Konva.Group()
		group.add(s1)

		return group
	},
	rounded2(opts: DrawOpts) {
		const { x, y, w, fill } = opts
		const s1 = new Konva.Rect({
			x: x + 10,
			y: y + 10,
			width: w - 20,
			height: w - 20,
			cornerRadius: w / 3,
			strokeWidth: 30,
			stroke: fill.color,
		})

		const group = new Konva.Group()
		group.add(s1)

		return group
	},
	rounded3(opts: DrawOpts) {
		const { x, y, w, fill, flip } = opts
		const s1 = new Konva.Rect({
			x: x + 10,
			y: y + 10,
			width: w - 20,
			height: w - 20,
			cornerRadius: [w / 4, 0, w / 4, 0],
			strokeWidth: 30,
			stroke: fill.color,
		})

		const group = new Konva.Group()
		group.add(s1)

		return group
	},
	rounded4(opts: DrawOpts) {
		const { x, y, w, fill } = opts
		const s1 = new Konva.Rect({
			x: x + 10,
			y: y + 10,
			width: w - 20,
			height: w - 20,
			cornerRadius: [w / 2, 0, w / 2, 0],
			strokeWidth: 30,
			stroke: fill.color,
		})

		const group = new Konva.Group()
		group.add(s1)

		return group
	},
	rounded5(opts: DrawOpts) {
		const { x, y, w, fill, flip } = opts
		const s1 = new Konva.Rect({
			x: x + 10,
			y: y + 10,
			width: w - 20,
			height: w - 20,
			cornerRadius: [w / 2, 0, w / 4, 0],
			strokeWidth: 30,
			stroke: fill.color,
		})

		Geometry.flip(s1, flip)

		const group = new Konva.Group()
		group.add(s1)

		return group
	},
	rounded6(opts: DrawOpts) {
		const { x, y, w, fill, flip } = opts
		const s1 = new Konva.Rect({
			x: x + 10,
			y: y + 10,
			width: w - 20,
			height: w - 20,
			cornerRadius: [0, w / 4, w / 4, w / 4],
			strokeWidth: 30,
			stroke: fill.color,
		})

		Geometry.flip(s1, flip)

		const group = new Konva.Group()
		group.add(s1)

		return group
	},
	circle(opts: DrawOpts) {
		const { x, y, w, fill } = opts
		const s1 = new Konva.Ring({
			x: x + w / 2,
			y: y + w / 2,
			innerRadius: w / 3,
			outerRadius: w / 2,
			fill: fill.color,
		})

		const group = new Konva.Group()
		group.add(s1)

		return group
	},
	squarecircle(opts: DrawOpts) {
		const { x, y, w, fill } = opts

		const s1 = new Konva.Rect({
			x: x + 10,
			y: y + 10,
			width: w - 20,
			height: w - 20,
			strokeWidth: 30,
			stroke: fill.color,
			cornerRadius: w / 12,
		})

		const s2 = new Konva.Rect({
			x: x + 10,
			y: y + 10,
			width: w - 20,
			height: w - 20,
			strokeWidth: 30,
			stroke: fill.color,
			cornerRadius: w / 5,
		})

		const s3 = new Konva.Ring({
			x: x + w / 2,
			y: y + w / 2,
			innerRadius: w / 2.65,
			outerRadius: w / 2,
			fill: fill.color,
		})

		const group = new Konva.Group()

		group.add(s1)
		group.add(s2)
		group.add(s3)

		return group
	},
} as {
	[key: string]: (opts: DrawOpts) => Konva.Group
}
