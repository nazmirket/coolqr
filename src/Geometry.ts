import Konva from 'konva'

export function degToRad(a: number) {
	return (a / 180) * Math.PI
}

export function getCenter(shape: Konva.Shape) {
	const angleRad = degToRad(shape.rotation() || 0)
	return {
		x:
			shape.x() +
			(shape.width() / 2) * Math.cos(angleRad) +
			(shape.height() / 2) * Math.sin(-angleRad),
		y:
			shape.y() +
			(shape.height() / 2) * Math.cos(angleRad) +
			(shape.width() / 2) * Math.sin(angleRad),
	}
}

export function rotateAroundPoint(shape: Konva.Shape, deltaDeg: number, point: any) {
	const angleRad = degToRad(deltaDeg)
	const x = Math.round(
		point.x +
			(shape.x() - point.x) * Math.cos(angleRad) -
			(shape.y() - point.y) * Math.sin(angleRad),
	)
	const y = Math.round(
		point.y +
			(shape.x() - point.x) * Math.sin(angleRad) +
			(shape.y() - point.y) * Math.cos(angleRad),
	)

	const rotation = Math.round(shape.rotation() + deltaDeg)

	shape.x(x)
	shape.y(y)
	shape.rotation(rotation)
}

export function rotateAroundCenter(shape: any, deltaDeg: number) {
	const center = getCenter(shape)
	rotateAroundPoint(shape, deltaDeg, center)
}

export function flip(shape: Konva.Shape, flip: 'h' | 'v' | undefined) {
	if (flip === 'h') {
		shape.scaleX(-1)
		shape.x(shape.x() + shape.width())
	} else if (flip === 'v') {
		shape.scaleY(-1)
		shape.y(shape.y() + shape.height())
	}
}
