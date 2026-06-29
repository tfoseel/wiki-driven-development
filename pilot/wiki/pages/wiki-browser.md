---
id: pages/wiki-browser
type: page
title: Wiki Browser
summary: Browse the pilot wiki pages that act as the single source of truth for the booking app.
depends_on:
  - ROOT
implemented_by:
  - pilot/app/src/app/wiki/[[...slug]]/page.tsx
  - pilot/app/src/screens/wiki-browser/screen.tsx
  - pilot/app/src/lib/wiki-browser.ts
  - pilot/app/src/app/page.tsx
  - pilot/app/src/app/layout.tsx
  - pilot/app/src/app/globals.css
verified_by:
  - pilot/app/src/lib/wiki-browser.test.ts
  - pilot/app/tests/e2e/wiki-browser.spec.ts
artifacts:
  - pilot/app/src/screens/wiki-browser/screen.tsx
  - packages/wdd/package.json
  - pilot/app/package.json
  - package-lock.json
verify:
  - npm run test -w pilot-booking-app -- wiki-browser
  - npm run e2e -w pilot-booking-app -- wiki-browser
---
# Wiki Browser

## Description
Shows the pilot wiki inside the Next.js app so a planner can inspect the SSOT before looking at generated or agent-authored product code.

## Conditions
- `/wiki` opens the pilot root node.
- `/wiki/<node-id>` opens a specific wiki node, including nested ids such as `/wiki/actions/cancel-booking`.
- The screen lists all wiki nodes with type, summary, implementation references, and verification references.
- Wiki links written as `[[node-id]]` navigate to the matching wiki page.

## User Actions
- Open the pilot wiki from the app home page.
- Select any node from the wiki index.
- Follow wiki links inside node body copy.

## Visible States And Exceptions

| Condition | Rendered State | Seed |
|---|---|---|
| Wiki root loaded | Root node body and full node index | seed-wiki-root |
| Nested node loaded | Node title, metadata, body, implementation and verification refs | seed-wiki-node |
| Unknown node id | Not found state | seed-wiki-not-found |

## Independent QA
- given `/wiki` / when page loads / then the Mini Booking Pilot root and node index are visible
- given `/wiki/actions/cancel-booking` / when page loads / then action rules and code references are visible
- given a wiki link in the root page / when clicked / then the matching node page opens
