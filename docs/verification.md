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
