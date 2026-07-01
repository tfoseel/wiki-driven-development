# Hotfix

## Meaning

A time-sensitive production fix where normal shaping may be shortened, but WDD reconciliation must follow.

## Cadence

- Work shaping: shortest safe issue. Record incident, user impact, target wiki nodes, and rollback or mitigation.
- Wiki truth: confirm whether truth changes. If yes, update wiki before or immediately after the emergency code path.
- Impact: focused, but record skipped impact checks as follow-up risk.
- Coding: minimal fix for the urgent failure.
- Verification: targeted first, then full affected verification as soon as possible.
- Ready/PR: link the hotfix issue, record skipped checks, and create follow-up issues for missing tests, wiki reconciliation, or harness gaps.

## Rule

Hotfix is not a bypass. It is a temporary compression of cadence with mandatory reconciliation.
