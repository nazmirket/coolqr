# Worked recipe: add a worker to an existing deployment

Before choosing resources, locate the current application manifest, network,
identity, secret injection mechanism and state owner. Reuse them when they meet
the worker's needs; do not create a second database or public ingress by default.

1. Write the worker's actual start command, required configuration keys (names
   only), shutdown behavior and health semantics. A queue consumer may be alive
   but stalled: define progress separately from process liveness.
2. Bound concurrent jobs against provider quota and database pool capacity.
   Account for all replicas and rolling overlap. Record CPU/memory estimates as
   estimates until measured; do not select arbitrary limits and call them tuned.
3. Confirm the service has only necessary network access and identity grants.
   Verify host publication separately from inter-service connectivity. Review
   data volume ownership, permissions and behavior across replacement.
4. Validate the resolved model with installed, project-supported tooling. For
   Compose, `docker compose config --quiet` validates without printing the
   resolved model. Rendering full configuration can expose substituted values.
   This command does not start services or prove readiness.
5. Inspect the infrastructure plan for replacements, destruction, public routes,
   permission changes and state movement. Terraform's normal plan refreshes
   remote object state; it is not an offline parser. Provider data sources or
   configured helpers may run during planning: inspect them before execution.
   Plan artifacts can contain sensitive values. Use the authorized environment,
   safe storage and exact project command; never treat `apply` as validation.
6. In an authorized disposable stack, prove a job completes, missing config fails
   clearly, restart recovers queued work, shutdown has a bounded drain, and the
   worker cannot reach a prohibited test endpoint. Restore representative backup
   data if changing storage. State which of these were actually exercised.

Review table: resource identity → expected diff → data/exposure consequence →
verification → recovery action. For an existing repo, preserve unrelated drift
and report it; do not import, delete or overwrite remote resources to make the
plan appear clean.

Primary references, checked 2026-10-09:
[Compose config](https://docs.docker.com/reference/cli/docker/compose/config/),
[Terraform plan](https://developer.hashicorp.com/terraform/cli/commands/plan).
Use the installed version's help when flags differ.
