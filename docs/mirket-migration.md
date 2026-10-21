# Mirket adoption — 2026-10-20

Historical record for the 1.0.11 migration. For the current 0.0.1 method and
checks, see [the current adoption record](mirket-0.0.1-adoption.md).

## Baseline and ownership

Started on clean `master`. Infrastructure engineering leads this migration,
with CI maintenance guidance for verification. Existing project registration
and the shared Codex/Claude skill selection are retained. No application data,
credentials or desktop settings are migrated. This is the single migration
record; operational output stays outside shipped source.

Public release discovery used the GitHub releases API, excluding drafts and
prereleases and sorting by publication time. Selected
[mirket-v1.0.11](https://github.com/codemirket/harness/releases/tag/mirket-v1.0.11),
published 2026-10-20T07:01:43Z. Its `mirket-release.json` SHA-256 is
`c8302fc4259e65d0f63b9899eae9060a73da9332bb61d4b690dcfd052a5cffee`,
matching the public asset metadata. These are publisher integrity checks, not
an independent signature. `mirket info --json` and `update --check --json`
confirmed the installed public binary already matches; no update was needed.

Baseline `pnpm agents:check`: five checks passed; the release check failed
because CI pinned 1.0.5 while the installed runtime was 1.0.11. Managed skills
were current with no conflicts. Existing CI had no application verification.

## Adoption matrix

| Boundary | Current implementation / owner | Guidance / capability | Finding and intended change / consumers | Acceptance and failure case | Status |
| --- | --- | --- | --- | --- | --- |
| Release identity | CI YAML, harness test | Infrastructure / runtime_status | Version-only check accepts different content; centralize public platform hashes and observed source/catalog identity | Real binary check; same-version altered binary/source/catalog rejected | verified |
| Client activation | Global Mirket config | runtime_status | Codex live identity matches installed 1.0.11; Claude connection cannot be observed from Codex | Each client must invoke its own live tool | blocked: Claude |
| Registration / skills | Existing project registration and project.json | project plan/sync/doctor | Seven skills per host already current; retain selection | Doctor passes; missing and modified skill fixtures fail | verified |
| Instructions / onboarding | AGENTS.md, CLAUDE.md, README | Installed guidance | Stale 1.0.5 and duplicated design budget; update release and defer budgets to installed contract | Commands checked against help; no competing instruction owner | verified |
| Library architecture | src/encoder, Render, index, types | Project foundation | Separate pure encoder and browser renderer; no adoption blocker requiring a rewrite | Lint/build/QR tests/public consumer types, invalid input tests | verified |
| Demo / dependency tooling | Independent Nuxt project, file dependency | Frontend / infrastructure | CI must build root before installing demo; Development Node requirement claimed but absent in manifests | Frozen installs and demo lint/types/build | verified |
| CI / release | Harness-only GitHub workflow | CI maintenance | Add application verification; preserve publish as separately authorized action | Local commands and GitHub workflows pass; see linked runs below | verified |
| Design packages | Global optional design package | Package probe / direct tool | Verify installed identity separately from invocation; no requested visual redesign | Probe and actual tool invocation; do not infer output quality | verified |
| Memory / lifecycle | Repository facts and this record | Optional Mem0/LangGraph | Browser library has no persistent server data or resumable agent application; do not introduce a second store | Agent package probe for installed global capability; application integration excluded | not applicable to application |
| Recovery | Git-owned source and lockfiles | Infrastructure | No durable schema migration; preserve existing registration | Isolated skill fixture restoration and verification | verified |
| Deployment | Dockerfile / Compose | Infrastructure | Retain browser privacy and loopback binding | Disposable build and HTTP checks; production unchanged | verified |

## Remaining activation

In the actual Claude Desktop Code session, call Mirket `runtime_status` and
compare with `mirket info --json` and `.mirket/release.json`. Require the public
binary hash for that target, matching source/catalog hashes and
`installed_binary.matches_process: true`. Reconnect that session if mismatched.
A separate CLI/SDK process does not establish activation of an existing session.


## Final verification

All commands below were run on macOS ARM64 with Node 24.18.1 and pnpm 9.15.9.
Linux ARM64 container verification is separate from the GitHub Linux x86-64
runner verified below. Windows application behavior was not exercised.

- `mirket doctor --json`, `mirket catalog check`: pass. Doctor also exercised
  malformed input, resource rejection and concurrent MCP requests in its own
  process; this does not establish desktop activation.
- `mirket project list --json`, `project plan`, `project sync --prune`, and
  `project doctor`: existing registration retained, seven current skills per
  host, no managed changes or conflicts. No relocation needed.
- `pnpm agents:check`: 11 tests pass, including missing/tampered guidance on both
  targets, isolated restoration, same-version binary/source/catalog drift,
  unknown platform, stale process and standalone CI without a desktop home.
- Root frozen install with scripts disabled, `pnpm verify`: pass, 11 application
  tests plus public consumer type checks, build and lint. Repeated after edits.
- Demo frozen install after root build, `pnpm --dir demo verify`: pass, lint,
  typecheck and production build. Lockfiles unchanged.
- `npm pack --dry-run --json --ignore-scripts`: package contents inspected;
  no harness, demo or private task artifacts ship in the library.
- Compose config, disposable image build, health check, HTTP 200 for home/favicon,
  HTTP 404 for `/icon.png`, and HTTP 200 after restart: pass on loopback 9496.
  The validation container and network were removed. No production deployment.
- `git diff --check`: pass. Migration changes were subsequently committed and
  pushed with explicit user authorization; no package publishing performed.

The real Codex `runtime_status` was called before and after the changes. Both
calls observed process 47872, version 1.0.11, target `aarch64-apple-darwin`, public
binary `14a03254b9c08a5ffe4a571060d9dfc1111812605f3e33c192b3579529bdfc0d`,
source `1e81a3d99054b05ac354dce604857a9a73ee75105697ad62a97799c250e6bf51`,
and catalog `e4e785527f24ec2eb4fc0d7448f3740fda7b71ad3f63103c3065d66312e5ebfa`.
`installed_binary.matches_process` was true. Terminal and both client
configuration executable paths were inspected and their binary content matched.
Claude configuration readiness is verified; its live connection remains blocked.

## Optional package evidence and exclusions

`package probe design --schemas --json` verified discovery; a separate real
Codex design MCP `svg_optimize` invocation processed an isolated copy of the
existing ISC-licensed favicon. Saved SVG source was inspected for preserved
geometry, colors and accessible label. Output SHA-256:
`be8c593c49f179e1efff107775d6ca7130e70b05b05339c81434e9bf83209814`.
Live design runtime SHA-256:
`4b111361631024ad2eb9b9b427999f68cba38ce44d1a065ac0bcab41130fc344`.
The scratch copy was removed after inspection. No product visual change or
rendered-equivalence claim is made. Mechanical optimization needs no new design
target or token compilation. Future rendering must follow installed contracts,
including canonical token compilation before dependent rendering.

`package probe agent-runtime --json` invoked its identity operation and observed
Mem0 2.2.1, LangGraph 1.2.16, checkpoint-sqlite 3.1.2, fastembed 0.9.0, with runtime
SHA-256 `cf27a13ba5bb500bd242ebb84fe20bcac8a71aa2ea53951518d85f867e31af88`.
No private memory was read or written. This does not verify retrieval quality or
worker recovery. Those application integrations are excluded because CoolQR has
no agent runtime, durable backend or persistent application state.

Penpot is not enabled; editable design documents are not a deliverable. Video,
paged output, diagrams, raster generation and new token architecture are also
outside this migration. No reason was found to replace the pure encoder/browser
renderer separation or the demo's explicit asynchronous sequence guards.
Previously documented timed delayed-image race testing remains unverified;
this migration makes no new claim about that behavior.

## Recovery and handoff

The isolated failure fixtures restore the original managed skill and rerun the
real doctor successfully. No durable database or backup format changed, so a
private-state archive/restore was not warranted. Do not downgrade a schema-4
home by replacing only its binary. For future durable migration, inspect
`mirket backup --help`, preserve consistent state, and use the supported restore
contract in an isolated supported destination. Project assets and desktop
settings require their own backups.

The only remaining adoption gap is the actual Claude session invocation above.
Claude live activation remains **blocked / unverified**; neither the successful
Codex call nor GitHub CI verifies that connection.

## Authorized push and GitHub verification

Migration commit `d47414e337ab8f3d50b21db7c83cab529b450a43` was pushed to
`master` with explicit user authorization. Both workflows completed successfully
for that exact commit:

- [Application, run 39391889177](https://github.com/nazmirket/coolqr/actions/runs/39391889177):
  frozen installs, library lint/build/tests/types, demo lint/types/build and
  package dry-run passed.
- [Mirket harness, run 39391889199](https://github.com/nazmirket/coolqr/actions/runs/39391889199):
  published Linux binary digest, compiled source/catalog identity, project doctor
  and failure/restoration probes passed.

No failure repairs were needed. GitHub reported an informational Ubuntu runner
image migration annotation; neither workflow failed or skipped its checks.
