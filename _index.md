---
tags: [moc, project]
---

# Opten Website

Public site for the Opten Chrome extension. This note is the map of content for navigating the project from inside the Obsidian vault.

> [!info] Vault = repo
> The Obsidian vault root is the project repo (`c:\Projects\opten-website`). Every `.md` here is also a file in git — write notes as you would code.

## Core docs

- [[docs/INTEGRATION-CONTRACT]] — **binding interface with the Chrome extension** (read before touching billing/auth/routes)
- [[docs/CONTENT-AUTHORING]] — **GEO+SEO playbook for new pages, blog posts, images** (read before any content change)
- [[docs/TECH]] — stack snapshot
- [[docs/ARCHITECTURE]] — routes, billing flows, i18n
- [[docs/SEO-AUDIT]] — SEO baseline + gap analysis
- [[.planning/research/GEO-AUDIT|GEO-AUDIT]] — AI-citation / Generative Engine Optimization audit (companion to SEO-AUDIT)

## Planning workspace

The project uses **[GSD (Get Shit Done)](https://github.com/jasonkneen/get-shit-done)** for milestone + phase planning. Live planning state lives in `.planning/`:

- [[.planning/PROJECT|PROJECT]] — project context, locked decisions, milestones
- [[.planning/ROADMAP|ROADMAP]] — phase breakdown with status
- [[.planning/REQUIREMENTS|REQUIREMENTS]] — falsifiable requirements per milestone
- [[.planning/STATE|STATE]] — current phase / blockers / progress
- [[.planning/intel/SYNTHESIS|intel/SYNTHESIS]] — consolidated context from ingested docs

**Live tables** (Obsidian Bases — open in Obsidian to see auto-rendered views):
- [[.planning/Phases]] — every phase artifact across all milestones (table + filters by status)
- [[.planning/Milestones]] — milestone overview with audit reports + roadmaps

## Active work

### v1.0 (GEO Optimization) — CLOSED 2026-05-17

GEO score 12/100 → ~72.6 (target ~80+ after deploy bakes in). 7 phases shipped end-to-end; archive at [[.planning/milestones/v1.0-ROADMAP|v1.0-ROADMAP]] + [[.planning/milestones/v1.0-REQUIREMENTS|v1.0-REQUIREMENTS]].

A post-v1.0 hotfix series (2026-05-17..18) added the blog surface (`/blog`, `/blog/:slug`), retired `/guides/*` URLs, unified `<SiteHeader>` / `<SiteFooter>`, and synced docs. Tracked inline in [[.planning/STATE|STATE]] §"Post-v1.0 hotfix series" — not a formal GSD phase.

### Next milestone (v2) — TBD

No active milestone. Run `/gsd-new-milestone` to start v2 from the candidates listed in [[.planning/ROADMAP|ROADMAP]] (brand authority off-site work, scale-ready architecture refactor, or new direction).

## Project instructions

- [[CLAUDE]] — instructions for Claude Code (this file is read by the agent at session start)
- [[AGENTS]] — mirror of CLAUDE.md for other agents
- [[guidelines/Guidelines]] — Figma-Make output guidelines

## Auto-memory (Claude Code)

Project-scoped memory persisted across Claude Code sessions. Stored outside the repo in `%USERPROFILE%\.claude\projects\C--Projects-opten-website\memory\` and surfaced into the vault as `.claude-memory/` via NTFS junction (gitignored — local only).

- [[.claude-memory/MEMORY|.claude-memory/MEMORY]] — full index of saved memories, links to all entries

> [!info] Setup on a fresh machine
> The junction is local. To recreate it after a fresh clone, run in PowerShell:
> ```powershell
> $target = Join-Path $env:USERPROFILE '.claude\projects\C--Projects-opten-website\memory'
> New-Item -ItemType Junction -Path '.claude-memory' -Target $target
> ```

## Design references

- `opten-design/` — landing screenshots, logo, covers (open in Obsidian image preview)

## Workflow

- **Planning:** GSD — slash commands `/gsd-plan-phase`, `/gsd-execute-phase`, `/gsd-verify-work` etc. Live state in `.planning/`.
- **Knowledge layer:** Obsidian wikilinks (`[[note]]`) and frontmatter tags. The vault root = repo root, so every planning artifact appears in graph view automatically.
- **Caution:** any change touching billing flows, `/welcome`/`/pay`/`/success` routes, Supabase constants, or extension messaging — read [[docs/INTEGRATION-CONTRACT]] first. Locked decisions in [[.planning/PROJECT|PROJECT]] mirror this contract.
