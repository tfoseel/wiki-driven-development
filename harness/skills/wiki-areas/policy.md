# Policy Nodes

## When to use

Use this for cross-cutting business rules, limits, eligibility, permissions, and operational constraints.

## Authoring contract

- State the rule in plain product language.
- Define boundary cases and exceptions.
- Link actions, screens, flows, entities, and QA affected by the policy.
- Include examples that catch off-by-one or timezone mistakes.
- Mark `code: not_required` only when the policy is explanatory and has no implementation surface.

## Evidence

Policy changes need tests at the boundary and QA scenarios for visible enforcement.
