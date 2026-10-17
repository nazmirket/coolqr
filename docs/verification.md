# CoolQR 3 acceptance evidence — 2026-10-17

Repository: coolqr
Target branch: master

- `corepack pnpm@9.15.9 run verify`: pass; package lint, build, six Node tests and TypeScript consumer check.
- `corepack pnpm@9.15.9 --dir demo run verify`: pass; demo lint, typecheck and production build.
- `npm pack --dry-run --json --ignore-scripts`: package includes README, changelog, dist JS and declarations, package manifest; no source/demo/node_modules.
- `pnpm audit --prod` in both root and demo: zero reported advisories on 2026-10-17.
- Independent QR matrix comparison: 160 normal fixtures across versions/ECC matched prior generator matrix and mask; all version/ECC combinations exercised.
- Independent rendered PNG verification with Chrome Canvas and zbarimg 0.23.93: exact decoded payload for URL, numeric, UTF-8; L/M/Q/H; 64, 127, 511 and 1023-pixel outputs; square, rounded, circle data styles; square and rounded finder styles; logo scale 0.12, 0.16 and 0.20. Quiet-zone pixels and exact dimensions checked.
- Browser preview: default QR and Wi-Fi example render, status Ready; desktop and 390px mobile view inspected.
- Podman Compose validation on 127.0.0.1:9493: container healthy; /, /favicon.ico, /og-image.png return 200; removed /icon.png returns 404.
- OG image itself decoded with zbarimg to https://qr.mirket.dev/.

Known safe failure: A 1,000-character alphanumeric payload at ECC H cannot fit a default 8px logo badge without covering function patterns. `renderQR` throws an actionable error. Reducing logo padding to 3px succeeds. Invalid contrast, size, logo scale, padding, explicit low ECC with logo, broken logo URL, empty data and payload overflow also reject as designed.

## 3.2 visual composition acceptance — 2026-10-17

- `corepack pnpm@9.15.9 run verify`: pass; 11 Node tests, lint, package build and TypeScript consumer check. The focused tests count every dark non-finder module, distinguish connected diamond/hexagon/octagon silhouettes, and reject undersized dense output.
- `corepack pnpm@9.15.9 --dir demo run verify`: pass after refreshing the demo's local `coolqr` package copy; lint, typecheck and production build. `npm pack --dry-run --json` contains only package files and no bundled dependencies.
- Production browser renderer: Chrome `BarcodeDetector` decoded the exact payload in 24 cases (six shapes × connected/isolated × short/dense inputs), plus solid, linear, radial and checker ink on connected hexagons. A 64px dense export rejects with the expected two-pixels-per-module error.
- Independent zbarimg 0.23.93 decoded a connected rounded, colored portfolio example and a dense connected diamond PNG to their exact inputs.
- Browser UI: the Portfolio example reset the full design to Moss palette, connected rounded marks, diamond finder centers and linear ink, and its canvas decoded. Desktop and 390px mobile views were inspected; mobile document scroll width equaled the viewport width.
- Podman Compose canary: built the current source, served HTTP 200 on loopback port 9492, then was removed.
