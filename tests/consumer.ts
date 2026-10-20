import {
	encodeQR,
	renderQR,
	type QRMatrix,
	type RenderOptions,
	type DotStyle,
} from '../dist/index'

const matrix: QRMatrix = encodeQR('https://example.com', { errorCorrectionLevel: 'Q' })
const options: RenderOptions = {
	size: 512,
	foreground: '#111827',
	background: '#ffffff',
	dotStyle: 'rounded',
	dotLayout: 'connected',
	finderStyle: 'rounded',
	finderInnerStyle: 'diamond',
	finderColor: '#0f172a',
	finderInnerColor: '#2563eb',
	pattern: 'linear',
	accent: '#2563eb',
	patternAngle: 32,
	logo: { src: '/brand.svg', scale: 0.16, padding: 8 },
}
const canvas: Promise<HTMLCanvasElement> = renderQR('https://example.com', options)

void matrix
void canvas

const styles: DotStyle[] = ['squircle', 'leaf', 'horizontal', 'vertical']
void styles
