#!/usr/bin/env node

import { register } from 'node:module';
import { pathToFileURL } from 'node:url';
import { spawn } from 'node:child_process';

// Register TypeScript as the module loader
register('ts-node/esm', pathToFileURL('./'));

// Process Mocha arguments
const args = process.argv.slice(2);

// Run Mocha with the passed arguments
const mocha = spawn('mocha', args, {
    stdio: 'inherit',
    shell: true,
});

// Handle process exit
mocha.on('exit', (code) => {
    process.exit(code);
});
