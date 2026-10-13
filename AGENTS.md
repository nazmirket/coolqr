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

The committed baseline uses pnpm 9-compatible lockfiles. Use the explicit
Corepack version below when validating this revision and run the package build
before the container gate:

```sh
corepack pnpm@9.15.9 install --frozen-lockfile --ignore-scripts
corepack pnpm@9.15.9 run build
```

The committed demo workspace is built by the standard Compose workflow and is
run with Podman on this host. The image installs the demo's own lockfile before
copying the workspace so local source dependencies cannot leak into the image:

```sh
podman compose -f compose.yml config --quiet
COOLQR_PORT=9492 podman compose -p coolqr-validation up -d --build
curl --fail http://127.0.0.1:9492/
podman compose -p coolqr-validation down
```

Use a unique project name and loopback port for disposable checks. A successful
container start does not replace the package, demo, or HTTP checks.
