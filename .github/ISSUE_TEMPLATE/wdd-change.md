---
name: WDD change
about: Track a Wiki-Driven Development change before product wiki truth changes
title: "[WDD] "
labels: ["wdd"]
assignees: ""
---

## Intent

What product behavior, policy, or screen should change?

## Target Product Wiki Nodes

- `pages/...`
- `actions/...`
- `qa/...`

## Proposed Wiki Patch

Describe the exact product wiki changes the implementation branch should apply first. Include replacement wording or new sections when useful.

## Likely Code Targets

- `<appRoot>/src/...`
- `<appRoot>/tests/...`

## Verification Plan

- [ ] Product wiki patch applied first
- [ ] Impacted wiki nodes updated
- [ ] Referenced code updated
- [ ] Declared tests pass
- [ ] Page screenshots refreshed when page nodes are reflected or verified
- [ ] `wdd ready` passes

## Legacy Migration Coverage

Use this section only for `normal/legacy-migration` work. Delete it for other work types.

### Node Projection Matrix

| Signal found in code or UI | Evidence | Required wiki node type | Owning wiki node | Status |
|---|---|---|---|---|
| route/screen/modal |  | screen |  | missing/covered/deferred |
| redirect/navigation/auth handoff |  | flow |  | missing/covered/deferred |
| mutation/write side effect |  | action |  | missing/covered/deferred |
| API response/form shape/validation object |  | 앱객체 (`model`) |  | missing/covered/deferred |
| persisted domain object/table/storage-backed record |  | DB테이블 (`entity`) |  | missing/covered/deferred |
| business rule/guard/eligibility |  | policy |  | missing/covered/deferred |
| branch/loading/error/empty state |  | qa |  | missing/covered/deferred |
| analytics/attribution/external integration |  | action/policy/qa |  | missing/covered/deferred |
| static image/font/media/CDN asset |  | screen/design assets |  | missing/covered/deferred |
| reusable visual state/token |  | design |  | missing/covered/deferred |

### Branch Coverage Matrix

| Branch/state | Evidence | Owning wiki node | Hidden side effects | Status |
|---|---|---|---|---|
|  |  |  | API/events/storage/guards | observed/specified/deferred |

Unresolved gaps:

-

Follow-up issues:

-

Legacy wiki node status:

- [ ] Observed/spec/frozen nodes use `legacy.status`.
- [ ] Observed/spec/frozen nodes do not claim `code: reflected`, `verification: passed`, or `phase: verified`.
- [ ] Observed/spec/frozen nodes keep `implemented_by` empty.
- [ ] Legacy file provenance is recorded in `legacy-map.json` or this issue, not in product wiki metadata.
- [ ] Legacy API files are covered by `action` nodes.
- [ ] Legacy DB/repository/migration files are covered by DB테이블 (`entity`) nodes.
- [ ] Actions that read/write persisted data depend on the relevant DB테이블 (`entity`) and 앱객체 (`model`) nodes.

## Dependencies

List blocking issues or PRs, or write `None`.
