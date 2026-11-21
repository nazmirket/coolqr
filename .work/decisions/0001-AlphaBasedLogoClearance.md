# 0001 — Alpha-based logo clearance

- Date recorded: 2026-10-20
- Status: Accepted in CoolQR 3.3.0
- Release revision: `06b29471d55f72081a2f25a0c781c8436fdf3bdb`

The default white logo badge obscured data and clashed with nonwhite
backgrounds. Use the logo's alpha footprint for clearance. Rasterize the image
once in `src/logo.ts`, apply padding around occupied pixels, then remove whole
intersecting data modules. Place the logo in the nearest safe rectangle and
protect the function modules.

A rectangular badge remains available through an explicit `logo.background`.
Alpha-based clearance keeps transparent holes and unrelated dots visible and
preserves the logo's aspect ratio. Opaque pixels in the input image remain
occupied. Dense symbols can require a smaller logo or less padding.

See the [Canvas, decoder, and pixel-integrity evidence](../../docs/Verification.md#library-review-and-logocontour-changes--2026-10-20).
