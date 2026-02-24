# Configuration Changes — Change Log

**Last updated:** 2026-02-23

---

## 2026-02-23 — Cron Schedule Staggering

Staggered overlapping Sunday morning cron jobs to prevent resource collisions:
- **Weekly update check:** 6:00 AM ET → **6:15 AM ET** (15 min delay)
- **Daily OpenClaw check:** Unchanged at 6:00 AM ET

Reason: Prevents Homebrew lock contention and I/O thrashing when both jobs run simultaneously.

---

**Previous:** 2026-02-22 (integrated setup-history.md)

This file tracks significant configuration changes with dates and context.

---

## 2026-02-22 — Memory System Restructure

Restructured MEMORY.md into topic-based files:
- Created `memory/` directory with separate files by topic
- Moved operational state to `reference/` subdirectory
- Archived daily notes to `archive/daily/`
- Original MEMORY.md preserved as `MEMORY.md.legacy`

---

## 2026-02-22 — Browser Relay Port Fix

**Issue:** Chrome Extension defaults to port 18792, but Gateway runs on 18789
**Fix:** Set extension Options page Port to **18789** (matching `gateway.listen.port`)
**Note:** Token must match `OPENCLAW_GATEWAY_TOKEN` from `.env` exactly

---

## 2026-02-19 — Model Migration to OpenRouter

Migrated from Anthropic to OpenRouter as primary provider.

**New primary model:** `openrouter/moonshotai/kimi-k2.5` (alias: `kimi`)
- Cost: $0.23/$3 per million
- Context: 256K tokens
- Vision: Yes

**Fallbacks added:**
- `openrouter/google/gemini-3-flash-preview` (alias: `gemini-flash`)
  - Cost: $0.50/$3 per million
  - Context: 1M tokens
  - Vision + media support
- `openrouter/minimax/minimax-m2-5` (alias: `minimax`)
  - Cost: $0.30/$1.10 per million
  - Context: 196K tokens
  - No vision

**Image model:** Changed to `openrouter/google/gemini-3-flash-preview`
**Default thinking:** Changed from `minimal` to `low`

---

## 2026-02-19 — Cursor Setup

Signed up for Cursor using Google account (elektrosmind@gmail.com).

---

## 2026-02-19 — OpenAI Account Created

Created OpenAI account with Google OAuth (elektrosmind@gmail.com) for Codex CLI access.

---

## 2026-02-18 — OpenClaw Update: 2026.2.15 → 2026.2.17

**Key new features:**
- 1M context (opt-in)
- Sonnet 4.6 support
- iOS share extension
- Telegram inline button styles
- Slack streaming
- Cron webhooks
- Subagents `/subagents spawn`

**Config changes:**
- Enabled 1M context for Sonnet and Opus
- Updated subagents and imageModel to Sonnet 4.6

**Forward-compat lesson:**
- First attempt failed with "Unknown model: anthropic/claude-sonnet-4-6"
- Root cause: Nulled out Sonnet 4.5 from registry
- Fix: Keep `anthropic/claude-sonnet-4-5` as template (no alias)
- Primary set to `anthropic/claude-sonnet-4-6` with alias "sonnet"

---

## 2026-02-12 — All Integrations Operational

All core integrations confirmed working:
- Telegram, GitHub, X, Apple (Reminders/Calendar/Notes)
- Obsidian, Bear Notes, Browser, Google Workspace
- Memory Search (local embeddings)
- All macOS permissions granted

---

## 2026-02-17 — Package Updates + Automated Maintenance

- Updated OpenClaw 2026.2.9 → 2026.2.15
- Updated npm 11.9 → 11.10
- Updated Homebrew packages: gogcli 0.9→0.11, summarize 0.10→0.11.1, ffmpeg, uv, libvpx, libuv, llhttp, pybind11
- Set up weekly automated update check (cron job, Monday 9 AM ET, Telegram delivery)
- Created maintenance playbook (`maintenance/weekly-updates-playbook.md`)
- Reorganized workspace: created `reference/` for detailed docs, slimmed MEMORY.md

---

## 2026-02-12 — All Integrations Operational

All core integrations confirmed working:
- Telegram, GitHub, X, Apple (Reminders/Calendar/Notes)
- Obsidian, Bear Notes, Browser, Google Workspace
- Memory Search (local embeddings)
- All macOS permissions granted

**Skills audit:**
- **Operational:** All core skills (github, gog, himalaya, apple-notes, apple-reminders, obsidian, peekaboo, bear-notes, summarize, weather, openai-whisper, video-frames, nano-pdf, healthcheck, skill-creator)
- **Not installed:** sag (ElevenLabs TTS)
- **Not configured:** blogwatcher (no feeds)

---

## 2026-02-12 — Permissions, Bear Notes

- All macOS permissions fixed (Full Disk Access, Automation, Screen Recording, Accessibility)
- Node pinned via Homebrew (`brew pin node`)
- Bear Notes set up — Bear app + grizzly CLI + API token

---

## 2026-02-11 — Google Workspace + Memory Search

- gog OAuth fixed — re-ran `gog auth login --force`
- All gog services verified: gmail, calendar, contacts, docs, drive, sheets
- Memory search (embeddings) confirmed working — local provider, no API key needed

---

## 2026-02-10 — Google Workspace (partial)

- gog OAuth setup started — credentials registered in Google Cloud (project: elektro-487017)
- Auth flow incomplete (fixed next day)

---

## 2026-02-09 — Initial Setup

- OpenClaw installed and updated to 2026.2.9
- Telegram bot connected (@ElektrosMindBot)
- GitHub connected via elektrosmind account
- Apple Reminders, Calendar, Notes connected (via Automation permissions)
- Obsidian connected (CLI v0.2.3, vault at ~/Documents/Obsidian Vault)
- Browser set up — Chrome relay extension, Playwright + Chromium installed, managed browser enabled

---

*Add dated entries for significant configuration changes. Include what changed and why.*
