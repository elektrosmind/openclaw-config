#!/usr/bin/env node
/**
 * Cost Query Tool - OpenRouter Only
 * Queries the cost log for a specified time period.
 * 
 * Usage: node cost-query.js "<number> <M|H|D|W>"
 * Example: node cost-query.js "7 D"
 */

const fs = require('fs');
const path = require('path');

const COST_LOG_PATH = path.join(process.env.HOME, '.openclaw', 'cost-log.jsonl');
const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

/**
 * Parse time period argument
 * @param {string} arg - Format: "<number> <M|H|D|W>" or "/cost <number> <M|H|D|W>"
 * @returns {number} - Start timestamp (ms since epoch)
 */
function parseTimePeriod(arg) {
  if (!arg || typeof arg !== 'string') {
    throw new Error('Missing time period argument. Use format: "/cost 7 D" (7 days)');
  }

  // Strip leading "/cost" if present
  let cleaned = arg.trim();
  if (cleaned.startsWith('/cost')) {
    cleaned = cleaned.slice(5).trim();
  }

  // Normalize: handle "7D", "7 D", "7  D", etc.
  const normalized = cleaned.replace(/\s+/g, ' ');
  const match = normalized.match(/^(\d+)\s*([MHDW])$/i);
  
  if (!match) {
    throw new Error(`Invalid time format: "${arg}". Use format: "/cost 7 D" (7 days). Valid units: M=minutes, H=hours, D=days, W=weeks`);
  }

  const num = parseInt(match[1], 10);
  const unit = match[2].toUpperCase();

  if (num <= 0) {
    throw new Error('Number must be positive');
  }

  // Calculate duration in milliseconds
  const multipliers = {
    'M': 60 * 1000,        // minutes
    'H': 60 * 60 * 1000,   // hours
    'D': 24 * 60 * 60 * 1000,  // days
    'W': 7 * 24 * 60 * 60 * 1000  // weeks
  };

  const durationMs = num * multipliers[unit];
  const now = Date.now();
  
  // Warn if requesting more than 30 days (data may be trimmed)
  if (durationMs > THIRTY_DAYS_MS) {
    console.error(`⚠️  Warning: Requesting ${num}${unit} exceeds 30-day retention. Data may be incomplete.`);
  }

  return now - durationMs;
}

/**
 * Read and parse cost log
 * @returns {Array} - Array of cost entries
 */
function readCostLog() {
  if (!fs.existsSync(COST_LOG_PATH)) {
    return [];
  }

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
      // Skip invalid lines
      continue;
    }
  }
  
  return entries;
}

/**
 * Filter entries by time range
 * @param {Array} entries 
 * @param {number} startTime - Start timestamp (ms)
 * @returns {Array}
 */
function filterByTime(entries, startTime) {
  return entries.filter(entry => {
    const entryTime = new Date(entry.timestamp).getTime();
    return entryTime >= startTime;
  });
}

/**
 * Aggregate costs by model
 * @param {Array} entries 
 * @returns {Object}
 */
function aggregateByModel(entries) {
  const byModel = {};
  for (const entry of entries) {
    const model = entry.model || 'unknown';
    if (!byModel[model]) {
      byModel[model] = { cost: 0, requests: 0, inputTokens: 0, outputTokens: 0, cacheReadTokens: 0, cacheWriteTokens: 0 };
    }
    byModel[model].cost += entry.costUsd;
    byModel[model].requests += 1;
    byModel[model].inputTokens += entry.inputTokens || 0;
    byModel[model].outputTokens += entry.outputTokens || 0;
    byModel[model].cacheReadTokens += entry.cacheReadTokens || 0;
    byModel[model].cacheWriteTokens += entry.cacheWriteTokens || 0;
  }
  return byModel;
}

/**
 * Format currency
 * @param {number} amount 
 * @returns {string}
 */
function formatCurrency(amount) {
  if (amount < 0.01) {
    return `$${(amount * 100).toFixed(2)}¢`;
  }
  return `$${amount.toFixed(2)}`;
}

/**
 * Format number with commas
 * @param {number} num 
 * @returns {string}
 */
function formatNumber(num) {
  return num.toLocaleString();
}

/**
 * Main query function
 */
function main() {
  try {
    // Get argument from command line or environment
    const arg = process.argv[2] || process.env.COST_QUERY_ARG || '';
    
    // Parse time period
    const startTime = parseTimePeriod(arg);
    const startDate = new Date(startTime);
    
    // Read and filter entries
    const allEntries = readCostLog();
    const filteredEntries = filterByTime(allEntries, startTime);
    
    if (filteredEntries.length === 0) {
      console.log(`💰 No cost data found for the past ${arg.trim()}.`);
      console.log(`   Cost log: ${COST_LOG_PATH}`);
      console.log(`   Try running: node ~/.openclaw/skills/cost/tools/cost-capture.js`);
      process.exit(0);
    }
    
    // Calculate totals
    const totalCost = filteredEntries.reduce((sum, e) => sum + e.costUsd, 0);
    const totalRequests = filteredEntries.length;
    const totalInputTokens = filteredEntries.reduce((sum, e) => sum + (e.inputTokens || 0), 0);
    const totalOutputTokens = filteredEntries.reduce((sum, e) => sum + (e.outputTokens || 0), 0);
    const totalCacheReadTokens = filteredEntries.reduce((sum, e) => sum + (e.cacheReadTokens || 0), 0);
    const totalCacheWriteTokens = filteredEntries.reduce((sum, e) => sum + (e.cacheWriteTokens || 0), 0);
    
    // Aggregate by model
    const byModel = aggregateByModel(filteredEntries);
    
    // Build output
    const lines = [];
    lines.push(`💰 OpenRouter Cost: Past ${arg.trim()}`);
    lines.push(`   From: ${startDate.toLocaleString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit',
      timeZoneName: 'short'
    })}`);
    lines.push('');
    lines.push(`   Total: ${formatCurrency(totalCost)}`);
    lines.push(`   Requests: ${formatNumber(totalRequests)}`);
    lines.push(`   Tokens: ${formatNumber(totalInputTokens)} in / ${formatNumber(totalOutputTokens)} out`);
    if (totalCacheReadTokens > 0) {
      lines.push(`   Cache Read: ${formatNumber(totalCacheReadTokens)}`);
    }
    if (totalCacheWriteTokens > 0) {
      lines.push(`   Cache Write: ${formatNumber(totalCacheWriteTokens)}`);
    }
    lines.push('');
    
    // Per-model breakdown
    if (Object.keys(byModel).length > 0) {
      lines.push('   By Model:');
      const sortedModels = Object.entries(byModel)
        .sort((a, b) => b[1].cost - a[1].cost);
      
      for (const [model, data] of sortedModels) {
        const modelName = model.split('/').pop() || model;
        const pct = ((data.cost / totalCost) * 100).toFixed(1);
        lines.push(`      • ${modelName}: ${formatCurrency(data.cost)} (${pct}%, ${formatNumber(data.requests)} req)`);
      }
    }
    
    console.log(lines.join('\n'));
    process.exit(0);
    
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }
}

main();
