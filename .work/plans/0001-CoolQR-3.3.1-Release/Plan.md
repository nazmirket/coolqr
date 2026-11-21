# Plan

The sequence below is reconstructed from the 2026-10-20 release notes. The
original written schedule is unrecorded.

1. Correct the visible mismatch using the
   [styled function marks decision](../../decisions/0003-StyledFunctionMarks.md).
   Run the expanded decoder sweep. Hold npm and production while any image
   fails.
2. After authorization, isolate the failure around 320px and retest the
   neighboring sizes. Limit any geometry correction to the affected density.
3. Run root and demo verification, the 640-matrix comparison, and the
   [full rendering sweep](../../../docs/Verification.md#style-consistency-correction--unreleased-2026-10-20).
4. Verify the release archive and public entry point, publish the candidate,
   and confirm npm integrity and the release tag.
5. Build the release revision for the isolated canary. Compare real UI PNG
   downloads with library output, decode them exactly, and exercise desktop,
   mobile, and transparent-logo journeys. Restore the prior image and verify
   health, then restore and identify the tested candidate.
6. Promote that image to the existing service. Repeat the public site checks
   and retain the prior image and release directory for rollback.
