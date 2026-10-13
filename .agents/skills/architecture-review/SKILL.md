---
name: architecture-review
description: Review a concrete architecture problem or maintenance hotspot, compare boundaries, and assess migration costs. Use for an explicit architecture review or a difficult structural change.
---

# Focused architecture review recipe

Project opt-in for a difficult change, repeated maintenance friction, or an explicitly requested architecture review. Start with the named problem or recently changing areas.

1. Read the relevant existing design decisions and domain terms. Trace actual callers, data ownership, configuration, and side effects across the affected slice.
2. Identify the cost: repeated edits across files, unclear ownership, callers knowing implementation details, hard-to-test behavior, or inconsistent failure handling. Cite a concrete example rather than counting files or methods.
3. Describe one candidate boundary and the complexity it would contain. Check it against realistic call sites, state lifetime, trust boundaries, deployment boundaries, and present variation needs.
4. Compare a few alternatives only where the decision warrants it. Explain benefits, migration cost, compatibility, and test implications. Include the option to leave the structure in place when benefit is weak.
5. Separate review findings from implementation authorization. Once the intended change is established, preserve relevant regression coverage and verify consumers after migration.
6. Record a short architecture decision only if the choice is consequential, would surprise a future maintainer, and had meaningful alternatives. Use the project's established documentation location.

Use a small diagram when relationships become clearer visually. Existing source remains the authority; an inferred dependency or diagram edge needs explicit labeling. Do not impose a universal glossary of engineering terms or require a renderer for every review.

Technique sources: Matt Pocock codebase-design, domain-modeling, improve-codebase-architecture, commit 4588b32ecab9ecc9fc8cc6b6c5e7d675b6004b0d; Archify repository-authoring reference, commit 73aaa0696e8f72c232ea710e6fa94fd953f3e773. Original wording.
