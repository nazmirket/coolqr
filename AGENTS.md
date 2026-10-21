# CoolQR repository workflow

CoolQR is a browser-side TypeScript library in `src/` with public entrypoints
in `package.json`. `dist/` is generated. The independent Nuxt demo in `demo/`
has its own pnpm lockfile and consumes the root package through `file:..`.
Preserve QR encoding correctness, browser-only rendering boundaries, package
exports and the local-processing privacy guarantee.

Selected specialists cover frontend, infrastructure and search visibility.
The two host targets share one selection; do not duplicate target-specific
lists when their expertise is identical.

## Harness ownership

Mirket owns reviewed expertise, managed skill copies and its routed workers.
`AGENTS.md` owns repository instructions; `CLAUDE.md` imports it. The manifest
`.mirket/project.json` selects the same expertise for Codex Desktop and Claude
Desktop Code. `.agents/skills/` and `.claude/skills/` are Mirket-managed copies,
including integrity receipts and license notices; maintain them with the CLI.
`project-foundation` supplies architecture, debugging, testing and release
methods. Shared planning, security, research and coordination guidance comes
from the global installation, not duplicate project copies.

On a new machine, follow the [official 0.0.1 installation guide](https://github.com/codemirket/harness/blob/main/docs/agent-installation.md):
verify the release artifact before running it and keep Mirket application data
under `~/.mirket`. Configure the actual Codex and Claude hosts, then run:

```sh
mirket setup --target all --yes
mirket project register --project "$PWD"
mirket project plan --project "$PWD"
mirket project sync --project "$PWD" --prune
mirket project doctor --project "$PWD"
```

The reviewed release is [mirket-v0.0.1](https://github.com/codemirket/harness/releases/tag/mirket-v0.0.1).
This fresh baseline does not import pre-0.0.1 registrations or state. Inspect
registered roots with paginated `mirket project list --json` before registering
an existing manifest with `mirket project register --project "$PWD"`. Use
`project init --project "$PWD" --target all` only when no manifest exists.
`.mirket/release.json` pins the published binary, compiled source and embedded
catalog identities for CI and
local checks. Never bypass a digest mismatch or overwrite managed-copy conflicts.

Before work, inspect current changes, this guide, affected source owners, the
manifest and available tools. Run `pnpm agents:check`. A failed check is a
finding to investigate; do not overwrite changed managed files to hide it.
Use `mirket project add/remove` to change selections, then inspect the plan,
sync with `--prune` and review the diff. Keep only expertise justified by an
existing project boundary. Do not add competing rule directories, skill
installers, repository MCP servers or model pins.

## Execution and evidence

Select guidance from the deliverable and affected boundary. Read the relevant
skill and only useful references; use `skill-catalog` when discovery is needed.
The catalog is advisory, not exhaustive. User choices, project requirements,
source rights and host permissions govern tool use and external effects.

Handle routine work directly. When continuity, recovery or coordination needs
durable state, reuse a sufficient existing record or use Mirket task tools;
retain decisions, source pointers, acceptance evidence and a meaningful failure
probe. Do not create a parallel tracker or require task ceremony for every edit.
With the optional agent runtime selected, use focused Mem0 recall for prior
project decisions and store only verified stable facts with provenance and
supersession. Mirket-owned workers use LangGraph checkpoints; inspect and resume
their original workflow after an interruption. Native host sessions retain
their own lifecycle. Do not infer memory correctness from package readiness.

Delegate only when independent work materially helps or it is requested. For
Mirket-owned workers, read `agent-coordination/references/model-routing.md`
through `skill_read`, inspect `capability_plan`, discover `model_registry`, and
preview `route_task`. Declare only actual deliverables in `task_needs`; use
`spawn_subagent` with bounded briefs, disjoint ownership and the resolved tool
scope. Read the resolved guidance and verification contract and integrate the
actual output. Native host tools and native subagents remain host-owned;
Mirket does not intercept them or grant additional permissions.

Design work follows image-to-code. Read the installed `interface-design`
`references/image-to-code.md` contract. Inspect a supplied target or create a minimal native specimen suited to the
medium; use the host image model when raster composition helps the deliverable.
Render and inspect the target, then freeze it before expansion. Retain the target, provenance
and viewport/state so comparisons are reproducible. Gate composition, typography,
assets, responsive layout, behavior and requested motion against the frozen
target; a still image cannot prove animation. Inspect normal-motion frames and
reduced-motion behavior. Use the installed medium-specific production budgets and report unresolved
defects at the limit. Do not restart sample campaigns to reset the budget. Use the project's application gates below
for implementation evidence; tool readiness and screenshots alone are not
acceptance.

For Mirket design production, use the single `design` package's reported
workspace and compile Style Dictionary tokens before dependent rendering. Route
live UI to browser inspection, editable designs to OpenPencil, diagrams to
Kroki (select Excalidraw explicitly only when needed), paged work to Typst,
vectors to SVG/resvg, SVG hygiene to SVGO, raster preparation to Sharp, static
Flexbox graphics to Satori/resvg and comparable pixels to Odiff. Encoded video
requires separately selected host tooling. Inspect saved outputs.
Package installation, runtime readiness, invocation and useful output are
separate facts; use native project tools for application verification.

Before delivery, run the affected application gates below and `pnpm agents:check`.
That harness gate runs the installed doctor plus real missing/tampered-skill
probes for both targets. CI provisions a digest-verified published Linux CLI
and checks committed files without synchronizing them first. A green doctor
does not prove desktop activation, authenticated worker execution or application
correctness. Call `runtime_status` in each actual desktop connection and compare its binary,
source and catalog hashes with the reviewed pin. Require
`installed_binary.matches_process: true`; CLI doctor does not prove activation.
See `docs/mirket-0.0.1-adoption.md` for current evidence and remaining client gaps.

Keep secrets, local host configuration, task/runtime caches and the transient
`.mirket/project.lock` mutex out of commits. Preserve unrelated work. Commits,
pushes, releases, external messages and production changes need user authority;
a role, registration or passing test does not supply it.

## Application gates

Use Node.js 24 and pnpm 9.15.9 as declared in the package manifests and `.nvmrc`.

```sh
corepack pnpm@9.15.9 install --frozen-lockfile --ignore-scripts
corepack pnpm@9.15.9 verify
corepack pnpm@9.15.9 --dir demo install --frozen-lockfile
corepack pnpm@9.15.9 --dir demo verify
```

The root verification includes lint, build, QR regression tests and public type
checks. Build the root package before installing the demo's file dependency.
Inspect the rendered demo for interface changes; build success alone cannot
prove canvas, download or interaction behavior.

Use Podman and the installed Compose provider for disposable container checks:

```sh
podman compose -f compose.yml config --quiet
COOLQR_PORT=9492 podman compose -p coolqr-validation up -d --build
curl --fail http://127.0.0.1:9492/
podman compose -p coolqr-validation down
```

Choose an unused loopback port and project name. Keep package publishing
(`pnpm release`) separate from validation; run it only when authorized.
