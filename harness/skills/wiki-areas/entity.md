# Entity Nodes

## When to use

Use this for persistence contracts: tables, fields, constraints, lifecycle, RLS, and migrations.

## Authoring contract

- State what the entity represents in product language.
- List fields with type, meaning, and rules.
- Declare uniqueness, foreign keys, lifecycle states, and deletion behavior.
- Reference migrations or schema files in metadata.
- Link dependent models, actions, screens, policies, and QA nodes.

## Evidence

Entity changes are verified by schema tests, migrations, seed data, or E2E flows that prove persistence behavior.
