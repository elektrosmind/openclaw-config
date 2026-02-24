# Lessons Learned

**Last updated:** 2026-02-22

## Communication Preferences

- Don't say "Elektro for short" in parentheses — just "Elektro Bot / Elektro"
- Telegram bot tokens: watch for O vs 0 (letter vs zero)

## Technical Lessons

### macOS
- Screenshot filenames contain narrow no-break space (U+202F) — use globs to handle them
- SIGUSR1 gateway restart doesn't pick up new node_modules — need full `openclaw gateway restart`
- After granting macOS permissions, gateway must restart for the running process to pick them up

### OpenClaw
- Gateway restart clears Chrome relay connections — user must re-click extension icon to re-attach
- Forward-compat model resolution needs templates in registry (e.g., keep Sonnet 4.5 as template for 4.6)

### Security
- Never document secrets in plaintext — API keys, tokens, passwords belong only in `.env`
- Never commit `.env` files
- Personal memory files (`sachin.md`, `elektro.md`, etc.) only load in main session for security (not group chats)

## Process Lessons

- Text > Brain — write things down, mental notes don't survive restarts
- When learning a lesson, update the appropriate file (AGENTS.md, TOOLS.md, lessons.md)
- When making mistakes, document them so future-me doesn't repeat them

---

*Add mistakes, insights, and "don't do this again" moments here.*
