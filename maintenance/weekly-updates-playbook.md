# Weekly Update Check — Playbook

## Overview

Automated weekly check for package updates across all layers on Elektro's Mac mini.
Runs **Sunday 6:15 AM ET** via cron. Results delivered to **Telegram**.

## Package Tiers

### ✅ Auto-upgrade — Libraries & Infrastructure

Everything in `brew outdated --formula` **EXCEPT** packages listed in the two tiers below.

These are dependencies and low-level libraries with no direct CLI/API contract with our skills.
Examples: openssl, ffmpeg, zstd, sqlite, lz4, python, protobuf, icu4c, etc.

**After upgrading:** run `brew cleanup` to remove old versions.

### 🔶 Report Only — Skill CLIs (wait for user OK)

These have CLI interfaces that skills depend on. Updates could change flags, output format, or behavior.

| Brew Formula | Binary | Skill | Notes |
|--------------|--------|-------|-------|
| `himalaya` | `himalaya` | himalaya | Email CLI |
| `memo` | `memo` | apple-notes | Apple Notes |
| `obsidian-cli` | `obsidian-cli` | obsidian | Obsidian vaults |
| `peekaboo` | `peekaboo` | peekaboo | macOS UI automation |
| `remindctl` | `remindctl` | apple-reminders | Apple Reminders |
| `summarize` | `summarize` | summarize | Text/video summarization |
| `gogcli` | `gog` | gog | Google Workspace |
| `openai-whisper` | `whisper` | openai-whisper | Local speech-to-text |

**Action:** Report available update with version numbers. Do not upgrade without Sachin's approval.

> **Maintaining this list:** When a new skill CLI is added via Homebrew, add it here. Include both formula name and binary name.

### ⚠️ Report Only — Core (manual only)

| Package | Source | Why manual |
|---------|--------|------------|
| `node` | Homebrew (pinned) | Upgrading breaks ALL macOS permissions (FDA, Automation, Screen Recording, Accessibility). Requires re-granting each one. |
| `openclaw` | npm global | Restarts the gateway. May need config migration. |
| `npm` | npm global | Generally low risk but tied to node ecosystem. |
| macOS updates | `softwareupdate` | Require restart. Can break Homebrew, permissions, everything. |
| Homebrew casks (e.g. Obsidian) | `brew --cask` | App restarts, potential breaking changes. |

**Action:** Report what's available with version numbers and any relevant notes. Never auto-upgrade.

## Procedure

1. `brew update` — refresh the package index
2. `brew outdated --formula` — check Homebrew formula updates
3. `brew outdated --cask` — check Homebrew cask updates
4. `npm -g outdated` — check OpenClaw and npm
5. `softwareupdate -l` — check macOS updates
6. Categorize all outdated packages per tiers above
7. Auto-upgrade safe libraries: `brew upgrade <package1> <package2> ...`
8. `brew cleanup` after any upgrades
9. Format and deliver the Telegram summary

## Telegram Message Format

```
⚡ Weekly Update Check — Mon <date>

✅ Auto-upgraded: <comma-separated list with old→new, or "nothing to upgrade">

🔶 Needs your OK:
- <package> <old> → <new>
(or "Nothing pending")

⚠️ FYI (manual only):
- <node/openclaw/macOS/cask details with version info>
- Include note about permissions cost for node if applicable
(or "Everything current")

<one-line summary>
```

If there are **zero updates** across all categories:
```
⚡ Weekly Update Check — Mon <date>

✅ Everything up to date across all layers. Nothing to do.
```

## Error Handling

- If `brew update` fails: report the error, continue with stale index
- If `brew upgrade` fails for some packages: report which failed, continue with rest
- If `softwareupdate` hangs or errors: report it, don't block the rest
- If any step fails entirely: include the error in the Telegram summary

## Disabled/Unused Skills

The following skill CLIs are **not tracked** for updates (skill disabled or not installed):

| Formula | Binary | Skill Status | Reason |
|---------|--------|--------------|--------|
| `gemini-cli` | `gemini` | ⏸️ Disabled | Skill not enabled in OpenClaw |

## History

- 2026-02-17: Created. Covers Homebrew formulas, casks, npm globals, macOS updates.
- 2026-02-22: Fixed skill CLI list — removed `gemini-cli` (disabled), corrected binary names (`gog` not `gogcli`, `whisper` not `openai-whisper`), added table format with formula→binary mapping.
