# Mirket 0.0.1 adoption — 2026-10-21

This is historical 0.0.1 evidence. See [current harness guidance](harness.md)
for the adopted release and maintenance procedure. The [2026-10-20 migration record](mirket-migration.md)
describes the earlier 1.0.11 installation and remains historical evidence.

## Baseline and ownership

`master` was at `8f6c125`, equal to `origin/master`, with no unpushed commits.
The original checkout had uncommitted 1.1.0 work in `AGENTS.md`, the release
pin, README and migration record, plus an untracked adoption draft. It was left
untouched. This change was made on the isolated `mirket-0.0.1` worktree branch.

The tracked inventory has one project instruction owner (`AGENTS.md`) and a thin
Claude import (`CLAUDE.md`). `.mirket/project.json` selects `project-foundation`
and the frontend, infrastructure and search specialists for both hosts. The
seven `.agents/skills/` and seven `.claude/skills/` directories, including
receipts, references and notices, are Mirket-managed; `project plan` found all
14 current. No tracked agent prompts, competing role catalogs, repository MCP
configuration, setup scripts or nested instruction owners were found.
`scripts/harness.node.mjs` and `scripts/harness-identity.mjs` are useful failure
probes. Both GitHub workflows remain useful: the harness workflow verifies the
published binary and guidance, while the application workflow tests the root
before the demo's local dependency. `.gitignore` and `.dockerignore` protect
local state and production packaging. `docs/verification.md` contains dated
product evidence and was retained. The prior migration record is labeled
historical; it is not a setup recipe for 0.0.1.

The library remains a pure QR encoder in `src/encoder/` and a browser canvas
renderer in `src/Render.ts`, exported through `src/index.ts`. The independent
Nuxt demo consumes the built root package. No source, dependency, quality gate
or CI workflow change was needed for the harness migration.

## Verified 0.0.1 route

The [official release](https://github.com/codemirket/harness/releases/tag/mirket-v0.0.1)
and [installation guide](https://github.com/codemirket/harness/blob/main/docs/agent-installation.md)
define a fresh baseline under `~/.mirket`. The release's `mirket-release.json`
asset (SHA-256 `1713db88d2143418ee7feeefca32ecefd5e8c0ca79607e1b6b8236df4fa9b408`)
supplied the three platform binary hashes in `.mirket/release.json`. Its release
notes supplied compiled source hash
`9fafb9569f18111047ac704301513aca67ae85ab04a0f588f95382425e0f133e`;
the live CLI and Codex MCP reported catalog hash
`fa6bac7cb2b55197fdd49b5ab27b378ab1bef4d295b5f36840b7c1f10f1fbe53`.
The installed macOS ARM64 binary at `~/.mirket/bin/mirket` hashes to
`20221fee28ff8658c6dd59d2e119f1b8bd42ff6ba88f93a93549df4583e6a208`,
matching that release asset. `mirket doctor --json` passed. These checks bind
bytes to the publisher's release, without claiming an independent signature.

Paginated `project list` was empty in the fresh 0.0.1 home. `project init`
reported that the repository already had `.mirket/project.json`;
`project register --project /Users/nazmiyilmaz/Projects/coolqr` registered that existing
manifest through the supported command. No older registration or private state
was imported. `project plan`, `sync` and `doctor` reported no managed-copy drift
or conflicts. The same manifest and generated copies passed plan and doctor in
the isolated worktree. A focused Mem0 read on the registered root returned no
facts. It was a successful project-scoped invocation, not a retrieval-quality
claim. No Mirket worker was launched; LangGraph checkpoint recovery therefore
was not exercised.

The active instruction now maps editable design to OpenPencil, live UI to
browser inspection, and diagrams to Kroki with Excalidraw selected only when
needed. The earlier Penpot and bundled HyperFrames directions were retired;
encoded video requires separately selected host tooling. Existing managed
skills and optional package selections were preserved. No new design file or
visual asset was needed for this documentation and harness change.

As a project-scoped design invocation, the installed `vector_render` tool
processed an isolated copy of `demo/public/favicon.svg`. Its optimized SVG
retained the `CoolQR` label, geometry and colors; its 128×128 PNG preview was
opened and visually inspected. The output SVG hash was
`be8c593c49f179e1efff107775d6ca7130e70b05b05339c81434e9bf83209814`.
The scratch output stayed in Mirket's workspace and was not substituted for
the production asset. This confirms one useful vector route, not aesthetic
acceptance of future designs or readiness of every optional design tool.

## Checks and limits

On macOS ARM64, Node 24.18.1 and pnpm 9.15.9, the frozen root install and
`pnpm verify` passed lint, build, 18 application tests and public consumer types.
The root was built before the frozen demo install; demo `verify` passed lint,
typecheck and production build. `pnpm agents:check` passed 11 checks, including
real missing and modified managed-skill failures for both hosts, restoration,
same-version identity changes, and stale-process rejection. `project doctor`
passed after the edits. The existing invalid-input and overflow tests are
discriminating behavior probes; no test threshold was lowered.

`npm pack --dry-run --ignore-scripts` contained only the library's expected
files, with no Mirket guidance or local state.

The built demo was opened locally in a browser. Portfolio and Moss studio
changed the content, palette and pattern while the preview remained Ready; the
generated image had a `data:image/png;base64` source. Clearing the content
disabled Download PNG and showed the waiting state; restoring the content
regenerated the preview. The browser's download event timed out, so this run
does not verify a saved PNG file or scanner decoding. No application UI changed.

The live Codex `runtime_status` and `mirket info --json` matched on version,
target, executable, source and catalog hashes, with
`installed_binary.matches_process: true`. This establishes the Codex connection
only. Claude's configured executable passed `mirket doctor`, but its actual
desktop connection cannot be observed from this chat; Claude must call
`runtime_status` in its own session. Physical scanner, print, Safari and Firefox
behavior were outside this harness migration; their dated evidence and limits
remain in `docs/verification.md`.

The optional Compose configuration check could not connect to the stopped
`podman-machine-default`; no VM was started and no container or deployment was
changed. Container HTTP behavior is unverified in this run.
