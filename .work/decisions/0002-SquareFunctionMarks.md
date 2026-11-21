# 0002 — Square function marks

- Date recorded: 2026-10-20
- Status: Superseded by [0003 — Styled function marks](0003-StyledFunctionMarks.md)
- Release revision: `06b29471d55f72081a2f25a0c781c8436fdf3bdb`

Applying isolated decorative shapes to scanner landmarks caused decoding
failures in URL, Unicode, and numeric cases. Keep timing, alignment, format,
and version modules square and use solid foreground ink for them. Finder styles
remain independently configurable.

This protected landmarks in the [3.3.0 acceptance checks](../../docs/Verification.md#library-review-and-logocontour-changes--2026-10-20).
The fixed geometry also produced a visible mismatch when users selected
decorative styles. The subsequent release verified a different rendering rule.
