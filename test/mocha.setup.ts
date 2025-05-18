// Test setup file for Mocha
import * as chai from 'chai';
import { setupTestLLMConfig } from './llm-test-helper.js';
import { configFixture } from './utils/config-test-utils.js';

// Set Chai global settings
chai.config.includeStack = true;

// Global before all tests
before(function () {
    // Setup code to run once before all tests
    process.env.NODE_ENV = 'test';

    // Backup the current configuration
    configFixture.setup();

    // Ensure tests use mock LLM client instead of real Anthropic API
    setupTestLLMConfig();
});

// Global after all tests
after(function () {
    // Cleanup code to run once after all tests
    configFixture.teardown();
});
