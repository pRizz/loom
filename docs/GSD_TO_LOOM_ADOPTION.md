<!--
 Copyright (c) 2025 Geoffrey Huntley <ghuntley@ghuntley.com>. All rights reserved.
 SPDX-License-Identifier: Proprietary
-->

# GSD to Loom Adoption Guide

Educational migration guide for teams used to GSD (`/gsd:*` workflows) who want to run similar
delivery loops in Loom.

## Who This Is For

- You already use GSD phase workflows (`new-project`, `discuss-phase`, `plan-phase`,
  `execute-phase`, `verify-work`).
- You want a practical Loom operating model without pretending every GSD command has a direct
  Loom equivalent.
- You are adopting Loom in an existing codebase (brownfield) and need a stable daily loop.

## Mental Model Shift

GSD and Loom both support disciplined build loops, but they optimize for different centers of
gravity.

| GSD center | Loom center | Practical implication |
| --- | --- | --- |
| Project artifacts in `.planning/*` | Persistent conversation threads | Keep planning/execution state in Loom threads and repo docs, not a dedicated planning directory. |
| Phase/milestone command system | General-purpose CLI + thread lifecycle | You define phase boundaries explicitly in prompts/checkpoints. |
| Built-in workflow orchestration commands | Composable commands (`loom`, `list`, `resume`, `search`, `share`) | You compose a repeatable operating pattern for your team. |
| Command-level workflow framing | Surface-based model (CLI + web + API + extension) | Use generated references to stay aligned with what actually exists. |

## Core Workflow Parallels

Core lifecycle mapping only (not exhaustive command parity).

| GSD workflow step | Intent | Loom equivalent pattern | Primary Loom commands |
| --- | --- | --- | --- |
| `/gsd:new-project` | Establish scope and initial implementation direction | Start a Loom thread with existing specs/requirements context; define scope and acceptance criteria at top of thread | `loom` |
| `/gsd:discuss-phase` | Lock preferences and constraints before planning | Add a thread checkpoint section for decisions, non-goals, constraints, and quality bar | `loom`, `loom search` |
| `/gsd:plan-phase` | Produce atomic implementation tasks | Ask Loom to produce an ordered, testable task plan in-thread (small, dependency-aware slices) | `loom`, `loom search` |
| `/gsd:execute-phase` | Implement plan and verify continuously | Execute tasks iteratively; run tests/checks between slices; keep progress notes in the same thread | `loom`, `loom resume` |
| `/gsd:verify-work` | Validate outcomes with UAT-style checks | Run explicit acceptance checklist in-thread; record pass/fail and follow-up fixes | `loom`, `loom resume`, `loom search` |
| `/gsd:quick` | Fast ad-hoc fix with guardrails | Start a focused Loom session for one bounded fix and verification loop | `loom`, `loom private` (if local-only) |
| `/gsd:progress`, `/gsd:resume-work`, `/gsd:pause-work` | Recover context and continue | Use thread inventory + resume + semantic search to continue work safely | `loom list`, `loom resume`, `loom search` |

## Explicit Gaps and Loom Alternatives

### Gap: no native phase/milestone command suite

Loom does not provide a first-class `/gsd:phase-*` command family.

Loom alternative:

- Use explicit phase headers/checkpoints inside a thread (`Phase 1`, `Phase 2`, `Exit criteria`).
- Keep milestone definitions in repo docs/specs and link them in thread prompts.
- Use short, atomic task lists and verify each before moving on.

### Gap: no `.planning/*` artifact automation contract

GSD generates structured planning artifacts by default; Loom does not enforce this file layout.

Loom alternative:

- Keep canonical requirements/spec documents in the repository.
- Use Loom threads as the operational log (plan, execution, verification notes).
- For handoffs, use thread sharing controls rather than relying on generated planning files.

### Gap: no built-in "wave executor" abstraction

Loom does not expose explicit wave scheduling commands.

Loom alternative:

- Ask Loom to identify independent vs dependent tasks before implementation.
- Execute independent work in separate focused sessions when needed.
- Reconcile results in a shared thread and run final integration checks.

## Brownfield Adoption Playbook

Use this when adopting Loom in an existing codebase.

1. Start a scoped implementation thread.

```bash
loom
```

2. In the opening prompt, include:
- problem statement
- relevant existing files/modules
- non-negotiable constraints
- acceptance criteria

3. Ask Loom to produce:
- an atomic task plan
- dependency ordering
- explicit validation commands per task

4. Execute the first slice; after each slice:
- run checks/tests
- record outcome in-thread
- decide next slice or rollback/fix

5. If you need to stop:

```bash
loom list
loom resume
```

6. Recover prior decisions quickly:

```bash
loom search "phase 2 constraints"
loom search "acceptance criteria"
```

7. Handoff/collaboration for synced threads:

```bash
loom share --visibility organization
loom share <thread-id> --support
```

## Daily Operating Loop (Repeatable)

1. Plan: define one bounded objective with explicit exit criteria.
2. Implement: execute one atomic slice at a time.
3. Verify: run tests/checks and acceptance checklist.
4. Persist context: keep rationale and outcomes in the thread.
5. Resume/share: continue later or hand off with visibility controls.

## Command Cheat Sheet (Core)

| Command | Use for |
| --- | --- |
| `loom` | Start a new working thread |
| `loom private` | Local-only sensitive session (non-shareable) |
| `loom list` | Discover available thread history |
| `loom resume` | Reopen last thread quickly |
| `loom resume <thread-id>` | Reopen an exact thread |
| `loom search "<query>"` | Recover prior decisions/context |
| `loom share --visibility organization` | Team-visible handoff |
| `loom share <thread-id> --support` | Add support-team visibility |
| `loom login` | Authenticate against Loom server |

## Where to Go Next

- `/docs/tutorials/getting-started`
- `/docs/tutorials/first-thread`
- `/docs/tutorials/team-collaboration`
- `/docs/how-to/troubleshoot-common-failures`
- `/docs/reference/cli`
- `/docs/reference/public-surface-matrix`
- `/Users/peterryszkiewicz/Repos/loom/docs/USER_GUIDE.md`
- `/Users/peterryszkiewicz/Repos/loom/docs/MASTER_DOCUMENTATION.md`

## Source References

- GSD repository:
  [https://github.com/gsd-build/get-shit-done](https://github.com/gsd-build/get-shit-done)
- GSD README:
  [https://raw.githubusercontent.com/gsd-build/get-shit-done/main/README.md](https://raw.githubusercontent.com/gsd-build/get-shit-done/main/README.md)
- GSD User Guide:
  [https://raw.githubusercontent.com/gsd-build/get-shit-done/main/docs/USER-GUIDE.md](https://raw.githubusercontent.com/gsd-build/get-shit-done/main/docs/USER-GUIDE.md)
