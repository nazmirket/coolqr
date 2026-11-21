# Local development

Work from the repository root with Node.js 24 (`nvm use`) and pnpm 9.15.9. The
Nuxt demo has its own lockfile. Its `file:..` dependency needs a freshly built
library before the demo install.

```sh
corepack pnpm@9.15.9 install --frozen-lockfile --ignore-scripts
corepack pnpm@9.15.9 verify
corepack pnpm@9.15.9 --dir demo install --frozen-lockfile
corepack pnpm@9.15.9 --dir demo verify
npm pack --dry-run --ignore-scripts
```

The root gate lints, builds, tests QR behavior, and checks a public TypeScript
consumer. The demo gate lints, typechecks, and builds. For interactive work, run
`corepack pnpm@9.15.9 --dir demo dev` after installing the demo.

Inspect the rendered user journey for UI changes and decoded output for renderer
changes. Check the relevant failure boundary in either case. For a supplement to
the gates, see the [rendering and encoder probes](Verification.md#reproducing-the-supplemental-checks).
A generated image or a green build alone cannot verify scanner behavior. Report
browser, scanner, and deployment results only when directly observed.

## Validate the demo in OrbStack

Start OrbStack and confirm the `orbstack` Docker context is reachable. Docker
Compose works against that context without switching your default context.
Choose an unused loopback port and a new Compose project name and image tag for
this check. Run from the repository root. Set `COOLQR_PORT` to the chosen port
before running the block.

```sh
docker context show
docker --context orbstack info --format '{{.ServerVersion}}'
docker --context orbstack compose config --quiet

: "${COOLQR_PORT:?Set COOLQR_PORT to an unused loopback port}"
export COOLQR_PORT
validation_project="coolqr-validation-$(date +%s)-$$"
export COOLQR_IMAGE_TAG="$validation_project"
```

Start the disposable service and verify HTTP and health.

```sh
docker --context orbstack compose -p "$validation_project" up -d --build --wait &&
  curl --fail --silent --show-error "http://127.0.0.1:$COOLQR_PORT/" -o /dev/null &&
  docker --context orbstack compose -p "$validation_project" ps
```

If startup or HTTP verification fails, inspect
`docker --context orbstack compose -p "$validation_project" logs web` before
cleaning up. Run the cleanup even if the check failed. Confirm that `ps -a`
lists no containers for the validation project.

```sh
docker --context orbstack compose -p "$validation_project" down
docker --context orbstack compose -p "$validation_project" ps -a
docker --context orbstack image rm "coolqr-demo:$COOLQR_IMAGE_TAG"
```

`compose.yml` is also used on the production Docker host. Run production
procedures only against an explicitly authorized target.
