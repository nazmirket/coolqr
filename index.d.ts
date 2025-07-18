export interface DrawOpts {
	x: number
	y: number
	w: number
	fill: Fill
	flip?: 'h' | 'v' | undefined
}

type Shape =
	| 'square'
	| 'circle'
	| 'diamond'
	| 'rounded'
	| 'rounded2'
	| 'rounded3'
	| 'rounded4'
	| 'sun'
	| 'cross'
	| 'hexagon'
	| 'octagon'

type Frame =
	| 'square'
	| 'circle'
	| 'rounded'
	| 'rounded2'
	| 'rounded3'
	| 'rounded4'
	| 'rounded5'
	| 'rounded6'
	| 'squarecircle'

export interface Fill {
	type: 'solid' | 'gradient'
	color: string
	gradient: {
		type: 'linear' | 'radial'
		colors: string[]
	}
}

export interface QROptions {
	size: number
	background: {
		fill: Fill
	}
	eyes: {
		outer: {
			shape: Frame
			fill: Fill
		}
		inner: {
			shape: Shape
			fill: Fill
		}
	}
	dots: {
		shape: Shape
		fill: Fill
	}
	image?: {
		src: string
		margin: number
		hideDots?: boolean
	}
}
