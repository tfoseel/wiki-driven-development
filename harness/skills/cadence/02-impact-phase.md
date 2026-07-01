# Impact Phase

## When to use

Use this after wiki edits and before coding.

## Agent prompt

Trace what the changed wiki nodes affect. If ownership metadata is missing, go back to the wiki edit phase before touching code.

## Steps

1. Run `wdd impact` for each changed node.
2. Run `wdd session` for the main node to get an agent-ready context pack.
3. List upstream dependencies, downstream nodes, code files, tests, screenshots, and flow-tree captures.
4. Check whether the wiki metadata names the files you need to edit.
5. If a code target is missing, update wiki metadata first.

## Done

- You have a concrete edit set for wiki nodes, code files, tests, and evidence artifacts.
- No code edit depends on unstated ownership.
