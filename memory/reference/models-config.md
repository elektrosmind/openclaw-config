# Models Configuration

**Last updated:** 2026-02-23

## Current Assignments

| Role | Model | Alias |
|------|-------|-------|
| **Primary** | `openrouter/moonshotai/kimi-k2.5` | `kimi` |
| **Fallback 1** | `openrouter/google/gemini-3-flash-preview` | `gemini-flash` |
| **Fallback 2** | `openrouter/minimax/minimax-m2-5` | `minimax` |
| **Image** | `openrouter/google/gemini-3-flash-preview` | (primary) |
| **Image Fallback** | `openrouter/moonshotai/kimi-k2.5` | |
| **Subagents** | `openrouter/moonshotai/kimi-k2.5` | |

## Model Specifications

### Kimi K2.5 (Primary)
- **Context:** 256K tokens
- **Input cost:** $0.23 per million tokens
- **Output cost:** $3 per million tokens
- **Vision:** Yes

### Gemini 3 Flash Preview (Fallback / Image)
- **Context:** 1M tokens
- **Input cost:** $0.50 per million tokens
- **Output cost:** $3 per million tokens
- **Vision:** Yes
- **Media:** Full support (audio, video via tools.media)

### MiniMax M2.5 (Fallback)
- **Context:** 196K tokens
- **Input cost:** $0.30 per million tokens
- **Output cost:** $1.10 per million tokens
- **Vision:** No

## Configuration Notes

- **Default thinking:** `low`
- **OpenClaw input restrictions:** Models only accept `["text"]` and/or `["image"]` in config
- **Media handling:** Audio/file/video processed via `tools.media`, not model `input` array

## Cost Calculation

Use `/cost` command to track OpenRouter usage. Pricing above can be used for estimates.

---

*Update when model assignments or pricing changes.*
