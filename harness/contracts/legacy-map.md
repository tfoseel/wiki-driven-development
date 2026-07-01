# Legacy Map Contract

## Contract

`legacy-map.json` is the migration provenance surface. Product wiki nodes stay focused on product truth.

## What belongs here

- Legacy file paths.
- File-level migration status.
- Evidence links used during observation and parity review.
- `coveredBy` wiki node ids.
- Known gaps and follow-up notes.

## What does not belong in product wiki

- `legacy_sources`
- `implementation_targets`
- `legacy.sources`
- `legacy.evidence`
- Lists of old files used during extraction

## Status rules

```txt
code-ssot -> observed -> specified -> spec-frozen -> blind-implemented -> parity-reviewed -> wiki-ssot -> retired
```

- `observed` needs concrete evidence.
- `specified` and later need `coveredBy` wiki nodes.
- `specified` and later cannot have unresolved gaps.
- WDD-owned files such as `wiki/**`, `harness/**`, `AGENTS.md`, and PR/issue templates are not legacy files.
