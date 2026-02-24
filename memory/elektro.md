# Elektro — Operational Reference

**Quick identity reference:** See `SOUL.md` for personality and `IDENTITY.md` for identity summary. This file contains operational details only.

_Last updated: 2026-02-23_

---

## Account Boundaries

**Important distinction:** The Mac mini has credentials and tokens for **Elektro's accounts only**. I cannot access Sachin's personal accounts.

| Whose Account | Email/Username | Access |
|---------------|----------------|--------|
| **Elektro (me)** | elektrosmind@gmail.com | ✅ Full access — OAuth tokens, API keys on Mac mini |
| **Sachin (human)** | elektroshuman@gmail.com | ❌ No access — these are your private accounts |

**What this means:** I can send emails *to* elektroshuman@gmail.com, but I cannot send emails *from* it. I operate through my own accounts (elektrosmind@gmail.com) for all service integrations.

## Accounts (Detailed) — Elektro's Accounts Only

### Primary Identity

**Google Account: elektrosmind@gmail.com**
- Primary identity for all services
- OAuth provider for GitHub and others
- Google Cloud project: elektro-487017

### Service Accounts

| Service | Account/Username | Details |
|---------|------------------|---------|
| **Google** | elektrosmind@gmail.com | Primary identity; OAuth configured |
| **GitHub** | elektrosmind | Signed up via Google OAuth |
| **Git** | SSH key (ed25519) | Linked to GitHub; key at `~/.ssh/id_ed25519` |
| **X/Twitter** | @ElektroTheBot | Bot presence |
| **OpenAI** | elektrosmind@gmail.com | Created 2026-02-19 for Codex CLI |
| **Cursor** | elektrosmind@gmail.com | Signed up 2026-02-19 |
| **Google Cloud** | elektro-487017 | Project ID for GCP services |

**Sachin's accounts** (elektrosmind@gmail.com, elektroshuman on GitHub) are documented in `memory/sachin.md` and `USER.md`. I have no credentials for these — they are separate from my operational accounts.

## Channels (Operational Details)

### Web Chat (Control UI / Dashboard)
- **Location:** Local OpenClaw Control UI
- **Use:** Primary setup interface, configuration, deep work sessions
- **Access:** Via browser at gateway host

### Telegram Bot
- **Username:** @ElektrosMindBot
- **Connected:** 2026-02-09
- **Use:** Quick messages, mobile access, notifications

## Service-Specific Operational Notes

### Google Workspace (gog CLI)
See `TOOLS.md` for detailed gog configuration and environment setup.

**Quick reference:**
- Account: elektrosmind@gmail.com
- Keyring: file-based (not macOS Keychain)
- Required env: `export GOG_KEYRING_PASSWORD=$(cat ~/.config/gog/keyring_pass)`
- Default account env: `GOG_ACCOUNT=elektrosmind@gmail.com`

### Bear Notes (grizzly CLI)
See `TOOLS.md` for detailed grizzly configuration.

**Quick reference:**
- Token file: `~/.config/grizzly/token`
- Config: `~/.config/grizzly/config.toml`
- For writes, use `--no-callback` to avoid phantom Safari tabs

### Git & GitHub
- SSH authentication configured
- Git uses SSH by default: `url.git@github.com:.insteadOf https://github.com/`
- Test with: `ssh -T git@github.com`

## System Context

### Hardware
- **Host:** Sachin's Mac mini
- **Architecture:** Apple Silicon (arm64)
- **OS:** macOS (latest)

### Shell Environment
- **Shell:** zsh (macOS default)
- **Config:** `~/.zshrc` sources `~/.openclaw/.env` automatically
- **API keys:** Available via environment (set in `.env`)

### Critical System Notes

**Node.js is pinned:** `brew pin node`
- macOS permissions are granted to a specific binary
- Upgrading node revokes ALL permissions
- If node must be upgraded, re-grant all permissions in System Settings → Privacy & Security

**Permissions granted to node binary:**
- Full Disk Access
- Automation (Apple Notes, Reminders, Calendar, Contacts, Mail, Music, System Events)
- Screen Recording (for Peekaboo)
- Accessibility (for Peekaboo UI automation)

See `memory/reference/systems-status.md` for full operational status of all integrations.

## Maintenance

### Weekly Tasks (Automated)
- Homebrew library updates (Sundays 6 AM ET)
- OpenClaw version check (daily 6 AM ET, silent if no update)

### Never Auto-Upgrade
- Node.js (permissions tied to binary)
- OpenClaw (requires approval + gateway restart)
- macOS (requires reboot)

## Where to Find Things

| Need to know... | Look in |
|-----------------|---------|
| How to behave, personality | `SOUL.md` |
| Identity summary, channels | `IDENTITY.md` |
| Who Sachin is | `USER.md` & `memory/sachin.md` |
| Tool configs, CLI flags | `TOOLS.md` |
| System status, integrations | `memory/reference/systems-status.md` |
| Current projects | `memory/projects.md` |
| Lessons learned | `memory/lessons.md` |
| Memory system guide | `memory/README.md` |
| Daily context | `memory/archive/daily/YYYY-MM-DD.md` |

---

*Update this when adding accounts, changing configurations, or when operational details change.*
