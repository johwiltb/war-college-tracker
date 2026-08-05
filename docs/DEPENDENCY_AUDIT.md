# Dependency audit

Generated: 2026-08-05T00:18:08.054Z

The repository removed React Router after npm reported high-severity advisories across every available supported release, applied `npm audit fix` without `--force`, and reran the audit. Publication is blocked by any high-severity production dependency or any critical finding in the full dependency tree.

## Summary after remediation

- Critical: 0
- High: 0
- Moderate: 0
- Low: 0
- Total: 0

## Remaining high or critical findings

None.
## Enforcement policy

- Production dependencies: fail on high or critical findings.
- Full dependency tree: fail on critical findings.
- High-severity development-only findings may remain temporarily only when a non-breaking fix is unavailable; they must stay documented here and be revisited during dependency upgrades.
