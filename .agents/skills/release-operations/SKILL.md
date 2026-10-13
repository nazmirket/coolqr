---
name: release-operations
description: Prepare and execute authorized releases with artifact identity, staged rollout, compatibility checks, observability, and tested recovery.
---

# Release operations

## Professional stance

Own the transition from a known artifact to observed user behavior in a specific
environment. Ask whether every rollout stage can detect harm and recover while old
and new versions coexist.

Choose rollout and recovery from impact and compatibility. Halt progression at
agreed guardrails; switch from binary rollback to forward repair when newer data
or external effects make rollback invalid.

Ask backend and migration owners to prove mixed-version compatibility and
infrastructure to reconcile target drift. Challenge process health that misses
business failure or a rebuild substituted for the tested artifact.

Provide target and artifact identity, stage history, guardrail evidence, observed
business outcomes, recovery result and remaining observation requirements to the
operating owner.

## Working method

Establish the exact service, environment, region/account, release revision,
expected behavior, and authorization. Separate preparation from deployment:
repository access or a general implementation request does not authorize production.

Inspect the existing build/promote/deploy commands, artifact registry, target
identity and credential scope. Confirm that the selected CLI/API can read the
actual target and immutable artifact when access is available. Local build tools,
remote deployment access and signing credentials are separate prerequisites;
missing deployment access still permits a concrete release candidate and runbook.

## Prepare a reviewable release

Identify the build artifact and immutable digest, configuration/secret references,
dependency versions, infrastructure changes, database migrations, and consumers.
Use the project's build/release system and required checks. Verify that the tested
artifact is the artifact being promoted; do not silently rebuild different bytes.

Check backward/forward compatibility across mixed versions: APIs, events, data
schemas, cached formats, workers, and long-lived clients. Coordinate migration,
backfill, feature enablement, and cleanup in an order that supports this overlap.

Define health evidence, business guardrails, failure thresholds, observation window,
owner, and recovery action before rollout. A passing health endpoint alone does
not establish correct business behavior. Test recovery using a representative
nonproduction environment when its feasibility is uncertain.

## Roll out within scope

Confirm current target state and drift. Review the plan/diff, resource replacement,
permission expansion, data deletion, and cost changes. Resolve ambiguous destructive
changes before execution; do not treat a provider's default approval flag as consent.

Choose rolling, canary, blue/green, or maintenance-window delivery based on failure
impact and the application's compatibility. Record changes and timestamps. Monitor
errors, latency, saturation, queues, dependency failures, and relevant user outcomes.
Bound retries and stop progression on the agreed failure condition.

Serialize competing releases through the project's existing lock or expected-state
mechanism. Before advancing a stage, verify that the observed revision still
belongs to this rollout. If a deployment call times out, reconcile its operation
status and active artifact before retrying; a second deployment can replace a
successful first one or interfere with recovery.

## Recover and close

Choose rollback or forward fix based on data compatibility, not habit. Restore
configuration/artifact references deliberately; check whether irreversible writes,
external effects, or schema changes prevent a clean binary rollback. Preserve
incident evidence and validate restored behavior.

Rehearse a discriminating failure in the isolated release path: an artifact that
starts but fails a business guardrail must halt promotion and trigger the defined
recovery. Check the recovered artifact identity and data compatibility, including
any newer writes. Successful rollback command output alone does not prove service
or user-state recovery.

Report the actual target, artifact/revision, rollout status, observed checks,
remaining monitoring, and recovery readiness. Separate deployed, healthy, and
fully observed: each is a different claim. Do not create a recurring monitor
unless requested; use the host's scheduler when future monitoring is authorized.
