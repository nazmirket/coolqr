# 0003 — Styled function marks

- Date recorded: 2026-10-20
- Status: Accepted in CoolQR 3.3.1
- Supersedes: [0002 — Square function marks](0002-SquareFunctionMarks.md)
- Release revision: `48c4772a13085fd604b459fb564f313e55d7583f`

The 3.3.0 square marks visibly contradicted the selected diamond style. Apply
the selected dot style and ink to timing and metadata modules. Give alignment
targets continuous rings using the finder frame, center, and colors. Balance
mixed frame and center proportions and strengthen horizontal capsules where
needed. Preserve the encoded matrix, quiet zone, and logo exclusion rules.

Uniform square marks were the prior scanner safeguard. A smaller square center
was tried during the style correction and added two decoding failures. The
remaining dense horizontal case was resolved before release by strengthening
horizontal strokes for modules smaller than six pixels.

See the [release plan](../plans/0001-CoolQR-3.3.1-Release/Plan.md) for the held
pass, alternatives tested, successful decoder sweep, and evidence limits.
