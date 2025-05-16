# Testing Documentation

This project uses Mocha for testing along with Chai for assertions and Sinon for mocking. The testing framework is set up to support both unit tests and integration tests with coverage reporting via NYC (Istanbul).

## Test Structure

- `test/unit/`: Contains unit tests that test individual components in isolation

    - `controllers/`: Tests for controller functions
    - `services/`: Tests for services like the MockLLMClient

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

## Test Configuration

- `.mocharc.json`: Contains Mocha configuration
- `test/mocha.setup.ts`: Contains global setup code for tests
- `test/integration/test-server.ts`: Sets up a test Express server without starting it

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
