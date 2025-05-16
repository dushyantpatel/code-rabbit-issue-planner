// Test setup file for Mocha
import * as chai from 'chai';

// Set Chai global settings
chai.config.includeStack = true;

// Global before all tests
before(function () {
    // Setup code to run once before all tests
    process.env.NODE_ENV = 'test';
});

// Global after all tests
after(function () {
    // Cleanup code to run once after all tests
});
