# Changelog

## 3.3.1 — 2026-10-20

- Honor the selected dot silhouette and ink on timing and metadata modules instead
  of silently substituting squares. Style alignment targets with the selected
  finder ring, center, and colors while keeping their rings continuous.
- Balance mixed finder frame/center proportions and strengthen horizontal capsule
  strokes for dense styled codes without substituting the selected shapes.
- Strengthen horizontal strokes only below six pixels per module to fix dense
  codes without regressing larger outputs.
- Add screenshot regression coverage and a full cross-style browser decoder sweep.

## 3.3.0 — 2026-10-20

- Remove only whole data modules beneath visible logo pixels and padding by default;
  retain transparent areas, image aspect ratio, and the QR background. Set
  `logo.background` explicitly to retain an opaque rectangular badge.
- Shape exposed cluster edges instead of overlaying rectangular bridges, and add
  squircle, leaf, horizontal, and vertical dot styles in both library and demo.
- Keep timing, alignment, format, and version modules square and solid for scanner
  recognition; finder styling remains independently configurable.
- Correct asymmetric dark/light balance scoring when choosing a QR mask.
- Snapshot rendering options before asynchronous image loading, validate logo
  geometry before loading, and allow rendering without `Image` when no logo is used.

- Align agent instructions and checksum-pinned CI with Mirket 1.0.5, including
  frozen visual targets, quality gates and the no-image-model fallback.
- Use the public `EncodeOptions` and `QRMatrix` interfaces directly throughout
  the encoder; remove duplicate internal type names and empty dependency config.

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
