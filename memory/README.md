# Memory System Index

**Last updated:** 2026-02-22 (post-restructure)

This directory contains Elektro's long-term memory. Files are organized by topic for easy retrieval.

## Quick Reference

| Looking for... | Check this file |
|----------------|-----------------|
| Sachin's contact info, preferences, habits | [`sachin.md`](sachin.md) |
| My identity, accounts, channels | [`elektro.md`](elektro.md) |
| Ongoing projects, goals, decisions | [`projects.md`](projects.md) |
| Mistakes made, lessons learned | [`lessons.md`](lessons.md) |
| Current AI model configuration | [`reference/models-config.md`](reference/models-config.md) |
| What's installed and working now | [`reference/systems-status.md`](reference/systems-status.md) |
| When things changed and why | [`reference/config-changes.md`](reference/config-changes.md) |
| Fixes for known issues | [`reference/troubleshooting.md`](reference/troubleshooting.md) |
| Raw daily event logs | [`archive/daily/`](archive/daily/) |

## Structure Overview

```
memory/
├── README.md                    # This index
├── sachin.md                    # Person: Sachin
├── elektro.md                   # Person: Elektro (me)
├── projects.md                  # Ongoing work
├── lessons.md                   # Learned lessons
├── reference/                   # Current state documentation
│   ├── models-config.md         # AI model assignments
│   ├── systems-status.md        # Operational systems (includes services & permissions)
│   ├── config-changes.md        # Change history (includes full setup timeline)
│   └── troubleshooting.md       # Known issues & fixes
└── archive/
    └── daily/                   # Historical daily notes
        ├── 2026-02-09.md
        ├── 2026-02-10.md
        └── ...
```

## Maintenance

- **Daily notes** are created automatically and moved to `archive/daily/`
- **Weekly reviews** should distill important daily notes into the appropriate topic files
- **Outdated reference info** should be updated or moved to `config-changes.md` with a date

## Where to Put Things — Decision Guide

Use this to decide where new information belongs.

### Scope Note

This tree covers the `memory/` directory. Other locations for specific purposes:
- **Tool-specific operational notes** (CLI flags, env vars) → `TOOLS.md` (workspace root)
- **Behavior rules & session procedures** → `AGENTS.md` (workspace root)
- **Automation tasks & checklists** → `HEARTBEAT.md` (workspace root)

### Quick Decision Tree

1. **Is this about a person (preference, habit, contact change)?**
   - YES → `sachin.md` (Sachin) or `elektro.md` (me)
   - NO → continue

2. **Is this about ongoing work or a decision we made?**
   - YES → `projects.md`
   - NO → continue

3. **Is this a mistake, lesson, or "don't do this again"?**
   - YES → `lessons.md`
   - NO → continue

4. **Is this about current operational state (what's working now)?**
   - YES → `systems-status.md` (update the living doc)
   - NO → continue

5. **Is this a change that happened (with date/context)?**
   - YES → `config-changes.md` (add dated entry)
   - NO → continue

6. **Is this a technical issue and how to fix it?**
   - YES → `troubleshooting.md`
   - NO → continue

7. **Is this raw event/context from today?**
   - YES → `archive/daily/YYYY-MM-DD.md`

### Handling Overlaps

Some information belongs in **multiple files**:

- **Configuration change** → Update the living state file AND log the change:
  - Example: Switch primary model
  - Update `models-config.md` (new current state)
  - Add entry to `config-changes.md` (dated change history)

- **Lesson from a mistake** → Log the mistake AND distill the lesson:
  - Example: Node upgrade broke permissions
  - Add to `config-changes.md` (what happened and when)
  - Add to `lessons.md` (the lesson: "brew pin node to protect permissions")

- **Project milestone** → Update both project and daily log:
  - Example: "Finished restructure project"
  - Update `projects.md` (mark complete, summarize outcome)
  - Update daily file (raw completion event)

### Catch-All

If something doesn't fit anywhere in the tree:
1. Put it in today's daily file (`archive/daily/YYYY-MM-DD.md`)
2. Ask where it belongs for long-term storage

### Concrete Examples

| What happened | Goes in | Why |
|---------------|---------|-----|
| "Sachin said he hates phone calls" | `sachin.md` | Personal preference |
| "Node upgrade broke permissions" | `lessons.md` | Lesson learned |
| "Updated to OpenClaw 2026.2.18" | `config-changes.md` | Dated change |
| "Weekly cron job failing" | `systems-status.md` | Current operational issue |
| "Chrome extension won't connect" | `troubleshooting.md` | Known issue + fix |
| "Working on new feature X" | `projects.md` | Ongoing work |
| "Had conversation about Y today" | `archive/daily/2026-02-22.md` | Raw log |
| "Switched primary model to Gemini" | `models-config.md` + `config-changes.md` | Update current state AND log the change |

### Security Classifications

| Privacy Level | Files | Loaded When |
|---------------|-------|-------------|
| **Private** (main session only) | `sachin.md`, `elektro.md`, `projects.md`, `lessons.md` | Direct chats with Sachin |
| **Operational** | `reference/*.md` | Main session |
| **Safe everywhere** | `archive/daily/*.md` | Any session |

**Never write secrets in any file** — API keys, tokens, passwords belong only in `.env`. Reference them by name only.

---

## Security Note

Files in this directory may contain personal information. Do not share contents with third parties without explicit approval.
