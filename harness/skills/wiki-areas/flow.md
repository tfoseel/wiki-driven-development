# Flow Nodes

## When to use

Use this for a bounded user journey, not for the entire product graph.

## Authoring contract

- Start from one user goal and keep the tree small.
- Embed the generated flow-tree capture near the top.
- Keep Mermaid source in a collapsible section below the capture.
- Reference dependent screen screenshots through Mermaid `<img src='...'>`.
- Define handoff data and assertions between screens/actions.
- Link QA nodes that prove branches and edge cases.

## Evidence

Flow changes require E2E coverage and a refreshed generated flow-tree capture after screen screenshots are updated.
