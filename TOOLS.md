# TOOLS.md - Local Notes

Skills define _how_ tools work. This file is for _your_ specifics — the stuff that's unique to your setup.

## What Goes Here

Things like:

- Camera names and locations
- SSH hosts and aliases
- Preferred voices for TTS
- Speaker/room names
- Device nicknames
- Anything environment-specific

## gog (Google Workspace CLI)

- Account: elektrosmind@gmail.com
- Keyring: file-based (not macOS Keychain — Keychain hangs without GUI auth)
- **Must set env before running:** `export GOG_KEYRING_PASSWORD=$(cat ~/.config/gog/keyring_pass)`
- Services: gmail, calendar, drive, contacts, docs, sheets
- Default account: `GOG_ACCOUNT=elektrosmind@gmail.com`

## Why Separate?

Skills are shared. Your setup is yours. Keeping them apart means you can update skills without losing your notes, and share skills without leaking your infrastructure.

## grizzly (Bear Notes CLI)

- Token file: `~/.config/grizzly/token`
- Config: `~/.config/grizzly/config.toml`
- **No custom callback_url** — let grizzly auto-pick a free port
- Use `--no-callback` for writes (create, append, trash) to avoid phantom Safari tabs
- Only use `--enable-callback --json` when you need data back (read, search, list tags)
- Always pass `--token-file ~/.config/grizzly/token` for token-requiring ops (tags, add-text)
- Always pass `--force` for trash to skip confirmation prompts

## Shell Environment

- **Shell:** zsh (macOS default since Catalina, actively maintained)
- **Config:** `~/.zshrc` sources `~/.openclaw/.env` on startup — all API keys and tokens available automatically
- **Keyring password file:** `~/.config/gog/keyring_pass` (for gog CLI)

---

Add whatever helps you do your job. This is your cheat sheet.
