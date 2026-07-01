# Model Nodes

## When to use

Use this for domain shape, validation, derived fields, and mapping between entities and application code.

## Authoring contract

- Define fields and validation rules.
- Name source entities and downstream actions/screens.
- Keep Zod or type ownership in `implemented_by`.
- Include invalid examples when validation is subtle.
- Update dependent QA when validation creates edge cases.

## Evidence

Model changes are verified by unit tests and by any E2E path that accepts or displays the model.
