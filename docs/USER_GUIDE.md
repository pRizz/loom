<!--
 Copyright (c) 2025 Geoffrey Huntley <ghuntley@ghuntley.com>. All rights reserved.
 SPDX-License-Identifier: Proprietary
-->

# Loom User Guide

Quick navigation hub for Loom users, operators, admins, and integrators.

## Start Here

- Docs hub: `/docs`
- Master documentation index: `/Users/peterryszkiewicz/Repos/loom/docs/MASTER_DOCUMENTATION.md`
- Getting started tutorial: `/docs/tutorials/getting-started`
- CLI reference (generated): `/docs/reference/cli`
- Public surface matrix: `/docs/reference/public-surface-matrix`

## Common Workflows

- Thread lifecycle: `/docs/tutorials/first-thread`
- Team collaboration and sharing: `/docs/tutorials/team-collaboration`
- Remote execution (Weaver): `/docs/tutorials/weaver-remote-execution`
- Incident response (crash/crons/sessions): `/docs/tutorials/observability-incident-response`
- Repos and clips: `/docs/tutorials/repo-and-clips-workflow`

## Configuration And Operations

- Authentication setup: `/docs/how-to/configure-auth`
- Server setup: `/docs/how-to/configure-server`
- SCIM provisioning: `/docs/how-to/configure-scim`
- WhatsApp integration: `/docs/how-to/configure-whatsapp`
- WireGuard + SSH: `/docs/how-to/use-wireguard-ssh`
- Org/team/API-key administration: `/docs/how-to/manage-orgs-teams-api-keys`
- Failure diagnosis: `/docs/how-to/troubleshoot-common-failures`

## Reference Surfaces

- HTTP API routes (generated): `/docs/reference/http-api`
- Web UI routes (generated): `/docs/reference/web-ui`
- Configuration map: `/docs/reference/configuration`
- VS Code extension inventory (generated): `/docs/reference/vscode-extension`

## Feature Status And Scope

| Scope | Typical Surfaces | Status Guidance |
| --- | --- | --- |
| End-user | Threads, repos, clips, docs, core CLI commands | Mix of `stable` and `beta`; verify matrix labels before production rollout. |
| Operator | Weaver, tunnel, crash/crons/sessions | Primarily `beta`; operationally useful but still evolving. |
| Admin | `/api/admin/*`, org/team/key controls | `internal` or privileged; treat as controlled access surfaces. |
| Integrator | SCIM, webhook/ping, Git/optional-auth API families | Mix of `stable`, `beta`, and `experimental`; confirm auth scope and contracts. |
| Experimental/Internal | Proxy/bridge and selected advanced subsystems | Assume change risk; pin versions and monitor release notes. |

Canonical source for maturity/auth labels is the generated matrix page:

- `/docs/reference/public-surface-matrix`
