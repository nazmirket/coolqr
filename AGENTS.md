# CoolQR project guidance

CoolQR is a browser side TypeScript library with a Nuxt demo. The package
source lives in `src/`, its compiled output is written to `dist/`, and the
demo is an independent pnpm workspace under `demo/`. Keep browser APIs out of
Node only checks and preserve the public package entry points in `package.json`.

## Mirket workflow

Mirket owns project expertise and task coordination here. The committed
selection is `.mirket/project.json`; generated skill payloads live under
`.agents/skills/`. Do not hand edit generated skill files or add another agent,
skill, hook, or MCP convention. Before substantial work, inspect the selection
and run:

```sh
mirket project plan --project "$PWD"
mirket project sync --project "$PWD"
mirket project doctor --project "$PWD"
```

Read the relevant selected skill body before changing a boundary. Record
durable task decisions and acceptance evidence through Mirket task tools when a
task spans multiple steps or repositories. Keep credentials and rendered
secrets out of the repository.

## Verification

Use the pinned pnpm version from `package.json` and run the narrowest applicable
checks, followed by the full package and demo gates when either changes:

```sh
pnpm install --frozen-lockfile
pnpm verify
pnpm --dir demo install --frozen-lockfile
pnpm --dir demo verify
```

The demo container uses the standard Compose format and is run with Podman on
this host:

```sh
podman compose -f compose.yml config --quiet
COOLQR_PORT=9492 podman compose -p coolqr-validation up -d --build
curl --fail http://127.0.0.1:9492/
podman compose -p coolqr-validation down
```

Use a unique project name and loopback port for disposable checks. A successful
container start does not replace the package, demo, or HTTP checks.
