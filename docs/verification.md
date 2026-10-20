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

## Mirket 1.0.11 adoption — 2026-10-20

See [the migration record](mirket-migration.md) for the adoption matrix, exact
release/live identity, application gates, failure/restoration probes, package
invocation and remaining Claude live activation gap. Historical browser
and scanner checks above remain dated evidence, not claims of a new visual run.


## Library review and logo/contour changes — 2026-10-20

Reviewed the public exports, encoder mode selection, UTF-8/ECI, Reed–Solomon
interleaving, structural patterns, mask scoring, canvas geometry, colors, image
loading, logo placement, demo controls and package contents.

### Findings and changes

- The default white logo badge obscured data and clashed with nonwhite backgrounds.
  `src/logo.ts` now rasterizes the image once, measures alpha occupancy, and removes
  whole intersecting data modules before rendering. Padding is applied around
  occupied pixels. Transparent holes and unrelated dots remain; wide/tall images
  retain aspect ratio. Explicit `logo.background` opts into a rectangular badge.
  Function modules remain protected. Placement uses the nearest safe rectangle;
  dense symbols can still require a smaller logo or less padding.
- Rectangular bridges produced knotted circles and polygons. Connected rendering
  now shapes exposed cluster corners with flush shared edges. Four additions bring
  the catalog to ten: squircle, leaf, horizontal and vertical.
- Applying isolated decorative shapes to scanner landmarks caused decoding failures
  in URL, Unicode and numeric cases. Timing, alignment, format and version modules
  now retain square geometry and solid foreground ink. Finder styles remain separate.
- Mask balance scoring used asymmetric rounding: equivalent light/dark departures
  from 50% received different penalties. The corrected symmetric score has an
  inversion regression test. Encoded masks can change for affected payloads.
- Reactive callers could alter/remove a logo while its image was loading. Rendering
  now snapshots options and the nested logo. Added a regression test for this race.
- Missing `Image` unnecessarily prevented unbranded rendering, an empty badge color
  bypassed validation, and invalid logo geometry was checked only after image load.
  These cases now have explicit handling and regression coverage.

### Verification

- Node 24.18.1 / pnpm 9.15.9: root `verify` passed with 16 tests, lint, build and
  public TypeScript consumer checks. Demo `verify` passed after refreshing the
  `file:..` package. Package dry-run includes the new internal modules and types.
- Chrome Canvas + jsQR 1.4.0: 180/180 decorated symbols decoded to their exact
  payload (ten styles × two layouts × URL/numeric/Unicode × no logo/transparent
  round mark/wide rectangular mark). Sixty unbranded cases retain every module
  center and entirely clear light cells. A completely transparent logo leaves the
  entire canvas pixel-identical to the corresponding unbranded H symbol.
- 640/640 matrices match Nayuki's independent encoder at identical version,
  correction level and mask: versions 1–40, all four levels, numeric/alphanumeric/
  byte/UTF-8 with ECI. This checks matrix construction, not identical mask preference.
- An additional jsQR sweep decoded 159/160 version/level fixtures. Version 23-L
  carrying `A` was not recognized by jsQR; its matrix matched the reference and
  zbarimg decoded it correctly. This is retained as a decoder-specific limitation.
- Production demo: selected Leaf, uploaded a transparent SVG, downloaded PNG,
  decoded the download with zbarimg, and checked 1440px desktop and 390px mobile.
  No browser exceptions or horizontal mobile overflow. All ten shape tiles render.
- Disposable Podman Compose build on loopback port 9497 returned HTTP 200 and
  supported the same upload/download browser journey. The test container is removed
  after validation. No publishing or deployment was performed.
- Harness check passed at entry. A later default-PATH run found an unreviewed
  same-version Cargo binary (`444f9f22…`) ahead of the reviewed installed binary
  (`14a03254…`). The repository pin and managed guidance were left intact.
  Run with `PATH="$HOME/.mirket/bin:$PATH" pnpm agents:check` to use the digest-verified
  installed release; all 11 harness checks passed with that PATH. The live Codex MCP connection matched the reviewed binary,
  source and catalog with `installed_binary.matches_process: true`; no Claude
  desktop connection was available to inspect.

### Reproducing the supplemental checks

The optional scripts use externally supplied verification tools; no runtime or
production dependencies were added. Build the root package first.

```sh
COOLQR_PLAYWRIGHT_MODULE=/path/to/playwright \
COOLQR_BROWSER_PATH=/path/to/chrome \
COOLQR_DECODER_PATH=/path/to/jsQR.js \
node scripts/check-rendering.mjs

COOLQR_ENCODER_REFERENCE=/path/to/qrcodegen.ts \
node scripts/check-encoder-reference.mjs
```

Reference encoder: [Nayuki TypeScript source](https://raw.githubusercontent.com/nayuki/QR-Code-generator/master/typescript-javascript/qrcodegen.ts),
retrieved 2026-10-20, SHA-256
`1dc03fb5a10e0e2318ea162755bbdb9977ca6ce52cff959e9c9b6deafdccda9c`.
The comparison script checks this digest before evaluating it. Decoder:
[jsQR 1.4.0](https://cdn.jsdelivr.net/npm/jsqr@1.4.0/dist/jsQR.js), SHA-256
`bc40c8a15196236b2314db0856f72ca0b49980cd5413b8c852a7349f5fee0859`.
These libraries were used only for verification and are not vendored.

### Visual evidence and limits

[Before](images/rendering-review/before.png),
[frozen contour specimen](images/rendering-review/contour-target.png), and
[final catalog](images/rendering-review/catalog.png) were rendered from actual
library canvases in Chrome at 1200px viewport width and 2× device scale. They use
an original simple SVG circle, a pale green background, and the same URL payload.
The native canvas specimen was inspected before expanding the catalog; its SHA-256
is `70fa90ac7ce0c01564c39b8531974d0f5617171f452cdb7111ac2f2679806012`.
The final output intentionally also changes logo clearance and scanner landmarks.
No requested motion applies. Visual direction has not been approved by the user.

Physical print/camera testing, Safari and Firefox were not exercised. Opaque pixels
already present in a supplied logo are retained; this does not perform background
removal on JPEGs. All logo placement remains conservative about function patterns.
The encoder still chooses one mode per payload rather than optimizing mixed-mode
segments; this is a size-efficiency opportunity, not a demonstrated encoding error.

## 3.3.0 release and production deployment — 2026-10-20

- Release source and `v3.3.0` tag: `06b29471d55f72081a2f25a0c781c8436fdf3bdb`.
  The initial release commit is `8e4e915`; the follow-up fixes the optional reference
  script's import of generated files during clean-checkout lint. Verification was
  repeated with `dist/` absent, without weakening the lint rule.
- [Application CI](https://github.com/nazmirket/coolqr/actions/runs/39397088238) and
  [harness CI](https://github.com/nazmirket/coolqr/actions/runs/39397088211) passed
  on the release revision. Local root, demo and pinned-Mirket gates passed.
- [coolqr 3.3.0](https://www.npmjs.com/package/coolqr/v/3.3.0) was published and
  confirmed as npm's `latest`. Registry tarball SHA-1
  `5100baa6ed06276888e6217686bee6997a376247` matches the tested tarball; its extracted
  public entrypoint reproduces the tested encoder output. No new runtime dependencies.
- Production source was transferred as a Git archive (SHA-256
  `1673595937f1ef6a783a23a7710118c92be013b3afda3bbbef8b78b78620d2a3`)
  and built in `/opt/coolqr/releases/06b2947`. Image
  `coolqr-demo:06b2947` has immutable identity
  `sha256:677af2ab3fe42c466eff3b84dbab065b2a1e9a164b9097521acdc21bd570151b`.
- This image passed an isolated server canary on loopback port 9498: Leaf/Moss
  selection, transparent SVG upload, PNG download, exact zbar decoding, desktop
  and 390px mobile without overflow or browser exceptions. The prior image was
  restored on the canary to rehearse rollback; the new-catalog guard rejected
  the old image as intended while the prior page remained healthy. The candidate
  was then restored, preserving its image identity.
- Promoted that same image to the existing `coolqr` Compose project and port 9491
  at **2026-10-20T08:59:42Z**. Nginx configuration stayed intact. The `current`
  symlink and `.deploy-commit` now identify the release revision.
- [Public site](https://qr.mirket.dev/) returned HTTP 200; the real HTTPS browser
  journey passed again, and its downloaded PNG decoded to `https://example.com`.
  Production Docker health is `healthy` and the running image matches the canary.
  The canary container/network were removed after verification.
- Rollback image `coolqr-demo:99c55ba8694f` and release directory remain available.
  On the server, use that directory and run
  `COOLQR_PORT=9491 COOLQR_IMAGE_TAG=99c55ba8694f docker compose -p coolqr up -d --no-build`,
  verify the page and QR download, then restore `current` and `.deploy-commit` to
  `99c55ba8694fedd72162907024c68b3679566618`. No persistent application data migration
  is involved. Observations cover this rollout, not an ongoing monitoring period.

## Style-consistency correction — unreleased, 2026-10-20

The user's screenshot exposed a regression in 3.3.0: forcing function modules to
solid squares visibly contradicted the selected diamond style. Timing and metadata
modules now follow the selected dot style and ink. Alignment targets retain their
continuous ring structure but use the same frame, center, and colors as finder eyes.
Mixed frame/center proportions are balanced, and horizontal capsules have slightly
stronger strokes. The encoded matrix and logo exclusion rules are unchanged.

[Corrected native canvases](images/rendering-review/style-consistency.png) reproduce
`https://example.com/portfolio` with the Indigo colors, circular frames and centers,
and individual/connected diamond dots. Inspected in Chrome at 1200px viewport and
2× device scale. Both actual demo PNG downloads decoded to the exact payload using
zbar; desktop and 390px mobile checks found no overflow or browser exceptions.

Root verification passes 18 tests and public type checks. The independent encoder
comparison still matches 640 matrices. Demo verification and pinned Mirket checks
pass. Regression tests cover styled metadata, the screenshot's alignment target,
and multiple alignment targets in higher versions.

The expanded browser sweep is **not green**: 1,619 of 1,620 images decoded with jsQR
or zbar (393 needed zbar), and 60 pixel-integrity cases passed. The remaining failure
uses a dense URL at 320px, connected horizontal dots, circular frames and square
centers. [Exact result and reproduction options](images/rendering-review/style-decoder-results.json)
are retained. A smaller square-center experiment added two failures and was reverted.
This is a demonstrated scan limitation, not proof of universal scanner compatibility.
Physical cameras, printing, Safari and Firefox remain untested.

Reproduce the strict sweep after building the root package:

```sh
COOLQR_PLAYWRIGHT_MODULE=/path/to/playwright \
COOLQR_BROWSER_PATH=/path/to/chrome \
COOLQR_DECODER_PATH=/path/to/jsQR.js \
COOLQR_ZBAR_PATH=/path/to/zbarimg \
node scripts/check-rendering.mjs --full
```

The command deliberately exits nonzero while any case fails; its threshold was not
relaxed. The visual repair budget is exhausted. Publication and production deployment
are held pending resolution of this failure. npm and the website remain on 3.3.0;
no 3.3.1 release or tag was created.
