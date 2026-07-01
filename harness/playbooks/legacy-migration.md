# Legacy Migration Playbook

## When to use

Use this when an existing code-SSOT slice must become wiki-SSOT without losing behavior.

## Flow

1. Create or accept a PRD-like GitHub Issue for one bounded slice.
2. Check repo-root `legacy-map.json`.
3. Observe the running app and inspect legacy code. This phase may look at legacy files.
4. Project every observed signal into WDD node types:
   - route, modal, visible state -> 화면 (`screen`)
   - navigation, redirect, auth handoff -> 흐름 (`flow`)
   - API, mutation, external write -> 액션 (`action`)
   - request, response, payload, form shape -> 앱객체 (`model`)
   - DB table, repository, migration, persisted object -> DB테이블 (`entity`)
   - guard, eligibility, permission, business rule -> 정책 (`policy`)
   - branch, loading, error, empty state -> QA (`qa`)
   - product asset or token -> 디자인 (`design`) or screen `assets`
5. Create or update product wiki nodes from templates. Product wiki gets product meaning only; legacy file provenance stays in `legacy-map.json` and the issue.
6. Mark candidate nodes with `legacy.status` and pending `wdd_status`. Do not use `implemented_by` until wiki-derived code exists.
7. Freeze the wiki spec when all required projections are covered or explicitly deferred as linked follow-up issues.
8. Blind implement from the frozen wiki only. Do not read the legacy code for that slice.
9. Run parity review against legacy evidence.
10. Promote only the proven slice in `legacy-map.json`.

## Status path

```txt
code-ssot -> observed -> specified -> spec-frozen -> blind-implemented -> parity-reviewed -> wiki-ssot -> retired
```

## Hard boundaries

- A screen-only spec is not enough when API or DB behavior exists. API belongs in 액션 and DB persistence belongs in DB테이블.
- Legacy source lists do not belong in product wiki metadata.
- `implemented_by` means wiki-derived implementation exists.
- Unknown behavior is a gap, not a passed check.

## Done

- The slice can be implemented from wiki without reading legacy code.
- New implementation passes tests, screenshots, hidden behavior checks, and parity review.
- `legacy-map.json` records remaining code-SSOT gaps.
