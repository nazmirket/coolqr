import CoolQR, {
	draw,
	type Fill,
	type Frame,
	type QROptions,
	type Shape,
} from '../dist/CoolQR'
import Konva from 'konva'

const solid: Fill = {
	type: 'solid',
	color: '#000000',
}

const gradient: Fill = {
	type: 'gradient',
	color: '#000000',
	gradient: {
		type: 'radial',
		colors: ['#000000', '#ffffff'],
	},
}

const frame: Frame = 'rounded4'
const shape: Shape = 'circle'
const options: QROptions = {
	size: 512,
	background: { fill: { type: 'solid', color: '#ffffff' } },
	eyes: {
		outer: { shape: frame, fill: gradient },
		inner: { shape, fill: solid },
	},
	dots: { shape, fill: solid },
}

declare const container: HTMLDivElement
const defaultResult: Promise<Konva.Stage> = CoolQR.draw(
	'https://example.com',
	container,
	options,
)
const namedResult: Promise<Konva.Stage> = draw('https://example.com', container, options)

void defaultResult
void namedResult
