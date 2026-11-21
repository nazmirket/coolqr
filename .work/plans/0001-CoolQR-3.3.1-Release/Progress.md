# Progress

Completed on 2026-10-20. At the initial hold, npm and the website remained on
3.3.0 and the 3.3.1 tag had yet to be created. See [starting evidence](Evidences.md)
for the failing sweep. The user then authorized a further repair and release.

The remaining failure was a small-pixel horizontal stroke problem: the dense
53-module symbol decoded at 319px and 321px but failed at 320px. An equal-integer
module grid fixed that case but introduced ten logo-case failures, so it was
rejected. Making all horizontal strokes heavier passed the catalog but regressed
an additional 512px size probe. The accepted correction strengthens horizontal
strokes only when their module is smaller than six pixels. Larger strokes retain
the tested proportions. Canvas dimensions, encoded matrices, selected silhouettes,
quiet zones, and logo exclusion rules are preserved.

- The strict expanded sweep now passes **1,626/1,626** images: all ten dot styles,
  both layouts, all three finder frames and four centers, representative URL,
  Unicode and dense payloads, 320/512px outputs, four ink patterns, and logo/no-logo
  cases, plus six focused size probes (319, 320, 321, 328, 384, 512px).
  Patterns and logo presence are distributed across the cross-style cases.
  Coverage is limited to the sampled payloads and option combinations.
- 392 images needed the independent zbar fallback after jsQR. A case passes
  when a decoder returns the exact payload. Every case was checked.
  60 pixel-integrity checks and the transparent-logo equality check also pass.
  [Machine-readable result](../../../docs/images/rendering-review/style-release-results.json).
- [Previously failing 320px output](../../../docs/images/rendering-review/dense-horizontal.png)
  was inspected and now decodes with both jsQR and zbar. Its six size probes are
  included in the permanent `--full` regression command.
- Root verification (18 tests and type checks), demo lint/typecheck/build,
  and 640 independent encoder matrix comparisons pass.
- Physical camera/print testing and Safari/Firefox remain outside this evidence.
  These checks resolved the earlier release hold.

## Website rollout

- Release source: `48c4772a13085fd604b459fb564f313e55d7583f`.
  [Application CI](https://github.com/nazmirket/coolqr/actions/runs/39407111517) passed.
- npm tarball `coolqr-3.3.1.tgz` SHA-1 is
  `f1c258ac2cc0ad3cc91081b0880fa067cad0b4c5`. Extracted `dist/` files match the tested
  build byte-for-byte and the public package entrypoint was exercised. After web
  authentication, npm publication completed successfully. Registry version 3.3.1
  and the `latest` tag were confirmed. Both registry SHA-1 and SHA-512 integrity
  matched the tested tarball. Tag `v3.3.1` identifies the release source above.
- Source archive SHA-256:
  `df3940206da4109bda441fec651307e4831495aa50bf3691e599f489439e8fe8`.
  Server image `coolqr-demo:48c4772`:
  `sha256:08b75569689fc5e03fd59f019aefe2f434cba0337ff941d2276ec5ba5097ae7f`.
- The isolated canary passed 20 real UI downloads (all ten styles in each layout),
  with exact PNG equality against the tested library and exact payload decoding.
  Transparent-logo upload/download, desktop and 390px mobile checks passed without
  browser exceptions or horizontal overflow. The new output-equality guard
  rejected the old production rendering before promotion.
- Restored the prior image on the canary, verified its identity and HTTP health,
  then restored the candidate and verified its identity again. Promoted that same
  candidate image at **2026-10-20T10:22:37Z**. Nginx and the production port are unchanged.
- The public HTTPS site passed all 20 download comparisons and decoding checks.
  Production reported `healthy`. At rollout, `/opt/coolqr/current` and
  `.deploy-commit` identified the new release. The disposable canary was removed.
- Rollback remains available in `/opt/coolqr/releases/06b2947` using image
  `coolqr-demo:06b2947` (immutable identity
  `sha256:677af2ab3fe42c466eff3b84dbab065b2a1e9a164b9097521acdc21bd570151b`).
  Run `COOLQR_PORT=9491 COOLQR_IMAGE_TAG=06b2947 docker compose -p coolqr up -d --no-build`
  there, verify the page/download, and restore the `current` symlink and
  `.deploy-commit` to `06b29471d55f72081a2f25a0c781c8436fdf3bdb` if recovery is needed.
