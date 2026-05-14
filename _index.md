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

## Project instructions

- [[CLAUDE]] — instructions for Claude Code (this file is read by the agent at session start)
- [[AGENTS]] — mirror of CLAUDE.md for other agents
- [[guidelines/Guidelines]] — Figma-Make output guidelines

## Design references

- `opten-design/` — landing screenshots, logo, covers (open in Obsidian image preview)
- `WebsiteMotion/` — motion design references

## Workflow

This project uses [Superpowers](https://github.com/obra/superpowers) for agentic workflow conventions. The Obsidian vault adds a knowledge layer on top — see [[CLAUDE]] §Workflow.
