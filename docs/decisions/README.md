# Architecture Decision Records

Short notes capturing *why* non-obvious choices were made. Each ADR is one file: `NN-slug.md`.

Write an ADR when a decision:
- spans multiple files,
- would surprise a future reader,
- has a clear "we considered X, picked Y, because Z".

Skip an ADR when:
- the code already explains itself,
- it's a one-off fix with no architectural weight,
- the rationale is already in `CLAUDE.md` or `docs/INTEGRATION-CONTRACT.md`.

## Template

```markdown
# NN. Title

**Date:** YYYY-MM-DD
**Status:** accepted | superseded by NN | deprecated

## Context
What forced this decision. Constraints, prior attempts.

## Decision
What we picked.

## Alternatives
What we rejected and why.

## Consequences
What this makes easier / harder going forward.
```
