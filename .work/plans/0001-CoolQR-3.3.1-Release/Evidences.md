# Evidences

Recorded on 2026-10-20. The starting release was 3.3.0 at
`06b29471d55f72081a2f25a0c781c8436fdf3bdb`. The first correction is recorded
at `e470f91` and the final release at
`48c4772a13085fd604b459fb564f313e55d7583f`.
The user's screenshot exposed square function marks in a diamond-style QR.
The retained specimen below reproduces that design on the corrected renderer.
The original screenshot path is unrecorded.

[Corrected native canvases](../../../docs/images/rendering-review/style-consistency.png) reproduce
`https://example.com/portfolio` with the Indigo colors, circular frames and centers,
and individual/connected diamond dots. Inspected in Chrome at 1200px viewport and
2× device scale. Both actual demo PNG downloads decoded to the exact payload using
zbar; desktop and 390px mobile checks found no overflow or browser exceptions.

Root verification passes 18 tests and public type checks. The independent encoder
comparison still matches 640 matrices. Demo verification passes. Regression tests
cover styled metadata, the screenshot's alignment target, and multiple alignment
targets in higher versions.

The expanded browser sweep is **not green**: 1,619 of 1,620 images decoded with jsQR
or zbar (393 needed zbar), and 60 pixel-integrity cases passed. The remaining failure
uses a dense URL at 320px, connected horizontal dots, circular frames and square
centers. [Exact result and reproduction options](../../../docs/images/rendering-review/style-decoder-results.json)
are retained. A smaller square-center experiment added two failures and was reverted.
This is a demonstrated scan limitation, not proof of universal scanner compatibility.
Physical cameras, printing, Safari and Firefox remain untested.
