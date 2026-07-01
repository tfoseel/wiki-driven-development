# Action Nodes

## When to use

Use this for mutation/write API contracts: server actions, route handlers, jobs, or external write calls.

## Authoring contract

- State the user-visible intent of the action.
- Define input model, target entities, side effects, and return shape.
- List failure modes, idempotency, permissions, and transaction boundaries.
- Reference implementation and tests in metadata.
- Link screens and flows that trigger or observe the action.

## Evidence

Action changes need unit or integration tests plus E2E coverage for visible state changes.
