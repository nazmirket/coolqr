# CoolQR

Create QR codes in your browser, or encode their module matrix in Node.js. CoolQR 3 has no runtime dependencies. Its QR Code Model 2 encoder and Canvas 2D renderer are written in this package.

**[Open the QR builder](https://qr.mirket.dev/)** · [View the source](https://github.com/nazmirket/coolqr)

## Use the builder

1. Enter a URL, message, or other text. Try an example to explore a complete design.
2. Choose whether dark modules connect into flowing contours or remain individual marks. Pick their silhouette, finder shapes, and ink pattern from the visual tiles, then tune the colors and gradient direction.
3. Optionally upload a PNG, JPEG, WebP, or SVG logo. The logo is placed over data modules with high error correction; the builder does not upload the image.
4. Choose the output size and error correction level, then download a PNG. Scan the exported image at the size and on the material where it will appear.

The builder runs QR generation in your browser. Its preview and logo stay on your device. The page makes ordinary requests to load the site itself; this is not a promise of offline operation. A QR code shares whatever text you put in it with anyone who scans it, so review its contents before publishing.

### Good results

- Use a short, stable URL for public links. Long content requires a denser code.
- Keep all four sides of the light margin visible. CoolQR reserves the QR standard's four-module quiet zone.
- Use a high-contrast, dark foreground and light background. Every color used for dark modules must meet the renderer's 4.5:1 contrast rule against the background.
- Prefer a simple, small logo. Decorative dots, patterned color, and logos can make a code harder to scan on low-quality screens or print.
- Test the downloaded file with more than one camera or scanner before printing in volume.

## Install the library

Install the published package from npm:

```sh
npm install coolqr
```

This guide covers CoolQR 3.2.0 and newer. To try unreleased changes from the repository, install `github:nazmirket/coolqr#master` instead.

CoolQR 3 is a breaking change from the previous `CoolQR.draw`/Konva API. Use the named `encodeQR` and `renderQR` functions below. The package entry point is CommonJS with TypeScript declarations; bundlers can consume it in browser applications. `encodeQR` works in Node.js. `renderQR` needs a browser with Canvas 2D.

### Render and download a PNG

```ts
import { renderQR } from 'coolqr'

const canvas = await renderQR('https://example.com/portfolio', {
  size: 1024,
  foreground: '#18212b',
  accent: '#0f766e',
  background: '#ffffff',
  pattern: 'linear',
  patternAngle: 35,
  dotStyle: 'hexagon',
  dotLayout: 'connected',
  finderStyle: 'rounded',
  finderInnerStyle: 'circle',
  finderColor: '#18212b',
})

document.querySelector('#result')?.replaceChildren(canvas)

const link = document.createElement('a')
link.href = canvas.toDataURL('image/png')
link.download = 'portfolio-qr.png'
link.click()
```

`renderQR` returns a new `HTMLCanvasElement`. Your application owns it and can append, replace, remove, or export it. The canvas size is the exact output width and height, including the quiet zone.

### Add a brand logo

```ts
import { renderQR } from 'coolqr'

const canvas = await renderQR('https://example.com', {
  size: 512,
  logo: {
    src: '/brand-mark.png',
    scale: 0.16,
    padding: 8,
    background: '#ffffff',
  },
})

document.querySelector('#result')?.replaceChildren(canvas)
```

Supplying `logo` automatically selects error correction level **H**. An explicit lower level is rejected. The image must be a data URL, blob URL, same-origin URL, or a remote URL that permits CORS. CoolQR rejects an image that fails to load and rejects a badge that cannot fit without covering QR function patterns. Catch the error and ask the user to choose a smaller image or remove the logo; it will not silently produce an unbranded code. For an uploaded file, create a blob URL with `URL.createObjectURL(file)` and revoke it after the canvas is ready and no longer needed.

### Encode without a browser

```ts
import { encodeQR } from 'coolqr'

const qr = encodeQR('HELLO WORLD', { errorCorrectionLevel: 'Q' })

console.log(qr.version, qr.size, qr.mask)
console.log(qr.modules[0]) // 0 (light) or 1 (dark)
```

The returned `modules` and `functionModules` are row-major `Uint8Array`s of length `size * size`. Index a cell with `row * size + column`. `functionModules` marks structural cells whose dark/light value and position must remain intact; CoolQR can style their dark silhouette. The matrix has **no quiet zone**; add four light modules on every side if you make your own renderer. `encodeQR` does not access browser globals.

## API reference

### `encodeQR(data, options?)`

Encodes a nonempty JavaScript string as QR Code Model 2. It chooses numeric, alphanumeric, or UTF-8 byte mode for the complete payload; non-ASCII byte payloads carry a UTF-8 ECI designator. It chooses the smallest version in the allowed range, generates Reed–Solomon error correction, and selects a mask. Invalid input and payloads too large for the range throw `RangeError`.

| Option | Default | Meaning |
| --- | --- | --- |
| `errorCorrectionLevel` | `'M'` | `'L'`, `'M'`, `'Q'`, or `'H'` |
| `minVersion` | `1` | Smallest permitted version, 1–40 |
| `maxVersion` | `40` | Largest permitted version, 1–40 |

The result contains `size`, `version`, `errorCorrectionLevel`, `mask`, `modules`, and `functionModules`. Version 1 is 21 × 21 modules; each next version adds four modules per side. The encoder uses one mode for the complete input rather than splitting mixed text into optimized segments, so some mixed payloads can need a larger version than a segmented encoder.

### `renderQR(data, options?)`

Returns `Promise<HTMLCanvasElement>`. The renderer calls `encodeQR`, includes a four-module light quiet zone, and styles every dark module outside the three separately drawn finder patterns. It requires Canvas 2D and a browser `Image` implementation when a logo is used. Failures reject the promise.

| Option | Default | Meaning |
| --- | --- | --- |
| `size` | `512` | Exact square canvas size, integer 64–4096 pixels; must fit at least two pixels per module including quiet zone |
| `errorCorrectionLevel` | `'M'`, or `'H'` with logo | Error correction level; a logo requires `'H'` |
| `foreground` | `'#111827'` | Opaque dark base color for modules and default finder color |
| `accent` | — | Second opaque dark color for a non-solid pattern |
| `background` | `'#ffffff'` | Opaque light CSS color |
| `pattern` | `'solid'` | Module color treatment: `'solid'`, `'linear'`, `'radial'`, or `'checker'` |
| `patternAngle` | `45` | Linear gradient angle in degrees from 0 to 360 |
| `dotStyle` | `'square'` | Module silhouette: `'square'`, `'rounded'`, `'circle'`, `'diamond'`, `'hexagon'`, or `'octagon'` |
| `dotLayout` | `'connected'` | `'connected'` joins dark neighbors into contours; `'isolated'` draws individual marks (square marks have a small gap) |
| `finderStyle` | `'square'` | Outer finder frames: `'square'`, `'rounded'`, or `'circle'` |
| `finderInnerStyle` | `'square'` | Finder centers: `'square'`, `'rounded'`, `'circle'`, or `'diamond'` |
| `finderColor` | `foreground` | Opaque dark outer finder color |
| `finderInnerColor` | `finderColor` | Opaque dark finder center color |
| `logo.src` | — | Data/blob URL or CORS-enabled image URL |
| `logo.scale` | `0.16` | Image width relative to symbol width; `0.06`–`0.20` |
| `logo.padding` | Scaled with output size | Clear padding around image in output pixels; at most 5% of canvas size |
| `logo.background` | `'#ffffff'` | Opaque light badge color behind the image; must contrast with each dark color |

The renderer rejects colors that are transparent, reversed, or below 4.5:1 contrast. Gradient endpoints and checker colors are checked individually. Connected shapes join only cardinally adjacent dark modules and never enter light cells; the four-module quiet zone remains light. Timing, alignment, format, and version modules use the selected silhouette and ink while retaining their encoded dark/light values. Finder frames remain a separate locator layer. Logo requests also fail if the chosen code cannot safely fit the badge. These guardrails improve reliability, but they cannot guarantee that every decorative code will scan on every camera, surface, or print size.

### Error handling

```ts
try {
  const canvas = await renderQR(userText, { logo: { src: logoUrl } })
  document.querySelector('#result')?.replaceChildren(canvas)
} catch (error) {
  const message = error instanceof Error ? error.message : 'Could not create the QR code'
  document.querySelector('#error')!.textContent = message
}
```

## Develop and verify

The library lives in `src/` and compiles to `dist/`. The public site is a separate Nuxt project in `demo/`, with a local file dependency on the package. Use pnpm 9.15.9, the version recorded in both manifests:

```sh
corepack pnpm@9.15.9 install --frozen-lockfile --ignore-scripts
corepack pnpm@9.15.9 run verify

corepack pnpm@9.15.9 --dir demo install --frozen-lockfile --ignore-scripts
corepack pnpm@9.15.9 --dir demo run verify
corepack pnpm@9.15.9 --dir demo run dev
```

The package gate lints, builds, runs encoder and entry-point tests, and checks a TypeScript consumer. The demo gate lints, type-checks, and builds. To inspect what users would install, run `npm pack --dry-run` after the package build. No runtime third-party packages are required by `coolqr`.

### Run the demo container locally

The Compose service binds to loopback. Choose a free port when running a disposable copy:

```sh
COOLQR_PORT=9492 docker compose -p coolqr-validation up -d --build
curl --fail http://127.0.0.1:9492/
docker compose -p coolqr-validation down
```

The production host can use a different Compose provider. Set `COOLQR_PORT` and `COOLQR_IMAGE_TAG` as needed; see `compose.yml`.

## License

ISC

## Agent development

Both Codex Desktop and Claude Desktop Code use the Mirket harness. Follow
[AGENTS.md](AGENTS.md) for setup, selected expertise, worker routing and
application verification. Run `pnpm agents:check` before delivery; the dedicated
Mirket CI workflow checks the committed integration and real failure probes.
