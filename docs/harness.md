# Mirket release maintenance

CoolQR adopts [Mirket 0.0.2](https://github.com/codemirket/harness/releases/tag/mirket-v0.0.2), published 2026-10-22T09:36:12Z.
`.mirket/release.json` pins its three native assets, release manifest digest,
compiled source and embedded catalog. CI and `pnpm agents:check` consume the same
pin. The [0.0.1 adoption record](mirket-0.0.1-adoption.md) remains historical.

All registered projects share the per-user installed executable. Compare its
source identity before any repair; coordinate release pins rather than restoring
an older project pin over a newer global installation. Use `mirket update --plan`
to inspect a verified candidate and `mirket update --activate` for an authorized
upgrade that preserves saved selections and restores previously running groups.
Then verify `runtime_status` through each actual client connection.

Existing 0.0.1 registrations, package selections and data are preserved. Do not
import pre-0.0.1 state. New-machine setup follows the pinned
[installation guide](https://github.com/codemirket/harness/blob/mirket-v0.0.2/docs/agent-installation.md)
and `AGENTS.md`. Inspect paginated project listings before registering roots;
never unregister or delete data to bypass an identity mismatch.

After changing the reviewed release, run:

```sh
mirket project plan --project "$PWD"
mirket project doctor --project "$PWD"
pnpm agents:check
```

Synchronize managed copies through `mirket project sync` only when the plan
shows changes, preserving conflicts for inspection. The gate checks exact
executable, source and catalog identity and missing/modified guidance for both
hosts. It must reject an older pin or substituted same-version identity.
CLI checks do not prove desktop activation: compare each actual client's
`runtime_status` with the pin and require `installed_binary.matches_process`.
Claude observations cannot be inferred from Codex.

Compile tokens for dependent production and reference their outputs in authored
source. Observational captures and saved-file exports preserve existing sources
without injecting or requiring tokens. Odiff reports completed comparisons and
whether pixels match separately; request `expect_match: true` when equality is
an acceptance requirement. Inspect applicable design axes and record why any
axis is irrelevant; keep all affected application gates.

Mirket is development tooling, not a dependency of the QR library. Product
verification remains the root and demo gates in `AGENTS.md`; harness checks do
not establish QR decoding, download, print or browser behavior.
