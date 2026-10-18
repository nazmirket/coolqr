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

On a new machine, install the published CLI from
[codemirket/harness](https://github.com/codemirket/harness/releases), then run:

```sh
mirket setup --target all --yes
mirket project init --project "$PWD" --target all
mirket project plan --project "$PWD"
mirket project sync --project "$PWD" --prune
mirket doctor --project "$PWD"
```

The reviewed release is [mirket-v1.0.4](https://github.com/codemirket/harness/releases/tag/mirket-v1.0.4),
published 2026-10-18T14:26:16Z. Resolve future releases by publication time,
not the largest historical version. Use `mirket update --check` to inspect and
`mirket update` to update; synchronize and verify each affected project afterward.
Update the CI release and SHA-256 together from the published asset metadata.
Do not substitute an unreviewed source build or bypass a digest mismatch.

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

Delegate only when independent work materially helps or it is requested. For
Mirket-owned workers, read `agent-coordination/references/model-routing.md`
through `skill_read`, inspect `capability_plan`, discover `model_registry`, and
preview `route_task`. Declare only actual deliverables in `task_needs`; use
`spawn_subagent` with bounded briefs, disjoint ownership and the resolved tool
scope. Read the resolved guidance and verification contract and integrate the
actual output. Native host tools and native subagents remain host-owned;
Mirket does not intercept them or grant additional permissions.

For Mirket design production, use the single `design` package's reported
workspace and compile Style Dictionary tokens first. Route live UI to
Playwright, editable canvases to official Penpot MCP, diagrams to Kroki,
video to HyperFrames lint → snapshot → render, paged work to Typst, vectors
to SVG/resvg, SVG hygiene to SVGO, raster preparation to Sharp, static Flexbox
graphics to Satori/resvg and comparable pixels to Odiff. Inspect saved outputs.
Package installation, runtime readiness, invocation and useful output are
separate facts; use native project tools for application verification.

Before delivery, run the affected application gates below and `pnpm agents:check`.
That harness gate runs the installed doctor plus real missing/tampered-skill
probes for both targets. CI provisions a digest-verified published Linux CLI
and checks committed files without synchronizing them first. A green doctor
does not prove desktop activation, authenticated worker execution or application
correctness. In a fresh desktop session, invoke a Mirket tool and inspect its
result before claiming that host is activated.

Keep secrets, local host configuration, task/runtime caches and the transient
`.mirket/project.lock` mutex out of commits. Preserve unrelated work. Commits,
pushes, releases, external messages and production changes need user authority;
a role, registration or passing test does not supply it.

## Application gates

Use Node.js 24 and pnpm 9.15.9 as pinned in both package manifests.

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
