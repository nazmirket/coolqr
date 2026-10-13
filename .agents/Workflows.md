# Task workflows

Use one lead workflow with focused support for each task. The selected project
skills are installed under `.agents/skills/` and are read as needed:

| Work | Lead | Evidence |
| --- | --- | --- |
| TypeScript or Nuxt behavior | `engineering-judgment` | Package or demo behavior and its consumer checks |
| Container and local runtime changes | `infrastructure-engineering` | Rendered Compose config, Podman smoke run and recovery probe |
| Regression and release readiness | `test-design` or `release-operations` | Independent expected results and the applicable gates |

Before implementation, trace the affected source, scripts, configuration and
consumers. For container changes, check ports, health semantics, permissions,
secret names and restart behavior. For package changes, verify the built public
entry points and a representative browser consumer. Keep the generated Mirket
selection and skill copies synchronized through the CLI; do not create provider
sidecars, hooks or a second harness.
