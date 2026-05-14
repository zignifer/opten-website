---
tags: [moc, project]
---

# Opten Website

Public site for the Opten Chrome extension. This note is the map of content for navigating the project from inside the Obsidian vault.

> [!info] Vault = repo
> The Obsidian vault root is the project repo (`c:\Projects\opten-website`). Every `.md` here is also a file in git — write notes as you would code.

## Core docs

- [[docs/INTEGRATION-CONTRACT]] — **binding interface with the Chrome extension** (read before touching billing/auth/routes)
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

### GEO milestone — AI-search optimization

GEO score 12/100 → target ~30 after Phase 1. One milestone, 5 phases.

- **Phase 1 — Static foundations** (ready to execute):
  - [[.planning/phases/01-static-geo-foundations/1-SPEC|1-SPEC]] — what & why (8 falsifiable requirements)
  - [[.planning/phases/01-static-geo-foundations/1-PLAN|1-PLAN]] — 8 atomic tasks with commits
- **Phases 2–5** (backlog — see [[.planning/ROADMAP|ROADMAP]]):
  - Phase 2 — Per-route prerender + metadata
  - Phase 3 — Bilingual routing (`/ru/*` `/en/*` + hreflang)
  - Phase 4 — Content surface (`/about`, `/guides/*`, FAQ schema)
  - Phase 5 — Brand authority (Product Hunt, Wikipedia, Reddit, YouTube, sameAs)

## Project instructions

- [[CLAUDE]] — instructions for Claude Code (this file is read by the agent at session start)
- [[AGENTS]] — mirror of CLAUDE.md for other agents
- [[guidelines/Guidelines]] — Figma-Make output guidelines

## Design references

- `opten-design/` — landing screenshots, logo, covers (open in Obsidian image preview)
- `WebsiteMotion/` — motion design references

## Workflow

- **Planning:** GSD — slash commands `/gsd-plan-phase`, `/gsd-execute-phase`, `/gsd-verify-work` etc. Live state in `.planning/`.
- **Knowledge layer:** Obsidian wikilinks (`[[note]]`) and frontmatter tags. The vault root = repo root, so every planning artifact appears in graph view automatically.
- **Caution:** any change touching billing flows, `/welcome`/`/pay`/`/success` routes, Supabase constants, or extension messaging — read [[docs/INTEGRATION-CONTRACT]] first. Locked decisions in [[.planning/PROJECT|PROJECT]] mirror this contract.
