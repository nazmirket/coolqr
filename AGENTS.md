# CoolQR contributor guide

## Working in this repository

- Start at the current Git worktree root (`git rev-parse --show-toplevel`). Read
  the nearest applicable instructions and check the index and working tree before
  writing. Preserve unrelated work, including separate staged and unstaged edits.
- Give each outcome one owner. That owner carries it through the relevant checks
  and reports the result. Keep project rules with the code or guide that owns
  them, and link there from entry points. Update any hook, template, or job that
  still applies a rule you change.
- Use current source and recorded evidence to make decisions. Take the simplest
  complete path within the authorized scope and handle routine, reversible choices
  directly. Raise changes to scope, live systems, access, or unique work before acting.
- Keep proposals, observed results, and open questions distinct. Run the smallest
  check that can detect the relevant failure plus the required project gates.
  Record what passed, what remains unverified, and any limit that matters for the
  next decision.

## Work records

| Path | Contents |
| --- | --- |
| `.work/decisions/0001-DecisionTitle.md` | One architecture decision per file, with date, status, rationale, alternatives, consequences, and supersession links. |
| `.work/plans/0001-Short-Title/` | Durable plans with `Evidences.md` for starting facts and sources, `Scope.md` for authority and limits, `Outcome.md` for acceptance criteria, `Plan.md` for sequence and dependencies, and `Progress.md` for results and open work. |
| `.work/briefs/0001-HandoffTitle.md` | A handoff with its objective, authority, evidence, blockers, and next action. Link to the owning plan or decision. |
| `.work/temp/<task>/` | Disposable scripts, logs, renders, and exports. Remove task output when it is no longer needed. |
| `.work/routines/` | One unnumbered PascalCase Markdown file per device-specific routine, with prerequisites, commands, verification, and recovery. |
| `.work/recover/<task>/` | Recovery files with their original paths and restore instructions. |
| `.work/stashes/<task>/` | Local material set aside for later restoration, with restore instructions. |

Plans, decisions, and briefs are shared and numbered independently. Check active
and archived records before allocating a number. Reuse the existing path when
resuming work. Preserve dates and approval limits, and mark missing information
as unrecorded. Keep cited evidence with its record or maintained fixture. Keep
credentials, account details, and workstation secrets out of shared records.
Use PascalCase for project Markdown filenames, with a lowercase `.md` extension
and conventional names such as `README.md` and `AGENTS.md` where they apply.

## Product boundaries

- `src/encoder/` is the pure QR Model 2 encoder. Keep Node-only encoding free of
  browser globals. `src/Render.ts` owns browser Canvas rendering. `src/index.ts`,
  `src/types.ts`, and `package.json` define the public API. `dist/` is generated.
- The Nuxt demo in `demo/` processes QR content and uploaded logos in the browser.
  Keep content on the device and keep uploaded images, user content, and
  credentials out of logs, commits, and verification artifacts.
- Preserve decoding, function patterns, the quiet zone, logo safety, and styling
  compatibility. Check malformed and oversized payloads and unsafe logo or
  contrast options. The demo's render sequence prevents an older asynchronous
  result from replacing a newer preview. Verify out-of-order completion when
  changing that lifecycle.
- `compose.yml` binds the demo to loopback by default. Preserve the existing
  services, volumes, bind mounts, and ports when verifying container changes.

## Development and releases

Use the [local development guide](docs/Development.md) for setup, required gates,
and OrbStack checks. See [failure probes](docs/FailureProbes.md) for known failure
cases and [verification evidence](docs/Verification.md) for dated results and limits.

Run the application gates and inspect the package contents before an npm release.
`npm run release` publishes the library and runs root verification through
`prepublishOnly`. Before a website rollout, verify the candidate image and
rehearse rollback in an isolated Compose project. Publishing and production
changes each require authorization beyond local verification. See the dated
[release evidence](docs/Verification.md#330-release-and-production-deployment--2026-10-20)
for previous package integrity checks and rollback references.
