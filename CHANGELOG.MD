# Changelog

## 2.1.0

- Make `QROptions.size` control the exact output dimensions.
- Publish self-contained TypeScript declarations and exported API types.
- Support solid, linear-gradient, and radial-gradient fills consistently.
- Reject failed image loads internally and render the QR without a broken logo.
- Keep QR geometry proportional at every output size.
- Add package linting, runtime tests, consumer type tests, and safe release scripts.
- Replace the demo's PM2 deployment with a health-checked Docker Compose service.
