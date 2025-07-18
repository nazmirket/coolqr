# CoolQR Library

The CoolQR Library is a TypeScript module that provides an easy way to generate QR codes with customizable shapes and fills. It includes several interfaces and types for customizing the QR code's size, background color, and shape and fill options for the eyes and dots.

![Demo](https://i.imgur.com/QQiLsIy.png)

[Live Demo](https://qr.mirket.dev/)

## Installation

To install the CoolQR Library, run the following command:

```
npm install coolqr
```

## Usage

To use the CoolQR Library, import the `CoolQR` function and call it with the desired data, container element, and options:

```typescript
import CoolQR from 'coolqr'

const data = 'https://example.com'
const container = document.getElementById('qr-container') as HTMLDivElement

const options = {
	size: 200,
	background: {
		fill: {
			type: 'solid',
			color: '#FFFFFF',
		},
	},
	eyes: {
		outer: {
			shape: 'rounded',
			fill: {
				type: 'solid',
				color: '#000000',
			},
		},
		inner: {
			shape: 'circle',
			fill: {
				type: 'solid',
				color: '#000000',
			},
		},
	},
	dots: {
		shape: 'diamond',
		fill: {
			type: 'gradient',
			color: '#000000',
			gradient: {
				type: 'linear',
				colors: ['#FF0000', '#00FF00'],
			},
		},
	},
	image: {
		src: 'https://example.com/logo.png',
		margin: 10,
		hideDots: true,
	},
}

const stage = await CoolQR.draw(data, container, options)
```

This will generate a QR code with the specified data and options and render it in the provided container element.

## API

### `CoolQR.draw(data: string, container: HTMLDivElement, options: QROptions): Promise<Konva.Stage>`

Generates a QR code with the specified data and options and renders it in the provided container.

- `data`: The data to encode in the QR code.
- `container`: The HTML div element where the QR code will be rendered.
- `options`: The options for generating the QR code.

Returns a Promise that resolves to a Konva.Stage object.

### `QROptions`

The options for generating a QR code.

- `size`: The size of the QR code in pixels.
- `background`: The background options for the QR code.
  - `fill`: The fill options for the background. See `Fill` interface for details.
- `eyes`: The shape and fill options for the eyes of the QR code.
  - `outer`: The shape and fill options for the outer eye frame.
    - `shape`: The shape of the outer eye frame. Can be `'square'`, `'circle'`, `'rounded'`, `'rounded2'`, `'rounded3'`, `'rounded4'`, `'rounded5'`, `'rounded6'`, or `'squarecircle'`.
    - `fill`: The fill options for the outer eye. See `Fill` interface for details.
  - `inner`: The shape and fill options for the inner eye.
    - `shape`: The shape of the inner eye. Can be `'square'`, `'circle'`, `'diamond'`, `'rounded'`, `'rounded2'`, `'rounded3'`, `'rounded4'`, `'sun'`, `'cross'`, `'hexagon'`, or `'octagon'`.
    - `fill`: The fill options for the inner eye. See `Fill` interface for details.
- `dots`: The shape and fill options for the dots of the QR code.
  - `shape`: The shape of the dots. Can be `'square'`, `'circle'`, `'diamond'`, `'rounded'`, `'rounded2'`, `'rounded3'`, `'rounded4'`, `'sun'`, `'cross'`, `'hexagon'`, or `'octagon'`.
  - `fill`: The fill options for the dots. See `Fill` interface for details.
- `image` (optional): The image to overlay on the QR code.
  - `src`: The source URL of the image.
  - `margin`: The margin around the image in pixels.
  - `hideDots` (optional): Whether to hide dots behind the image. Default: `false`.

### `Fill`

The fill options for a shape.

- `type`: The type of the fill. Can be `'solid'` or `'gradient'`.
- `color`: The color of the fill (used for solid fills and as fallback for gradients).
- `gradient`: The gradient options for the fill (used when type is `'gradient'`).
  - `type`: The type of the gradient. Can be `'linear'` or `'radial'`.
  - `colors`: An array of colors for the gradient stops.

## Live Demo

You can try out the CoolQR Library with this live demo: [https://qr.mirket.dev/](https://qr.mirket.dev)

## Author

- Instagram [@codemirket](https://instagram.com/codemirket)
