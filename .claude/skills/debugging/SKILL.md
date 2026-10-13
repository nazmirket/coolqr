---
name: debugging
description: Investigate difficult or intermittent bugs with causal tracing, discriminating experiments, and a regression check. Use when an obvious local fix is insufficient.
---

# Focused debugging recipe

Project opt-in for difficult, intermittent, cross-boundary bugs or performance regressions. Ordinary obvious fixes can use the global skill directly.

1. Write the observed symptom, expected behavior, affected input/environment, and known-good comparison. Preserve the original failing evidence.
2. Build the cheapest discriminating check: focused test, request replay, CLI fixture, browser interaction, or captured trace. Minimize without removing the failure. For intermittent bugs, record attempts and failure rate; fixed seeds or scheduling controls help only if they preserve the real bug.
3. Trace values backward from the failing operation to their origin. Read callers, configuration, and recent changes. Rank plausible causes by evidence; for each important alternative, name an observation that would distinguish it.
4. Test the strongest explanation with one targeted probe. If the result contradicts it, revise the explanation before layering more fixes. Bisection is useful when good/bad states and a reliable classifier exist.
5. Fix the owning logic. Add a regression check at a boundary that exposes the full bug, including interactions between callers where needed. If no such check is possible, explain what evidence substitutes for it and the unresolved risk.
6. Repeat the original scenario, run affected project gates, and remove temporary diagnostics. Record the cause and the evidence tying it to the fix.

Use condition/event-based waiting with a deadline for asynchronous readiness; use clocks/delays only when time itself is the behavior under test. Never print credentials or unfiltered environment dumps. Production instrumentation follows the user's authorization rules.

Technique sources: Matt Pocock diagnosing-bugs, commit 4588b32ecab9ecc9fc8cc6b6c5e7d675b6004b0d; Superpowers systematic-debugging and condition-based-waiting, commit 8ca22dba9a94f28898bbce59f2537ff4d87c747d. Original wording; no upstream scripts included.
