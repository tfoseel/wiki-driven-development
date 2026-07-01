# Wiki Node Contract

## Contract

Product wiki nodes are the human-readable SSOT. They describe product meaning, not work logs or legacy provenance.

## Reader-Facing Node Names

- DB테이블 (`entity`): persisted product fact, table, repository, migration, lifecycle, retention.
- 앱객체 (`model`): request, response, DTO, form shape, validation, derived fields, or view object.
- 액션 (`action`): mutation, API contract, server action, route handler, job, external write.
- 화면 (`screen`): route-backed UI state and user controls.
- 흐름 (`flow`): bounded journey and handoff between screens/actions.
- QA (`qa`): executable scenarios, edge cases, seeds, expected evidence.
- 정책 (`policy`): guard, eligibility, permission, business rule, operational constraint.
- 디자인 (`design`): product UI tokens, visual states, accessibility and component rules.
- 용어 (`term`): glossary and stable product knowledge.
- 홈 (`root`): navigation and product framing.

Internal `type` values stay English for machine stability. Reader-facing folders and labels should use the Korean names above.

## Ownership rules

- A screen can trigger an action, but it does not own API, DB, DTO, policy, or QA truth.
- API behavior belongs in 액션 (`action`) nodes.
- DB and persistence behavior belong in DB테이블 (`entity`) nodes.
- Request/response/payload/form shape belongs in 앱객체 (`model`) nodes.
- Branches and edge cases belong in QA (`qa`) nodes.
- Cross-cutting rules belong in 정책 (`policy`) nodes.

## Metadata

- Keep WDD metadata hidden in `<!-- wdd ... -->`.
- Use block YAML lists for paths with brackets such as `app/items/[id]/page.tsx`.
- `implemented_by` means wiki-derived implementation exists.
- `verified_by`, `verify`, `screenshots`, `artifacts`, and `assets` must point to durable evidence or ownership.
