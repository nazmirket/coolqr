# CoolQR — Mirket project guidance

Use the installed Mirket Pi Durable host for agentic work in this repository.
This file is the sole repository-specific agent guidance; there are no
Codex/Claude skill copies, client registrations, release pins or repository MCP
servers. The host's selected skills, local tools and explicitly configured MCP
tools provide general methods. Do not discover or execute an ambient agent binary,
install an agent, change account-wide settings, or bind an unverified executable.
An installed launcher bound to another project is not proof of a CoolQR startup;
report that gap rather than rewriting a user-wide launcher from this repository.

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
  `docs/verification.md` records dated scanner/browser evidence and its limits;
  `docs/failure-probes.md` records product failure cases. Neither is a current
  substitute for testing a changed rendering path.
- The demo's asynchronous render sequence keeps old results from replacing new
  previews. Verify out-of-order completion when changing that lifecycle.
- `compose.yml` binds the demo to loopback by default. Deployment, publishing and
  third-party effects are separate from local verification and require the user's
  scope and an observed recovery path; preserve the historical rollback evidence
  in `docs/verification.md`.

## Work and verification

Inspect Git status, affected owners and the selected Pi Durable capability before
editing. Keep source and project state in the repository; use the host's selected
skills for debugging, frontend, infrastructure, testing, accessibility, design,
search and release work when applicable. Use only installed, verified local
executables and MCP routes explicitly selected in this host. MCP availability in
a tool list does not prove a peer is connected. Keep generated previews and
fixtures within authorized project paths. Preserve unrelated changes and private
state; never run an installer or overwrite a conflicting file to make a check pass.

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
never claim live browser, scanner, deployment or host-startup coverage from a
source or test result alone.
