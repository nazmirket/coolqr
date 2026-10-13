# Test the user's result

Use when assessing a substantial journey, regression risk or release readiness.
Reuse the project's tests, fixtures and issue format. Select from actual risk;
do not generate a universal matrix or require a new QA service.

## Establish the oracle and environment

Identify the user/role, entry state, action and observable result from requirements,
domain rules or a known correct control. Check the exact revision/build, data and
environment. Distinguish existing failures from regressions introduced by the change.
For an ambiguous requirement, preserve the question and test the parts that are
settled rather than inventing a pass criterion from current implementation.

Choose boundaries where a plausible defect would matter: permissions/tenants,
money or counts, durable writes, asynchronous jobs, external effects, navigation,
accessibility and supported devices. Prioritize high-impact paths and the changed
surface. Test data should include realistic empty/large/long values and meaningful
states; random filler can hide the business failure.

## Follow the effect, including failure

Exercise the full affected path through available tools. Read a saved value after
reload or through a separate read, inspect the exported file, wait for a job's
terminal state, or verify the forbidden operation was rejected at the owning
boundary. A toast, HTTP 200 or mocked call is insufficient when the contract is
the stored result. Use isolated fixtures or authorized environments for effects.

Choose failure probes that distinguish likely wrong implementations:

| Risk | Discriminating observation |
| --- | --- |
| Double submit or retry | One intended durable effect, or the contract's explicit duplicate outcome. |
| Late response | Older work cannot overwrite newer user intent. |
| Partial batch failure | Successful and failed items reconcile; recovery does not repeat completed effects. |
| Authorization | A second role/tenant is rejected server-side, not merely hidden in the UI. |
| Navigation/reload | Deep entry, history and durable state remain coherent. |
| Interrupted work | Cancellation, restart or recovery preserves the agreed invariant. |

Use controlled scheduling or explicit synchronization for races instead of sleeps
that merely make a failure less likely. Keep the system under test real at the
boundary being claimed. A local substitute establishes its exercised contract;
live integration or engine-specific semantics still need their own evidence.

For UI, check keyboard/focus, labels and error recovery alongside visuals. Use
actual rendered states and realistic content. Device emulation checks viewport
and input assumptions; report physical touch, browser chrome, keyboard and safe-area
behavior as unverified unless exercised on matching hardware. Record which
browsers/versions were tested rather than implying universal readiness.

## Turn observations into useful defects

Include the build/environment, smallest reproduction, expected versus observed
result, evidence location and consequence. Severity follows impact and reach,
not how dramatic a screenshot looks. Separate a requirement defect from a taste
suggestion or a path that could not be tested. Do not file external issues unless
authorized; local findings are enough for implementation/review work.

Example: selecting rows A and C shows a success notice, but after reload A and B
have changed. Retain the selected IDs, request mapping and after-reload observation.
Repair the selection-to-write boundary, then verify both changed and untouched rows.
Checking only notice text would preserve this bug. A floating-toolbar preference
can be considered separately and does not block the persistence fix.

After repair, rerun the failing path and affected regression checks on the changed
artifact. Where practical, show that the new check catches the earlier defect.
Report verified paths and material limits. Do not equate test count, coverage or
an agent review score with release acceptance. Stop once the requested assessment
is supported; a remaining production-only condition stays explicit.
