# Troubleshooting — Known Issues & Fixes

**Last updated:** 2026-02-25

## Current Issues

_No known issues currently._

---

## Resolved Issues

### Browser Relay Port Mismatch

**Date:** 2026-02-22  
**Status:** ✅ Resolved

**Symptom:** Chrome Extension shows "!" badge, won't connect

**Root Cause:** Extension defaults to port 18792, but Gateway runs on 18789

**Fix:**
1. Click extension icon → Options
2. Set Port to **18789** (matching `gateway.listen.port` in `openclaw.json`)
3. Ensure Token matches `OPENCLAW_GATEWAY_TOKEN` from `.env` exactly (no quotes)

---

### Cron Jobs Missing After Restart

**Date:** 2026-02-25  
**Status:** ✅ Resolved

**Symptom:** `openclaw cron list` shows no jobs, and daily update checks stop.

**Root Cause:** Cron store file `~/.openclaw/cron/jobs.json` was overwritten with an empty `jobs` array. On next gateway restart, scheduler loaded zero jobs.

**Fix:**
1. Verify scheduler state: `openclaw cron status`
2. Verify jobs: `openclaw cron list --json`
3. Re-add missing jobs (`daily-openclaw-update-check`, `weekly-update-check`)
4. Restart gateway: `openclaw gateway restart`
5. Re-check cron status/list to confirm jobs are loaded

---

## Common Fixes Reference

### Gateway Won't Pick Up New node_modules
- **Don't use:** SIGUSR1 restart
- **Use instead:** `openclaw gateway restart` (full restart)

### Chrome Relay Disconnects After Gateway Restart
- Gateway restart clears Chrome relay connections
- **Fix:** User must re-click extension icon to re-attach

### macOS Permissions Not Working
- After granting permissions in System Settings, gateway must restart
- **Fix:** `openclaw gateway restart`

### Screen Recording Filenames
- macOS screenshots contain narrow no-break space (U+202F)
- **Fix:** Use globs when scripting file operations

### Telegram Bot Token Issues
- Easy to confuse letter O with number 0
- **Fix:** Double-check tokens when troubleshooting auth failures

### Telegram "Access Not Configured" in DM
- Typical cause: `channels.telegram.dmPolicy` is set to `pairing` and sender is not yet approved
- **Check pending requests:** `openclaw pairing list telegram`
- **Approve code:** `openclaw pairing approve telegram <PAIRING_CODE>`
- **Verify allowlist:** `~/.openclaw/credentials/telegram-default-allowFrom.json`
- If needed, restart gateway: `openclaw gateway restart`

---

*Add new issues as they arise. Move resolved issues to the "Resolved" section.*
