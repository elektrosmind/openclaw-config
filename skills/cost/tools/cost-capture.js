#!/usr/bin/env node
/**
 * Cost Capture Tool - OpenRouter Only
 * Calculates costs from token counts (session cost field is often $0 for OpenRouter).
 * Excludes Anthropic OAuth usage (not API-billed).
 * 
 * Usage: node cost-capture.js
 */

const fs = require('fs');
const path = require('path');

const COST_LOG_PATH = path.join(process.env.HOME, '.openclaw', 'cost-log.jsonl');
const SESSIONS_DIR = path.join(process.env.HOME, '.openclaw', 'agents', 'main', 'sessions');
const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

// OpenRouter pricing (per million tokens) - from openclaw.json
const PRICING = {
  'moonshotai/kimi-k2.5': { input: 0.45, output: 2.20, cacheRead: 0.225, cacheWrite: 0 },
  'moonshotai/kimi-k2': { input: 0.45, output: 2.20, cacheRead: 0.225, cacheWrite: 0 },
  'moonshotai/kimi-k2-thinking': { input: 0.45, output: 2.20, cacheRead: 0.225, cacheWrite: 0 },
  'google/gemini-3-flash-preview': { input: 0.50, output: 3.00, cacheRead: 0.0375, cacheWrite: 0.0833 },
  'minimax/minimax-m2-5': { input: 0.3, output: 1.1, cacheRead: 0.15, cacheWrite: 0 },
  'anthropic/claude-opus-4-6': { input: 15.0, output: 75.0, cacheRead: 1.5, cacheWrite: 0 },
  'anthropic/claude-sonnet-4': { input: 3.0, output: 15.0, cacheRead: 0.3, cacheWrite: 0 },
  'deepseek/deepseek-r1': { input: 0.55, output: 2.19, cacheRead: 0, cacheWrite: 0 },
  'deepseek/deepseek-r1:free': { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
};

function calculateCost(model, usage) {
  // Strip openrouter/ prefix if present
  const cleanModel = model.replace(/^openrouter\//, '');
  const pricing = PRICING[cleanModel] || PRICING[model];
  
  if (!pricing) {
    // Default to Kimi K2.5 pricing (official OpenRouter rates as of 2025)
    console.error(`   ⚠️  Unknown model "${cleanModel}" - using default Kimi K2.5 pricing`);
    const inputCost = ((usage.input || 0) / 1000000) * 0.45;
    const outputCost = ((usage.output || 0) / 1000000) * 2.20;
    const cacheReadCost = ((usage.cacheRead || 0) / 1000000) * 0.225;
    return inputCost + outputCost + cacheReadCost;
  }
  
  const inputCost = ((usage.input || 0) / 1000000) * pricing.input;
  const outputCost = ((usage.output || 0) / 1000000) * pricing.output;
  const cacheReadCost = ((usage.cacheRead || 0) / 1000000) * pricing.cacheRead;
  const cacheWriteCost = ((usage.cacheWrite || 0) / 1000000) * pricing.cacheWrite;
  
  return inputCost + outputCost + cacheReadCost + cacheWriteCost;
}

function getSessionFiles() {
  if (!fs.existsSync(SESSIONS_DIR)) return [];
  return fs.readdirSync(SESSIONS_DIR)
    .filter(f => f.endsWith('.jsonl') || f.includes('.jsonl.reset.'))
    .map(f => path.join(SESSIONS_DIR, f));
}

function extractFromSessionFile(filePath) {
  const entries = [];
  
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n').filter(line => line.trim());
    
    for (const line of lines) {
      try {
        const record = JSON.parse(line);
        
        if (record.type === 'message' && record.message?.usage) {
          const usage = record.message.usage;
          const provider = record.message.provider || '';
          const model = record.message.model || 'unknown';
          const timestamp = record.timestamp || record.message.timestamp;
          
          // Skip Anthropic provider (OAuth-based, not API-billed through OpenRouter)
          if (provider === 'anthropic') continue;
          
          // Only process OpenRouter requests
          if (provider !== 'openrouter') continue;
          
          // Skip error/aborted requests with 0 tokens
          if ((usage.input || 0) === 0 && (usage.output || 0) === 0) continue;
          
          // ALWAYS calculate from tokens (don't trust cost field)
          const costUsd = calculateCost(model, {
            input: usage.input || 0,
            output: usage.output || 0,
            cacheRead: usage.cacheRead || 0,
            cacheWrite: usage.cacheWrite || 0,
          });
          
          entries.push({
            timestamp: timestamp,
            model: model,
            provider: 'openrouter',
            inputTokens: usage.input || 0,
            outputTokens: usage.output || 0,
            cacheReadTokens: usage.cacheRead || 0,
            cacheWriteTokens: usage.cacheWrite || 0,
            costUsd: costUsd
          });
        }
      } catch (e) {
        continue;
      }
    }
  } catch (e) {
    console.error(`   Error reading ${path.basename(filePath)}: ${e.message}`);
  }
  
  return entries;
}

function readExistingLog() {
  if (!fs.existsSync(COST_LOG_PATH)) return [];
  
  const content = fs.readFileSync(COST_LOG_PATH, 'utf8');
  const lines = content.split('\n').filter(line => line.trim());
  
  const entries = [];
  for (const line of lines) {
    try {
      const entry = JSON.parse(line);
      if (entry.timestamp && typeof entry.costUsd === 'number') {
        entries.push(entry);
      }
    } catch (e) {
      continue;
    }
  }
  
  return entries;
}

function mergeEntries(existing, newEntries) {
  const seen = new Set(existing.map(e => `${e.timestamp}-${e.model}-${e.inputTokens}-${e.outputTokens}`));
  
  const merged = [...existing];
  let addedCount = 0;
  
  for (const entry of newEntries) {
    const key = `${entry.timestamp}-${entry.model}-${entry.inputTokens}-${entry.outputTokens}`;
    if (!seen.has(key)) {
      merged.push(entry);
      seen.add(key);
      addedCount++;
    }
  }
  
  return { merged, addedCount };
}

function trimOldEntries(entries) {
  const cutoff = Date.now() - THIRTY_DAYS_MS;
  const originalCount = entries.length;
  
  const filtered = entries.filter(entry => {
    const entryTime = new Date(entry.timestamp).getTime();
    return entryTime >= cutoff;
  });
  
  return { filtered, removed: originalCount - filtered.length };
}

function writeCostLog(entries) {
  const dir = path.dirname(COST_LOG_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  entries.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  
  const lines = entries.map(e => JSON.stringify(e));
  fs.writeFileSync(COST_LOG_PATH, lines.join('\n') + '\n');
}

function main() {
  try {
    console.log('💰 OpenRouter Cost Capture');
    console.log('');
    
    const sessionFiles = getSessionFiles();
    console.log(`📂 ${sessionFiles.length} session files`);
    
    let allNewEntries = [];
    for (const file of sessionFiles) {
      const entries = extractFromSessionFile(file);
      if (entries.length > 0) {
        allNewEntries = allNewEntries.concat(entries);
      }
    }
    
    console.log(`   ${allNewEntries.length} OpenRouter records found`);
    
    const existingEntries = readExistingLog();
    const { merged, addedCount } = mergeEntries(existingEntries, allNewEntries);
    console.log(`   ${addedCount} new entries added (${merged.length} total)`);
    
    const { filtered, removed } = trimOldEntries(merged);
    if (removed > 0) {
      console.log(`   ${removed} old entries trimmed (>30 days)`);
    }
    
    writeCostLog(filtered);
    
    const totalCost = filtered.reduce((sum, e) => sum + e.costUsd, 0);
    const totalInput = filtered.reduce((sum, e) => sum + e.inputTokens, 0);
    const totalOutput = filtered.reduce((sum, e) => sum + e.outputTokens, 0);
    
    console.log('');
    console.log(`✅ Complete: $${totalCost.toFixed(2)} (${(totalInput/1000000).toFixed(2)}M in / ${(totalOutput/1000000).toFixed(2)}M out tokens)`);
    
    process.exit(0);
    
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }
}

main();
