# 0004 — Pinned build inputs

- Date recorded: 2026-10-22
- Status: Accepted and deployed at the recorded revision
- Change revision: `5a134851ec18efe70d53c3f7093bc90389454dd1`

Independent delivery review found that the GitHub Action tags and Docker base
image tag could move. Pin `checkout` and `setup-node` v5 to reviewed commits
and pin both Docker stages to the same multi-platform Node 24 Alpine index
digest. The original digest is
`sha256:06d7adf3e0ef61a13f1d28682726366f97a15aa1888c934d3ecec86c33918b53`.
Update the pins in the workflow and Dockerfile when reviewing a new candidate.

The previous moving references allowed upstream changes without a repository
diff. The pins make upgrades explicit and keep the build and runtime on the
same reviewed image. Corepack continues to request pnpm 9.15.9. A separate
manager-artifact pin was conditional advice during the review.

See the [deployment and rollback evidence](../../docs/Verification.md#independent-review-and-deployment-pinning--2026-10-22).
