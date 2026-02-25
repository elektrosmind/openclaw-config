# Systems Status — Operational State

**Last updated:** 2026-02-25

This is a living document tracking what's currently installed and working.

## Integrations — All Operational

| Service | Status | Notes |
|---------|--------|-------|
| Telegram | ✅ | @ElektrosMindBot |
| GitHub | ✅ | Connected via elektrosmind |
| X/Twitter | ✅ | @ElektroTheBot |
| Apple | ✅ | Reminders, Calendar, Notes |
| Obsidian | ✅ | Vault accessible |
| Bear Notes | ✅ | grizzly CLI configured |
| Browser | ✅ | Chrome relay + Playwright |
| Google Workspace | ✅ | gog CLI configured |
| Memory Search | ✅ | Local embeddings |
| Cursor | ✅ | Signed up 2026-02-19 |

## macOS Permissions

All granted and operational as of 2026-02-12. These are tied to the **node binary** at `/opt/homebrew/bin/node`.

### Granted Permissions

| Category | Items |
|----------|-------|
| **Full Disk Access** | `node` binary |
| **Automation** | Apple Notes, Apple Reminders, Apple Calendar, Apple Contacts, Apple Mail, Apple Music, System Events |
| **Screen Recording** | `node` (required for Peekaboo screen capture) |
| **Accessibility** | `node` (required for Peekaboo UI automation) |

### Critical: Node is Pinned

`brew pin node` prevents Homebrew from upgrading node automatically.

**Why:** macOS permissions are granted to a specific binary. If Homebrew upgrades node, the binary path/hash changes and ALL permissions above are revoked.

### Re-granting after a node upgrade

1. Open System Settings → Privacy & Security
2. Re-add the node binary for each permission category listed above
3. Restart the gateway: `openclaw gateway restart`

### Lessons

- After granting any macOS permission, the gateway must restart for the running process to pick it up
- The node binary must stay at `/opt/homebrew/bin/node` — don't change the installation method
- If node MUST be upgraded, plan for re-granting all permissions afterward

## Skill Status

| Skill | Status | Notes |
|-------|--------|-------|
| All core skills | ✅ | Operational |
| sag (ElevenLabs TTS) | ❌ | Not installed |
| blogwatcher | ⚠️ | No feeds configured |

## Service Details

### Memory Search
- **Provider:** local (no API key needed)
- **Model:** embeddinggemma-300M-GGUF (Q8_0, ~0.6GB, auto-downloaded by node-llama-cpp)
- **Vector acceleration:** sqlite-vec (native ARM64 dylib)
- **Search mode:** hybrid — 70% vector / 30% BM25 text
- **Store:** `~/.openclaw/memory/main.sqlite`
- **File watching:** enabled — auto-reindexes on changes to memory/*.md
- **Embedding cache:** enabled

### Google Workspace (gog)
- **Account:** elektrosmind@gmail.com
- **Google Cloud project:** elektro-487017
- **OAuth:** completed 2026-02-11 (re-ran `gog auth login --force`)
- **Services:** gmail, calendar, contacts, docs, drive, sheets — all verified working
- **Keyring:** file-based (not macOS Keychain — Keychain hangs without GUI auth)
- **Operational notes:** see `TOOLS.md` → gog section

### Bear Notes
- **App:** Bear, installed on Mac mini (2026-02-12)
- **CLI:** grizzly (`/opt/homebrew/bin/grizzly`)
- **API token:** `~/.config/grizzly/token`
- **Config:** `~/.config/grizzly/config.toml` (token_file + 5s timeout)
- **Verified ops:** create, read, search by tag, list tags, append text, trash
- **Operational notes:** see `TOOLS.md` → grizzly section

### Browser
- **Chrome relay:** extension installed, connects via toolbar icon
- **Playwright:** installed with Chromium
- **Managed browser:** enabled in OpenClaw config
- **Note:** Gateway restart clears Chrome relay connections — user must re-click extension icon

### Obsidian
- **CLI:** obsidian-cli v0.2.3
- **Vault:** `~/Documents/Obsidian Vault`

### OpenRouter (LLM Provider)
- **Status:** Active — primary provider for LLM access
- **Models:** Kimi K2.5 (primary), Gemini Flash, MiniMax (fallbacks)
- **API Key Location:** `~/.openclaw/.env` (OPENROUTER_API_KEY)
- **Account Ownership:** Subscription/billing managed under Sachin's elektroshuman@gmail.com
- **Usage:** Elektro uses this API key for all LLM operations; see `/cost` for usage tracking
- **Note:** While I use the API key for operations, the account ownership and billing remain under your personal email

### Apple Integrations
Connected via macOS Automation permissions:
- **Reminders:** via remindctl CLI
- **Calendar:** via Apple Calendar automation + gog (Google Calendar)
- **Notes:** via memo CLI
- **Contacts:** via Apple Contacts automation

### Telegram
- **Bot:** @ElektrosMindBot
- **Connected:** 2026-02-09

### GitHub
- **Account:** elektrosmind
- **CLI:** gh (Homebrew)
- **Connected:** 2026-02-09
- **Backup repo:** `elektrosmind/openclaw-config`
- **SSH authentication:** 2026-02-19
  - Key: `~/.ssh/id_ed25519` (ed25519)
  - Public key added to GitHub
  - Git configured to use SSH by default (`url.git@github.com:.insteadOf https://github.com/`)
  - Tested: `ssh -T git@github.com` ✓
- **Automated sync:** launchd job `ai.openclaw.git-sync` runs `~/.openclaw/git-sync.sh` daily at 06:35 local time
- **Sync logs:** `~/.openclaw/logs/git-sync.log`, `~/.openclaw/logs/git-sync.launchd.log`, `~/.openclaw/logs/git-sync.launchd.err.log`

## Gateway Status

- **Status:** Running on 127.0.0.1:18789
- **Chrome Relay:** Port 18789 (may need re-attachment after restart)
- **Security:** Loopback-only, local clients only

## Maintenance Schedule

| Task | Schedule | Channel | Notes |
|------|----------|---------|-------|
| Weekly update check | Sunday 6:15 AM ET | Telegram | Auto-upgrades Homebrew libs; see `maintenance/weekly-updates-playbook.md` |
| Daily OpenClaw check | Daily 6 AM ET | Telegram | Silent if no update |
| GitHub config sync | Daily 06:35 local | launchd | `~/.openclaw/git-sync.sh` commits/pushes curated config + memory changes |

### Scheduler Best Practices
- **Stagger jobs by at least 5 minutes** to avoid resource contention (locks, I/O, CPU)
- **Light jobs first, heavy jobs after** — quick checks complete cleanly, long tasks run without blocking
- **Document schedules** in this table and note interdependencies
- **Use launchd for macOS host tasks** that should run regardless of OpenClaw cron config

### Never Auto-Upgrade
- **Node** (pinned — permissions)
- **OpenClaw** (needs approval + gateway restart)
- **macOS** (requires reboot)

---

*Update this when adding/removing services or when operational status changes.*
