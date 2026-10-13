# CoolQR

CoolQR is a browser-side TypeScript library for rendering customizable QR codes with
Konva. It supports styled finder eyes, multiple dot shapes, solid or gradient fills,
and optional center images. Use it in browser applications or browser-targeted
bundles; Node canvas rendering is outside the supported runtime.

![Demo](https://i.imgur.com/QQiLsIy.png)

[Live demo](https://qr.mirket.dev/)

## Installation

```bash
npm install coolqr
```

## Usage

```typescript
import CoolQR, { type QROptions } from 'coolqr'

const options = {
	size: 512,
	background: {
		fill: {
			type: 'solid',
			color: '#ffffff',
		},
	},
	eyes: {
		outer: {
			shape: 'rounded',
			fill: {
				type: 'solid',
				color: '#111827',
			},
		},
		inner: {
			shape: 'circle',
			fill: {
				type: 'solid',
				color: '#111827',
			},
		},
	},
	dots: {
		shape: 'diamond',
		fill: {
			type: 'gradient',
			color: '#111827',
			gradient: {
				type: 'linear',
				colors: ['#ef4444', '#2563eb'],
			},
		},
	},
	image: {
		src: '/logo.png',
		margin: 12,
		hideDots: true,
	},
} satisfies QROptions

const container = document.getElementById('qr-container') as HTMLDivElement
const stage = await CoolQR.draw('https://example.com', container, options)
```

`size` is the exact width and height of the generated canvas in pixels. All modules
and decorative geometry scale proportionally. When an optional image cannot load,
CoolQR renders the QR code without the image and keeps the underlying dots visible.

Destroy a stage when replacing it or unmounting its container:

```typescript
stage.destroy()
```

## API

### `CoolQR.draw(data, container, options)`

Renders the supplied data and resolves with a `Konva.Stage`.

- `data`: String encoded into the QR code.
- `container`: Browser `HTMLDivElement` that owns the stage.
- `options`: A `QROptions` object.

The named `draw` export is also available.

### `QROptions`

- `size`: Positive output width and height in pixels.
- `background.fill`: Canvas fill.
- `eyes.outer.shape`: `square`, `circle`, `rounded`, `rounded2`, `rounded3`,
  `rounded4`, `rounded5`, `rounded6`, or `squarecircle`.
- `eyes.inner.shape` and `dots.shape`: `square`, `circle`, `diamond`, `rounded`,
  `rounded2`, `rounded3`, `rounded4`, `sun`, `cross`, `hexagon`, or `octagon`.
- `image.src`: Optional same-origin or CORS-enabled image URL.
- `image.margin`: Non-negative image inset in pixels.
- `image.hideDots`: Removes covered modules only after the image loads successfully.

### `Fill`

Solid fill:

```typescript
const fill = {
	type: 'solid',
	color: '#111827',
} satisfies Fill
```

Gradient fill:

```typescript
const fill = {
	type: 'gradient',
	color: '#111827',
	gradient: {
		type: 'radial',
		colors: ['#f43f5e', '#8b5cf6', '#2563eb'],
	},
} satisfies Fill
```

Gradient colors are distributed evenly and require at least two entries. `color`
remains the fallback color for consumers that transform options before rendering.

## Development

```bash
pnpm install
pnpm verify

cd demo
pnpm install
pnpm verify
```

`pnpm verify` runs linting, runtime tests, consumer declaration tests, and builds.

## Docker Deployment

The production demo runs as an unprivileged, read-only container. Compose binds the
application only to loopback on port `9491`, allowing the host's Nginx service to
continue handling TLS.

```bash
docker compose build
docker compose up -d
docker compose ps
curl --fail http://127.0.0.1:9491/
```

Use `COOLQR_PORT` to select a different loopback port for validation:

```bash
COOLQR_PORT=9492 docker compose -p coolqr-staging up -d --build
```

## Release

```bash
pnpm verify
npm pack --dry-run
npm run release
```

`prepack` always rebuilds the package, and `prepublishOnly` runs the full verification
suite without recursively invoking `npm publish`.

## License

ISC
