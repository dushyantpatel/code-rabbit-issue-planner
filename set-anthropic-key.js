#!/usr/bin/env node

/**
 * A simple utility script to set the Anthropic API key
 * Usage: node set-anthropic-key.js [apiKey]
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to config file
const configPath = path.join(__dirname, 'src', 'config.json');

// Main function
async function updateApiKey() {
    try {
        // Get API key from command line arg
        const apiKey = process.argv[2];

        if (!apiKey) {
            console.error('Error: Please provide an Anthropic API key');
            console.log('Usage: node set-anthropic-key.js YOUR_API_KEY');
            process.exit(1);
        }

        // Read config file
        const configData = await fs.promises.readFile(configPath, 'utf8');
        const config = JSON.parse(configData);

        // Update API key
        if (!config.llm) {
            config.llm = {};
        }

        if (!config.llm.anthropic) {
            config.llm.anthropic = {};
        }

        config.llm.anthropic.apiKey = apiKey;

        // Write updated config back to file
        await fs.promises.writeFile(configPath, JSON.stringify(config, null, 4), 'utf8');

        console.log('Anthropic API key updated successfully');

        // Remind about changing provider
        if (config.llm.provider !== 'anthropic') {
            console.log('\nNOTE: To use Anthropic, update the config.json to change:');
            console.log('  "provider": "mock" → "provider": "anthropic"');
        }
    } catch (error) {
        console.error('Error updating config file:', error);
        process.exit(1);
    }
}

// Run the function
updateApiKey();
