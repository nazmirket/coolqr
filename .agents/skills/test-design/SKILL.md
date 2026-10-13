---
name: test-design
description: Design regression tests, assess QA readiness or investigate weak and flaky checks using independent expectations and observable behavior. Use for test strategy, substantial user-journey QA or nontrivial test changes.
---

# Quality assurance and behavioral tests

Establish whether the user's result holds under realistic use and failure. Use
the existing project runner and conventions for regression protection; a manual
journey, a visual comparison and an automated test answer different questions.

## Professional stance

Form an independent account of what could invalidate the claimed outcome. Prioritize
consequential failures, trustworthy expectations and reproducible evidence. Ask
which plausible broken implementation could pass the current checks, what effect
must be observed beyond a success message, and where test doubles conceal reality.
Derive expectations from the user contract before using implementation details to
choose efficient probes.

Challenge engineering when passing tests do not observe the promised effect and
product or design when an acceptance statement has several incompatible meanings.
Contribute concrete counterexamples rather than a general demand for more tests.
Hand over reproducible defects with expected and actual behavior, impact, environment
and the smallest useful regression boundary; for a readiness assessment, identify
the evidence supporting it and remaining gaps. Retract a finding when contract or
reproduction evidence disproves it. Adjust confidence to the exercised paths,
including failures, rather than the count of passing checks.

For substantial QA or release assessment, read
[quality assurance](references/quality-assurance.md) to select realistic journeys,
observe their actual effects and report actionable defects. Keep the domain lead
for implementation or visual direction; testing expertise does not replace it.
For interface QA, also read [interface QA](references/interface-qa.md) for focus,
races, persistence and trustworthy visual comparison. Select these modes from
the actual changed boundary; backend QA does not require a screenshot matrix.

## Design regression protection

1. Name the contract and realistic failure: wrong branch, malformed input, missing state change, ordering violation, boundary value, or incorrect external operation.
2. Choose an observable boundary that reaches the bug. Unit, integration, and end-to-end tests serve different evidence needs; choose by behavior and isolation cost rather than a fixed preference.
3. Derive expected results independently. Use worked examples, literal fixtures, invariants, or a trusted independent implementation. Do not reconstruct the production algorithm inside the expected value.
4. Keep the logic under test real. Substitute nondeterministic and external dependencies narrowly; model relevant side effects faithfully. Verify an external call when that call is itself the contract.
5. For new test-first work, take one behavior through failing test, minimal passing implementation, and safe refactoring. For existing changes, prove the regression check detects the broken behavior when feasible without disturbing user work.
6. Review whether plausible wrong implementations would still pass. Strengthen assertions only around actual risks. Test through public behavior where useful; a project's internal invariant can merit focused tests too.
7. Run the affected tests and required gates. Preserve distinct coverage during refactoring; remove duplicates only after establishing what they protect.

Avoid tests that only assert a constant equals its configured literal or source text contains itself. A source/configuration test is useful when it validates a real contract, schema, reference, or consumer requirement.

For flaky checks, retain the failing seed, order, trace and environment before
changing the test. Determine whether shared state, scheduling, data, the oracle
or the product is unstable. Control the relevant dependency or synchronization;
automatic retries, longer sleeps and broader tolerances can hide a real defect.
Replay the failing conditions and an independent normal case after the repair.

Technique sources: Matt Pocock tdd/tests.md and mocking.md, commit 4588b32ecab9ecc9fc8cc6b6c5e7d675b6004b0d; Superpowers test-driven-development/writing-good-tests.md, commit 8ca22dba9a94f28898bbce59f2537ff4d87c747d. Original wording; no dependency additions.
