---
name: test-design
description: Design regression tests, assess QA readiness or investigate weak and flaky checks using independent expectations and observable behavior. Use for test strategy, substantial user-journey QA or nontrivial test changes.
---

# Behavioral test design recipe

Project opt-in when adding meaningful behavior, preventing regressions, or repairing weak/flaky tests. Use the existing project runner and conventions.

For substantial QA or release assessment, read
[quality assurance](references/quality-assurance.md) to select realistic journeys,
observe their actual effects and report actionable defects. Keep the domain lead
for implementation or visual direction; testing expertise does not replace it.

1. Name the contract and realistic failure: wrong branch, malformed input, missing state change, ordering violation, boundary value, or incorrect external operation.
2. Choose an observable boundary that reaches the bug. Unit, integration, and end-to-end tests serve different evidence needs; choose by behavior and isolation cost rather than a fixed preference.
3. Derive expected results independently. Use worked examples, literal fixtures, invariants, or a trusted independent implementation. Do not reconstruct the production algorithm inside the expected value.
4. Keep the logic under test real. Substitute nondeterministic and external dependencies narrowly; model relevant side effects faithfully. Verify an external call when that call is itself the contract.
5. For new test-first work, take one behavior through failing test, minimal passing implementation, and safe refactoring. For existing changes, prove the regression check detects the broken behavior when feasible without disturbing user work.
6. Review whether plausible wrong implementations would still pass. Strengthen assertions only around actual risks. Test through public behavior where useful; a project's internal invariant can merit focused tests too.
7. Run the affected tests and required gates. Preserve distinct coverage during refactoring; remove duplicates only after establishing what they protect.

Avoid tests that only assert a constant equals its configured literal or source text contains itself. A source/configuration test is useful when it validates a real contract, schema, reference, or consumer requirement.

Technique sources: Matt Pocock tdd/tests.md and mocking.md, commit 4588b32ecab9ecc9fc8cc6b6c5e7d675b6004b0d; Superpowers test-driven-development/writing-good-tests.md, commit 8ca22dba9a94f28898bbce59f2537ff4d87c747d. Original wording; no dependency additions.

For substantial interface QA, read [interface QA](references/interface-qa.md)
for race, focus, persistence and cross-device probes beyond a static capture.
