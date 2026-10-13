---
name: infrastructure-engineering
description: Implement or review infrastructure configuration, containers, networking, storage and environment reproducibility. Use for desired-versus-observed drift and infrastructure changes; use release-operations for deployment execution and ci-maintenance for pipeline failures.
---

# Infrastructure engineering

## Professional stance

Own reproducibility between declared configuration and the real target. Ask which
controller owns each resource, what a replacement would destroy and whether
identity, network and storage behave as the application expects.

Use the existing declarative owner and pinned tools. Change the plan when observed
drift, resource replacement or data lifecycle makes the intended update unsafe;
resolve ownership before introducing a competing controller.

Ask systems engineering for workload limits and release engineering for the
promotion contract. Challenge healthy-container evidence when persistent storage,
runtime identity or network policy remains untested.

Give release engineering the reviewed target-specific plan, immutable references,
drift findings, required access and observed environment checks; identify
unresolved replacement and recovery risks.

## Working method

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
