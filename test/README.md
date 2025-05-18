# Testing Documentation

This project uses Mocha for testing along with Chai for assertions and Sinon for mocking. The testing framework is set up to support both unit tests and integration tests with coverage reporting via c8.

## Test Structure

- `test/unit/`: Contains unit tests that test individual components in isolation

    - `controllers/`: Tests for controller functions
    - `services/`: Tests for services like the MockLLMClient
    - `common/`: Tests for common utilities including configuration loader

- `test/integration/`: Contains integration tests that test multiple components together
    - `routes/`: Tests for API endpoints

## Running Tests

### Running All Tests

```bash
npm test
```

### Running Only Unit Tests

```bash
npm run test:unit
```

### Running Only Integration Tests

```bash
npm run test:integration
```

### Running Tests With Coverage

```bash
npm run test:coverage
```

## Test Configuration

- `.mocharc.json`: Contains Mocha configuration
- `test/mocha.setup.ts`: Contains global setup code for tests
- `test/test-config.json`: Contains environment configuration specific to tests
- `test/test-server.ts`: Sets up a test Express server without starting it
- `test/config-test-helpers.ts`: Provides utilities for testing with different configurations

## Test Utilities

The project provides several test helper utilities:

### General Test Helpers

- `test/test-helpers.ts`: Common test utilities such as creating test issues

### Configuration Test Helpers

- `test/config-test-helpers.ts`: Utilities for testing with different configurations
    - `ConfigBackup`: Class for backing up and restoring configuration during tests
    - Configuration modification helpers for test cases

### LLM Test Helpers

- `test/llm-test-helper.ts`: Provides utilities for testing LLM-related functionality
    - Consistent mock responses for deterministic tests
    - LLM client factory configuration

## Environment Configuration for Tests

The test environment uses its own configuration file (`test/test-config.json`) which is automatically loaded when running tests with `NODE_ENV=test`. This ensures:

- Tests use the mock LLM client instead of making real API calls
- Test logging is configured appropriately (minimal console output, no file logging)
- Tests are deterministic and repeatable

You can also override configuration values for specific tests using the `ConfigBackup` utility:

```typescript
import { ConfigBackup } from '../config-test-helpers';

describe('Some test with custom config', () => {
    const configBackup = new ConfigBackup();

    before(() => {
        configBackup.backup();
        // Modify configuration for this test suite
        configBackup.setConfig('api.port', 9999);
    });

    after(() => {
        configBackup.restore();
    });

    it('should use the modified configuration', () => {
        // Test with custom configuration
    });
});
```

## Code Coverage

The project uses c8 for code coverage reporting, which provides better compatibility with ES modules and modern TypeScript features. Coverage reports are generated in HTML, text, and lcov formats.

To view the coverage report after running tests with coverage:

```bash
npm run test:coverage
# Then open coverage/index.html in your browser
```

## Writing New Tests

### Unit Tests

Unit tests should:

- Test a single function or component in isolation
- Mock all dependencies
- Be fast to run
- Focus on testing business logic

Example:

```typescript
import { expect } from 'chai';
import sinon from 'sinon';
import { functionToTest } from '../../src/path/to/function';

describe('Function Name', () => {
    beforeEach(() => {
        // Setup code
    });

    afterEach(() => {
        sinon.restore(); // Clean up stubs
    });

    it('should do something specific', () => {
        // Arrange
        const input = 'test input';

        // Act
        const result = functionToTest(input);

        // Assert
        expect(result).to.equal('expected output');
    });
});
```

### Integration Tests

Integration tests should:

- Test multiple components working together
- Test API endpoints
- Verify correct HTTP status codes and response bodies
- Reset shared state between tests

Example:

```typescript
import { expect } from 'chai';
import request from 'supertest';
import { createTestApp } from '../test-server';

describe('API Endpoint', () => {
    const app = createTestApp();

    beforeEach(() => {
        // Reset state
    });

    it('should return correct response', async () => {
        const response = await request(app).get('/endpoint').send();

        expect(response.status).to.equal(200);
        expect(response.body).to.deep.equal({ key: 'value' });
    });
});
```

### Testing with Different Configurations

When testing functionality that depends on configuration:

```typescript
import { expect } from 'chai';
import { ConfigBackup } from '../config-test-helpers';
import { getConfig } from '../../src/common/configLoader';

describe('Configuration-dependent feature', () => {
    const configBackup = new ConfigBackup();

    beforeEach(() => {
        configBackup.backup();
    });

    afterEach(() => {
        configBackup.restore();
    });

    it('should behave differently with different config', () => {
        // Test with default test config
        let result = featureUnderTest();
        expect(result).to.equal('expected default behavior');

        // Test with modified config
        configBackup.setConfig('feature.flag', true);
        result = featureUnderTest();
        expect(result).to.equal('expected modified behavior');
    });
});
```
