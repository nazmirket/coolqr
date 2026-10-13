---
name: infrastructure-engineering
description: Implement or review infrastructure configuration, containers, networking, storage and environment reproducibility. Use for desired-versus-observed drift and infrastructure changes; use release-operations for deployment execution and ci-maintenance for pipeline failures.
---

# Infrastructure engineering

Identify the exact repository, environment, account/project, region and resource
owner from available configuration before proposing changes. Read
[the environment recipe](references/environment-change.md) for a concrete
configuration review. Follow existing IaC/provider conventions and pinned tool
versions; discover installed tools before suggesting commands.

Inventory runtime identity, ingress/egress, DNS/TLS termination, ports, secrets
references, persistent data, backup/restore and resource limits. Distinguish
local workspace files from host/container paths. Find which system owns each
resource; manual changes to a generated resource may be overwritten.

Compare desired configuration with observed state when authorized access is
available. Classify replacement, deletion, exposure and data-lifecycle changes
before applying anything. Validate syntax and rendered configuration locally;
then use the project's plan/diff workflow. A clean plan does not establish
application health or successful recovery. Missing remote access remains an
explicit evidence gap.

Use minimum required privileges, bounded resources and explicit persistence.
Check secret references without printing values. Keep state, rendered secret
configuration and sensitive plans out of source control and reports. Inspect
artifact provenance and immutable references using project policy.

Test the affected failure boundary locally or in an authorized disposable
stack: wrong config, restart, unavailable dependency, denied network path or
restored data. Do not infer durability from a healthy process. Avoid destructive
cleanup outside the named disposable resources. Hand deployment and rollback
to `release-operations`; this skill grants no production authority, dependency
installation, account connection or automatic apply.
