---
name: cost
description: Track OpenRouter LLM usage costs with /cost command
user-invocable: true
command-dispatch: exec
command-exec: node ~/.openclaw/skills/cost/tools/cost-query.js
command-arg-mode: raw
metadata:
  {
    "openclaw":
      {
        "emoji": "💰",
      },
  }
---

# Cost Tracker

Track OpenRouter LLM usage costs with deterministic `/cost` command.

## Slash Command

Use `/cost <number> <M|H|D|W>` to query costs for a specific time period:

- `/cost 30 M` - past 30 minutes
- `/cost 24 H` - past 24 hours  
- `/cost 7 D` - past 7 days
- `/cost 1 W` - past week

Time units: M=minutes, H=hours, D=days, W=weeks

**Note:** This command runs deterministically (no AI involvement) for reliable, low-cost operation.

## How It Works

The cost tracker:
1. Parses OpenClaw session files for OpenRouter usage data (including `.jsonl.reset.*` backup files)
2. Calculates costs from token counts using **official OpenRouter pricing**
3. **Excludes OAuth-based Anthropic usage** (Claude Code) - API-billed Anthropic through OpenRouter is included
4. Stores data in `~/.openclaw/cost-log.jsonl`
5. Auto-trims entries older than 30 days
6. **Displays cache read/write tokens** separately (important for models like Kimi that use prompt caching heavily)

## Tools

### cost-capture

Updates the cost database from session files.

```bash
node ~/.openclaw/skills/cost/tools/cost-capture.js
```

Run this:
- After installing the skill
- Periodically to update with new usage
- When cost data seems stale

### cost-query

Queries costs for a time period. Used automatically by `/cost` command.

```bash
node ~/.openclaw/skills/cost/tools/cost-query.js "7 D"
```

## Setup

1. The skill is already enabled in `openclaw.json`
2. Run capture to populate the database:
   ```bash
   node ~/.openclaw/skills/cost/tools/cost-capture.js
   ```

## Data Retention

- Entries older than 30 days are auto-trimmed
- Cost data is only available from when you started using OpenRouter
- Anthropic/Claude Code costs are excluded (not API-billed)

## Cron (Optional)

Auto-update daily:

```json
{
  "jobs": [
    {
      "id": "cost-capture",
      "schedule": "0 2 * * *",
      "timezone": "America/New_York",
      "agent": "main",
      "prompt": "Run: node ~/.openclaw/skills/cost/tools/cost-capture.js"
    }
  ]
}
```
