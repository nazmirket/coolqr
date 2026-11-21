# CoolQR contributor guide

## Product boundaries

- `src/encoder/` is the pure QR Model 2 encoder; `src/Render.ts` is browser
  Canvas rendering. `src/index.ts`, `src/types.ts` and `package.json` define the
  public API. `dist/` is generated. Keep Node-only encoding free of browser globals.
- `demo/` is an independent Nuxt application with its own lockfile; its `file:..`
  dependency needs a freshly built root before the demo install. Preserve the
  browser-side/local-processing privacy guarantee: no QR content is sent to a
  server for rendering. Do not expose uploaded images, user content or credentials
  in logs, commits or verification artifacts.
- Preserve QR decoding, function patterns, quiet zone, logo safety and styling
  compatibility. Check malformed/oversized payloads and unsafe logo or contrast
  options. A generated image or a green build does not prove a scanner can read it.
  `docs/Verification.md` records dated scanner/browser evidence and its limits;
  `docs/FailureProbes.md` records product failure cases. Neither is a current
  substitute for testing a changed rendering path.
- The demo's asynchronous render sequence keeps old results from replacing new
  previews. Verify out-of-order completion when changing that lifecycle.
- `compose.yml` binds the demo to loopback by default.

## Work and verification

Use Node 24 and pnpm 9.15.9, as declared in the manifests and `.nvmrc`:

```sh
corepack pnpm@9.15.9 install --frozen-lockfile --ignore-scripts
corepack pnpm@9.15.9 verify
corepack pnpm@9.15.9 --dir demo install --frozen-lockfile
corepack pnpm@9.15.9 --dir demo verify
npm pack --dry-run --ignore-scripts
```

The root gate lints, builds, tests QR behavior and checks a public TypeScript
consumer. The demo gate lints, typechecks and builds. Inspect the real rendered
journey for UI changes, decoded output for rendering changes, and the failure
boundary for either. For container changes, use an authorized disposable Compose
project and an unused loopback port; validate configuration, HTTP behavior and
cleanup without touching production. State skipped or unavailable checks and
report browser, scanner and deployment results only when directly verified.

Use the [OrbStack commands](docs/Development.md#validate-the-demo-in-orbstack)
for local container checks.

## Releases

Run the application checks above and inspect the package contents before an npm
release. `npm run release` publishes the library and runs root verification through
`prepublishOnly`. For a website rollout, verify the candidate image and rehearse
rollback in an isolated Compose project before promotion. Keep publishing and
production deployment separately authorized from local verification. See
`docs/Verification.md` for previous package integrity checks, rollout procedures
and rollback commands.
