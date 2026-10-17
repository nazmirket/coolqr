# Changelog

## 3.2.0

- Add connected and individual module compositions. Connected contours join neighboring dark modules while keeping light cells open.
- Apply the selected shape and ink treatment to timing, alignment, format, and version modules outside the three finder patterns.
- Make the builder's shape tiles show real rendered module samples and add a visual composition selector.
- Group checker ink into larger blocks so connected shapes read as coherent forms.
- Require at least two output pixels per module to preserve styled detail in dense codes.

## 3.1.0

- Add visual style selection for data dots and both parts of finder patterns in the browser builder.
- Add geometric data shapes, independent finder colors, and solid, linear, radial, and alternating color patterns to the renderer.
- Let the builder choose output resolution and tune branded codes while preserving contrast, quiet-zone, and logo safety checks.

## 3.0.0

- Replace the Konva and third-party QR generator stack with a dependency-free QR Code Model 2 encoder and browser Canvas 2D renderer.
- Add `encodeQR` for Node.js and browser matrix generation and `renderQR` for PNG-ready canvas output.
- Add safe brand logo placement, high error correction, a fixed quiet zone, structural pattern protection, and color contrast checks.
- Replace the previous drawing API with a small named-export API. This is a breaking release; migrate from `CoolQR.draw` to `renderQR`.
- Redesign the demo as a focused QR utility with instant examples, logo upload, preview, and download.
- Update the guide, package tooling, and release verification.

## 2.1.0

- Make `QROptions.size` control the exact output dimensions.
- Publish self-contained TypeScript declarations and exported API types.
- Support solid, linear-gradient, and radial-gradient fills consistently.
- Reject failed image loads internally and render the QR without a broken logo.
- Keep QR geometry proportional at every output size.
- Add package linting, runtime tests, consumer type tests, and safe release scripts.
- Replace the demo's PM2 deployment with a health-checked Docker Compose service.
