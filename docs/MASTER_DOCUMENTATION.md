<!--
 Copyright (c) 2025 Geoffrey Huntley <ghuntley@ghuntley.com>. All rights reserved.
 SPDX-License-Identifier: Proprietary
-->

# Loom Master Documentation Index

Single entry point for all Loom documentation and documentation-generation workflows.

## 1) Where Documentation Lives

### A. User-facing web documentation

Primary docs hub:

- `/docs`

Diátaxis sections:

- Tutorials: `/docs/tutorials`
- How-to: `/docs/how-to`
- Reference: `/docs/reference`
- Explanation: `/docs/explanation`

Adoption guides:

- GSD to Loom adoption (root canonical): `/Users/peterryszkiewicz/Repos/loom/docs/GSD_TO_LOOM_ADOPTION.md`
- Loom onboarding tutorial: `/docs/tutorials/getting-started`
- Thread workflow tutorial: `/docs/tutorials/first-thread`

Complete current page map (from `web/loom-web/static/docs-index.json`):

- Tutorials
- `/docs/tutorials/getting-started`
- `/docs/tutorials/first-thread`
- `/docs/tutorials/team-collaboration`
- `/docs/tutorials/weaver-remote-execution`
- `/docs/tutorials/observability-incident-response`
- `/docs/tutorials/repo-and-clips-workflow`
- How-to
- `/docs/how-to/configure-auth`
- `/docs/how-to/configure-server`
- `/docs/how-to/configure-scim`
- `/docs/how-to/configure-whatsapp`
- `/docs/how-to/use-wireguard-ssh`
- `/docs/how-to/manage-orgs-teams-api-keys`
- `/docs/how-to/troubleshoot-common-failures`
- Reference
- `/docs/reference/cli`
- `/docs/reference/http-api`
- `/docs/reference/web-ui`
- `/docs/reference/configuration`
- `/docs/reference/vscode-extension`
- `/docs/reference/public-surface-matrix`
- Explanation
- `/docs/explanation/architecture`
- `/docs/explanation/thread-and-sharing-model`
- `/docs/explanation/authz-and-identity-model`
- `/docs/explanation/weaver-and-tunnel-model`
- `/docs/explanation/observability-model`

High-value generated reference pages:

- Public surface matrix: `/docs/reference/public-surface-matrix`
- CLI reference: `/docs/reference/cli`
- HTTP API reference: `/docs/reference/http-api`
- Web UI reference: `/docs/reference/web-ui`
- VS Code extension reference: `/docs/reference/vscode-extension`
- Configuration reference: `/docs/reference/configuration`

### B. Repository-level navigation docs

- Quick guide: `/Users/peterryszkiewicz/Repos/loom/docs/USER_GUIDE.md`
- GSD migration guide: `/Users/peterryszkiewicz/Repos/loom/docs/GSD_TO_LOOM_ADOPTION.md`
- This master index: `/Users/peterryszkiewicz/Repos/loom/docs/MASTER_DOCUMENTATION.md`

### C. Specs (design-level documentation)

- Spec index: `/Users/peterryszkiewicz/Repos/loom/specs/README.md`
- Docs-system spec: `/Users/peterryszkiewicz/Repos/loom/specs/docs-system.md`

### D. Generated machine-readable docs inventories

Generated surface files (source of truth for data-driven reference pages):

- `/Users/peterryszkiewicz/Repos/loom/web/loom-web/src/lib/docs/generated/cli-surface.json`
- `/Users/peterryszkiewicz/Repos/loom/web/loom-web/src/lib/docs/generated/http-surface.json`
- `/Users/peterryszkiewicz/Repos/loom/web/loom-web/src/lib/docs/generated/web-surface.json`
- `/Users/peterryszkiewicz/Repos/loom/web/loom-web/src/lib/docs/generated/vscode-surface.json`
- `/Users/peterryszkiewicz/Repos/loom/web/loom-web/src/lib/docs/generated/surface-coverage.json`
- `/Users/peterryszkiewicz/Repos/loom/web/loom-web/src/lib/docs/generated/public-surface.json`

Search index export:

- `/Users/peterryszkiewicz/Repos/loom/web/loom-web/static/docs-index.json`

## 2) How To Generate Documentation Artifacts

Run from:

```bash
cd /Users/peterryszkiewicz/Repos/loom/web/loom-web
```

Generate public-surface inventories:

```bash
pnpm docs:surface
```

Check drift (fails on stale output or missing coverage mapping):

```bash
pnpm docs:surface:check
```

Generate docs search index:

```bash
pnpm docs:index
```

## 3) How To Validate Documentation In CI/Local

From repo root:

```bash
cd /Users/peterryszkiewicz/Repos/loom
make web-docs-check
```

This executes:

- `pnpm docs:surface:check` in `web/loom-web`

CI wiring:

- Workflow: `/Users/peterryszkiewicz/Repos/loom/.github/workflows/ci.yml`
- Job: `web-docs-check`

## 4) How To Preview Documentation Locally

Start web dev server:

```bash
cd /Users/peterryszkiewicz/Repos/loom/web/loom-web
pnpm dev
```

Then open:

- `/docs`
- `/docs/reference/public-surface-matrix`

Build-time docs export (search index generation included):

```bash
pnpm build
pnpm docs:index
```

## 5) How The Generated Docs Pipeline Works

Generator script:

- `/Users/peterryszkiewicz/Repos/loom/web/loom-web/scripts/export-public-surface.ts`

Extractor modules:

- `/Users/peterryszkiewicz/Repos/loom/web/loom-web/src/lib/docs/surface/extract-cli.ts`
- `/Users/peterryszkiewicz/Repos/loom/web/loom-web/src/lib/docs/surface/extract-http-routes.ts`
- `/Users/peterryszkiewicz/Repos/loom/web/loom-web/src/lib/docs/surface/extract-web-routes.ts`
- `/Users/peterryszkiewicz/Repos/loom/web/loom-web/src/lib/docs/surface/extract-vscode.ts`
- `/Users/peterryszkiewicz/Repos/loom/web/loom-web/src/lib/docs/surface/coverage-map.ts`

Search export script:

- `/Users/peterryszkiewicz/Repos/loom/web/loom-web/scripts/export-docs-index.ts`

## 6) Quick Command Reference

```bash
# Generate inventories
cd /Users/peterryszkiewicz/Repos/loom/web/loom-web && pnpm docs:surface

# Verify inventories are current
cd /Users/peterryszkiewicz/Repos/loom/web/loom-web && pnpm docs:surface:check

# Rebuild docs search index JSON
cd /Users/peterryszkiewicz/Repos/loom/web/loom-web && pnpm docs:index

# Root-level docs drift check (CI-equivalent)
cd /Users/peterryszkiewicz/Repos/loom && make web-docs-check
```

## 7) Ownership And Update Rule

If you add or change any public-facing CLI command, HTTP route, web page route, or VS Code command/setting:

1. Regenerate inventories with `pnpm docs:surface`.
2. Update docs pages if behavior/workflow changed.
3. Run `pnpm docs:surface:check` (or `make web-docs-check`).
4. Commit updated generated JSON and docs content together.

## 8) Documentation Maintenance Checklist

Use this checklist before merging any change that affects users, admins, operators, or integrators.

1. Public surface inventory
1. If CLI/API/web/extension surface changed, run `pnpm docs:surface`.
1. Confirm changed IDs are mapped in `web/loom-web/src/lib/docs/surface/coverage-map.ts`.
1. Run `pnpm docs:surface:check` and confirm success.
1. Workflow docs
1. Update relevant tutorials/how-to/explanation pages under `web/loom-web/src/routes/(docs)/docs/`.
1. Ensure changed behavior is reflected in reference pages (especially generated tables).
1. Navigation/search
1. Run `pnpm docs:index`.
1. Confirm `web/loom-web/static/docs-index.json` includes new/renamed pages.
1. Validate `/docs` navigation and sidebar links locally (`pnpm dev`).
1. CI parity
1. Run `make web-docs-check` from repo root.
1. If possible, run `pnpm check`, `pnpm test`, and `pnpm build` in `web/loom-web`.
1. Commit hygiene
1. Commit docs content and generated JSON together.
1. Do not ship documentation-only claims for behavior not present in code.
