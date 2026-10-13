export type Shape =
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

export type Frame =
	| 'square'
	| 'circle'
	| 'rounded'
	| 'rounded2'
	| 'rounded3'
	| 'rounded4'
	| 'rounded5'
	| 'rounded6'
	| 'squarecircle'

export interface Gradient {
	type: 'linear' | 'radial'
	colors: [string, string, ...string[]]
}

export type Fill =
	| {
			type: 'solid'
			color: string
			gradient?: never
	  }
	| {
			type: 'gradient'
			color: string
			gradient: Gradient
	  }

export interface DrawOpts {
	x: number
	y: number
	w: number
	fill: Fill
	flip?: 'h' | 'v'
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
