#!/usr/bin/env node
/**
 * Lightweight Vitest profiling script
 * Measures wall-clock time for a vitest run and prints a small summary.
 * Usage:
 *   node scripts/profile-vitest.js [--filter <pattern>] [--run] [...vitest args]
 */
import { spawn } from 'child_process';

const args = process.argv.slice(2);
const cmd = process.platform === 'win32' ? 'pnpm.cmd' : 'pnpm';

// Robust argument handling for vitest invocation.
// We want to support:
//  - `node scripts/profile-vitest.js` -> runs tests/unit
//  - `node scripts/profile-vitest.js --all` -> runs full test matrix
//  - `node scripts/profile-vitest.js tests/unit/... -t "Filter"` -> runs a single file with flags
// The key is placing a positional test path immediately after 'vitest' so Vitest
// correctly matches the requested files.
function buildVitestArgs(inputArgs) {
  // Normalize input: drop any leading '--' used by npm to separate args
  const filteredInput = (inputArgs || []).filter((a) => a !== '--');

  if (filteredInput.length === 0) {
    return ['vitest', 'tests/unit', '--run'];
  }

  // If user requested full run
  if (filteredInput.includes('--all')) {
    const rest = filteredInput.filter((a) => a !== '--all');
    return ['vitest', '--run', ...rest];
  }

  // Find first non-flag token (doesn't start with '-') as the test path
  let pathIndex = filteredInput.findIndex((a) => !a.startsWith('-'));
  let pathArg = null;
  if (pathIndex !== -1) {
    pathArg = filteredInput[pathIndex];
  }

  const flags = filteredInput.filter((_, idx) => idx !== pathIndex);

  const target = pathArg || 'tests/unit';

  // Build args: put the path first, then --run (if not already present), then other flags
  const hasRun = flags.includes('--run');
  const prefix = ['vitest', target];
  if (!hasRun) prefix.push('--run');
  return prefix.concat(flags);
}

const vitestArgs = buildVitestArgs(args);

console.log('Running:', cmd, vitestArgs.join(' '));
const start = Date.now();

const child = spawn(cmd, vitestArgs, { stdio: 'inherit' });

child.on('close', (code) => {
  const ms = Date.now() - start;
  console.log(`\nVitest wall-clock time: ${ms}ms (~${(ms / 1000).toFixed(2)}s)`);
  if (code !== 0) {
    console.error(`Vitest exited with code ${code}`);
  }
  process.exit(code ?? 0);
});
