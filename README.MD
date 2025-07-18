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

To use the CoolQR Library, import the `CoolQR` function and call it with the desired data and options:

```typescript
import CoolQR from 'coolqr'

const data = 'https://example.com'

const options = {
	hasImage: false,
	size: 200,
	background: '#FFFFFF',
	eyes: {
		outer: {
			shape: 'rect',
			fill: {
				color: '#000000',
			},
		},
		inner: {
			shape: 'circle',
			fill: {
				color: '#000000',
			},
		},
	},
	dots: {
		shape: 'diamond',
		fill: {
			type: 'gradient',
			gradient: {
				type: 'linear',
				colors: ['#FF0000', '#00FF00', '#0000FF'],
			},
		},
	},
}

const qr = CoolQR(data, options)
image.src = qr.b64Svg
```

This will generate a QR code with the specified data and options and append it to the document body.

## API

### `CoolQR(data: string, options: QROptions): HTMLCanvasElement`

Generates a QR code with the specified data and options.

- `data`: The data to encode in the QR code.
- `options`: The options for generating the QR code.

### `QROptions`

The options for generating a QR code.

- `hasImage`: Whether to overlay an image on the QR code. Default: `false`.
- `size`: The size of the QR code in pixels.
- `background`:
  - `fill`: The fill options for the background. See `Fill` interface for details. Default: `{ color: 'transparent' }`.
- `eyes`: The shape and fill options for the eyes of the QR code.
  - `outer`: The shape and fill options for the outer eye.
    - `shape`: The shape of the outer eye. Can be `'rect'`, `'ring'`, `'combined'`, `'rounded'` (rounded rectangle). Default: `'rect'`.
    - `fill`: The fill options for the outer eye. See `Fill` interface for details. Default: `{ color: '#000000' }`.
  - `inner`: The shape and fill options for the inner eye.
    - `shape`: The shape of the inner eye. Can be `'rect'`, `'circle'`, `'rhombus'`, `'drop'`, `'kite'`, `'cross'`, `'diamond'` or `'rounded'` (rounded rectangle). Default: `'rect'`.
    - `fill`: The fill options for the inner eye. See `Fill` interface for details. Default: `{ color: '#FFFFFF' }`.
- `dots`: The shape and fill options for the dots of the QR code.
  - `shape`: The shape of the dots. Can be `'rect'`, `'circle'`, `'rhombus'`, `'drop'`, `'kite'`, `'cross'`, `'diamond'` or `'rounded'` (rounded rectangle). Default: `'rect'`.
  - `fill`: The fill options for the dots. See `Fill` interface for details. Default: `{ color: '#000000' }`.
- `image`: The image to overlay on the QR code. Default: `null`.
  - `src`: The source of the image. Url must provide a `png` image. Default: `null`.
  - `size`: The size of the image in pixels. Default: `50`. (Values between `40` and `100` are recommended.)

### `Fill`

The fill options for a shape.

- `color`: The color of the fill. Default: `'#000000'`.
- `type`: The type of the fill. Can be `'solid'` or `'gradient'`. Default: `'solid'`.
- `gradient`: The gradient options for the fill. See `GradientFill` interface for details. Default: `{ type: 'linear', colors: ['#000000', '#FFFFFF'] }`.

### `Gradient Fill`

The gradient options for a fill.

- `type`: The type of the gradient. Can be `'linear'` or `'radial'`. Default: `'linear'`.
- `colors`: The colors of the gradient. Default: `['#000000', '#FFFFFF']`.

## Live Demo

You can try out the CoolQR Library with this live demo: [https://qr.mirket.dev/](https://qr.mirket.dev)

## Author

- Instagram [@codemirket](https://instagram.com/codemirket)
