# Mirket project setup

This repository uses the Mirket harness. `.mirket/project.json` is the source
of truth for the Codex target and selected expertise; `.agents/skills/` contains
the generated, integrity checked project copies. The repository currently uses
the `project-foundation` baseline plus `infrastructure-engineering` for its
TypeScript package, Nuxt demo and Compose workflow.

Maintain the setup through the supported commands from the repository root:

```sh
mirket project plan --project "$PWD"
mirket project sync --project "$PWD"
mirket project doctor --project "$PWD"
```

Selection, synchronization and project health are separate checks. A healthy
project doctor does not prove that package, demo or container behavior works;
run the project gates documented in `AGENTS.md` as well.
