import Konva from 'konva'

import { colorStops } from './Gradient'
import { Fill } from './types'

export function fillShape(shape: Konva.Shape, fill: Fill, width: number, height = width) {
	if (fill.type === 'solid') {
		shape.fill(fill.color)
		return
	}

	const stops = colorStops(fill.gradient.colors)
	if (fill.gradient.type === 'linear') {
		shape.fillLinearGradientStartPoint({ x: 0, y: 0 })
		shape.fillLinearGradientEndPoint({ x: width, y: height })
		shape.fillLinearGradientColorStops(stops)
		return
	}

	shape.fillRadialGradientStartPoint({ x: width / 2, y: height / 2 })
	shape.fillRadialGradientEndPoint({ x: width / 2, y: height / 2 })
	shape.fillRadialGradientStartRadius(0)
	shape.fillRadialGradientEndRadius(Math.max(width, height) / 2)
	shape.fillRadialGradientColorStops(stops)
}
