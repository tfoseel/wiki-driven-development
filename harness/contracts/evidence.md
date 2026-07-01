# Evidence Contract

## Contract

Evidence proves wiki truth. It should be durable, owned by a wiki node, and readable in GitHub Markdown.

## Wiki evidence

- Store committed screen evidence beside the owning node:
  - `wiki/화면/example.md`
  - `wiki/화면/example/스크린샷.png`
  - `wiki/화면/example/목업.html`
- Store flow-tree captures beside the flow:
  - `wiki/흐름/example-flow.md`
  - `wiki/흐름/example-flow/화면트리.png`
- Do not create shared top-level evidence folders under `wiki/`.

## Product assets

Use `assets` metadata for product images, fonts, media, icon packs, CDN assets, or generated assets used by the product itself. This is separate from screenshots and mockups.

## Legacy observation evidence

Raw observation captures stay in the GitHub Issue or temporary work artifacts until selected as durable wiki evidence. Once selected, copy only the durable artifact next to the owning wiki node.

## Verification

- Screen nodes with reflected code need route-backed screenshots.
- Flow nodes with passed verification need generated flow-tree captures.
- QA should refresh screenshots before regenerating flow-tree captures.
