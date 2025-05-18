# Issue Planner

An intelligent issue management system that uses LLM (Large Language Model) capabilities to automatically analyze and plan software development tasks. The system provides a robust backend for issue tracking with automated analysis and planning.

## Introduction

I built this project as part of a take-home assignment for a software engineering interview, intended to be completed within approximately 24 hours. My primary focus was to demonstrate the ability to design modular, testable, and extensible code, as would be expected in a production environment. I prioritized aspects such as clear separation of concerns, maintainable structure, and robust testing utilities. However, the implementation is still buggy and not intended for production use — for example, the system currently allows users to create multiple issues with the same ID. There are many features and considerations that would be addressed in a real-world scenario, such as a full authentication and authorization module, stricter validation, and persistent storage.

**Design decisions made:**

- Separated route and controller logic to clearly distinguish routing from request handling, supporting horizontal scaling and easier testing.
- Well-organized file system to facilitate teamwork and make the codebase approachable for multiple contributors.
- Enforced linting and strict type checking for faster development and fewer errors.
- Use of tools like prettier for better developer experience and code maintainability.
- Provided comprehensive test utilities and a dedicated test server to enable both unit and integration testing.
- Logging at various levels for better understanding of data flow. Also helps with debugging.
- Used a mock LLM client with a clear interface, making it easy to swap in a real LLM service later.
- Modularized error handling and logging for better observability and maintainability.
- Rendered the Markdown README as HTML at the root endpoint for interactive documentation (clickable links but may not work as yet).
- Keeping the in-memory data store simple to allow for faster iterative development while bootstraping.
- Use of Express.js to allow for scalable, production ready API.
- Custom Errors like HTTPError

**Things that could have been done with more time:**

- This is not an exhaustive list! :-)
- Integrating with actual LLMs.
- Git hooks for linting before committing code in VCS or pushing out.
- Implementing connectivity with a persistent database (e.g. PostgreSQL) for real data durability.
- Designing an adapter for DB connectivity, to make it easier to switch from in-memory storage to persistent storage.
- Adding a robust authentication and authorization system.
- Improving input validation and error handling for edge cases.
- Robust Error handling infrastructure with more Custom error classes.
- Implementing rate limiting for API calls made to LLMs (cost based).
- Implementing rate limiting and monitoring for production readiness.
- Building a frontend UI for easier interaction with the API.
- CI/CD pipelines for on-prem/cloud deployment with rollback capabilities in case of failures.
- Continuous monitoring of service health.
- Dynamic scaling up/down.
- ✅ Separate dev/production configurations: Implemented environment-specific configurations with environment variable override support!

_Note: The project was built with the help of LLM tools that were used for generating some parts of the documentation, assisting with integration of external modules and dependency resolution, and auto code completion/generation to help with development. For example, LLM tools were used to create tests for routes once a few were provided, create handlers, and for debugging. AI was not used for things such as structuring the project, choosing external modules, architecture and design - this project was built from the ground up._

## Features

- **Issue Management**: Full CRUD operations for managing development issues
- **Automated Analysis**: LLM-powered analysis of issues to determine:
    - Priority level (high/medium/low)
    - Relevant labels
    - Suggested assignee
    - Confidence score
- **Intelligent Planning**: Automated generation of task plans and steps
- **RESTful API**: Clean and well-structured HTTP endpoints
- **TypeScript**: Fully typed codebase with strict type checking
- **Extensible**: Modular design ready for integration with any LLM service
- **Robust Logging**: Comprehensive logging system with context-aware logs and environment-specific configuration
- **Interactive Documentation**: Markdown README rendered as HTML at the root endpoint
- **Test Utilities**: Helpers for test data, state management, and configuration testing
- **Comprehensive Test Coverage**: Unit and integration tests with c8 coverage reporting
- **Environment Configuration**: Support for environment-specific settings and environment variable overrides

## Tech Stack

- **Backend**: Node.js & Express 5.x
- **Language**: TypeScript with strict type checking
- **Code Quality**: ESLint & Prettier configuration
- **API Security**: CORS enabled for cross-origin requests
- **Logging**: Winston logger with custom formatting and environment-specific configuration
- **Documentation**: Marked for rendering Markdown as HTML
- **Test Coverage**: c8 for comprehensive coverage reporting
- **Data Store**: In-memory data store (easily replaceable with a database)
- **Configuration**: Robust environment-specific configuration system with validation

## API Endpoints

### Documentation

- `GET /` - View this documentation as HTML

### Issues

- `GET /issues` - List all issues
- `GET /issues/:issueId` - Get a specific issue by ID
- `PUT /issues/:issueId` - Update an existing issue
- `DELETE /issues/:issueId` - Delete an issue

### Events

- `POST /events` - Create a new issue from event data

### Analysis & Planning

- `POST /analyze/:issueId` - Analyze an issue using LLM capabilities
- `POST /plan/:issueId` - Generate a detailed plan for an issue using LLM

## Getting Started

1. Clone the repository:

    ```bash
    git clone https://github.com/dushyantpatel/code-rabbit-issue-planner.git
    cd code-rabbit-issue-planner
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

3. Start the development server:

    ```bash
    # Default development mode
    npm run dev

    # Or specify environments explicitly
    NODE_ENV=development npm run dev
    NODE_ENV=production npm start
    ```

The server will start on port 8000 (configurable in the environment-specific config files).

## Development

- `npm run dev` - Start development server using development configuration
- `npm run dev:prod` - Start development server using production configuration
- `npm run dev:watch` - Start dev server with hot reload
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run start:dev` - Start production server with development configuration
- `npm run test` - Run all tests
- `npm run test:unit` - Run unit tests
- `npm run test:integration` - Run integration tests
- `npm run test:coverage` - Run tests with code coverage report
- `npm run lint` - Check code style
- `npm run lint:fix` - Fix code style issues

### LLM Configuration

The application supports multiple LLM providers that can be configured in `src/config.json`:

```json
"llm": {
    "provider": "mock",
    "anthropic": {
        "apiKey": "your-api-key",
        "model": "claude-3-opus-20240229",
        "maxRetries": 3
    }
}
```

Available provider options:

- `mock` - Uses the mock LLM client for testing and development
- `anthropic` - Uses the Anthropic Claude API (requires a valid API key)

For running tests, the application automatically uses the mock provider to avoid making real API calls.

### Environment-Specific Configuration

The application features a comprehensive environment-specific configuration system:

- **Configuration Files**:

    - `src/config.json` - Production environment configuration
    - `src/config.dev.json` - Development environment configuration
    - `test/test-config.json` - Testing environment configuration

- **Configuration Loader**:

    - Automatically selects appropriate config file based on NODE_ENV
    - Provides strong typing for configuration properties
    - Validates configuration to ensure all required properties are present
    - Falls back to safe defaults when needed

- **Environment Modes**:

    ```bash
    # Development mode (uses config.dev.json)
    npm run dev

    # Production mode (uses config.json)
    npm run start

    # Test mode (uses test-config.json)
    NODE_ENV=test npm test
    ```

- **Environment Variable Support**:
  The configuration system supports overriding settings via environment variables:

    ```bash
    # Override API port
    API_PORT=9000 npm run dev

    # Configure LLM provider and API key
    LLM_PROVIDER=anthropic ANTHROPIC_API_KEY=your-api-key npm run start

    # Configure logging
    LOG_LEVEL=debug LOG_TO_CONSOLE=true LOG_TO_FILE=false npm run dev
    ```

    **Supported Environment Variables**:

    - `API_PORT` - Override the API port
    - `LOG_LEVEL` - Set logging level (error, warn, info, http, debug)
    - `LOG_TO_CONSOLE` - Enable/disable console logging (true/false)
    - `LOG_TO_FILE` - Enable/disable file logging (true/false)
    - `LOG_FILE_PATH` - Set path for log files
    - `LOG_ERROR_FILE_PATH` - Set path for error logs
    - `LLM_PROVIDER` - Set LLM provider (mock, anthropic)
    - `ANTHROPIC_API_KEY` - Set API key for Anthropic
    - `ANTHROPIC_MODEL` - Set model name for Anthropic

For complete documentation on the configuration system, see the [CONFIG_README.md](CONFIG_README.md) file.

## Testing

This project includes a comprehensive test suite with both unit tests and integration tests, as well as coverage reporting and test utilities. For full details, see the [test/README.md](test/README.md).

- `npm test` - Run all tests
- `npm run test:unit` - Run only unit tests
- `npm run test:integration` - Run only integration tests
- `npm run test:coverage` - Run all tests with coverage reporting

The testing framework uses:

- **Mocha** - Test runner
- **Chai** - Assertions library
- **Sinon** - Mocking and stubbing
- **Supertest** - HTTP testing
- **c8** - Code coverage with support for ES modules and modern TypeScript

Test utilities are provided in `test/test-helpers.ts`, a dedicated test Express server is available for integration tests, and configuration testing utilities are available for testing with different configuration settings.

## Project Structure

```
src/
├── config.json         # Production configuration
├── config.dev.json     # Development configuration
├── common/
│   ├── configLoader.ts # Environment configuration loader
│   ├── errors.ts       # Error handling functionality
│   └── logger.ts       # Logging system with Winston
├── controllers/
│   ├── issueAnalysis.ts    # Issue analysis and planning endpoints
│   └── issueManagement.ts  # CRUD operations for issues
├── db/
│   └── dataStore.ts    # In-memory data store
├── routes/             # API route definitions
│   ├── analyzeRoutes.ts
│   ├── eventsRoutes.ts
│   ├── issuesRoutes.ts
│   └── planRoutes.ts
├── services/
│   ├── mockLLMClient.ts    # Mock LLM service implementation
│   ├── anthropicLLMClient.ts # Anthropic LLM implementation
│   └── llmClientFactory.ts # Factory to create appropriate LLM client
└── types/              # TypeScript type definitions
    ├── issue.ts            # Issue model and validation
    ├── issueComment.ts     # Comment model
    ├── llmAnalysisResponse.ts  # Analysis result structure
    ├── llmClient.ts        # LLM client interface
    └── llmIssuePlanResponse.ts # Planning result structure

test/
├── README.md           # Testing documentation and guidelines
├── SUMMARY.md          # Testing implementation summary
├── test-config.json    # Test environment configuration
├── integration/        # Integration tests (API routes)
│   └── routes/
├── unit/               # Unit tests (controllers, db, services)
├── test-helpers.ts     # Test utility functions
├── config-test-helpers.ts # Configuration testing utilities
├── llm-test-helper.ts  # Helpers for LLM testing setup
├── test-server.ts      # Test Express server for integration tests
├── mocha.setup.ts      # Global test setup
└── tsconfig.json       # Test TypeScript config
```

## Current Implementation

### LLM Integration

The system currently supports a mock LLM client (`MockLLMClient`) and an Anthropic LLM client (`AnthropicLLMClient`):

- **Mock LLM Client**:

    - Provides deterministic responses based on issue content
    - Generates consistent labels, priority, and assignees
    - Uses a simple hash function to ensure responses are deterministic yet varied
    - Simulates typical LLM processing delays
    - Used for testing and development environments

- **Anthropic LLM Client**:
    - Integrates with Anthropic's Claude API
    - Requires a valid API key configured in `src/config.json`
    - Implements retry logic for API calls
    - Used for production environments

The system uses a factory pattern via `LLMClientFactory` to instantiate the appropriate client based on the configuration.

### Logging System

The application features a robust logging system with:

- Multiple log levels (error, warn, info, http, debug)
- Context-aware logging that includes the source component
- Colorized console output for better readability
- File-based logs with separate error log
- HTTP request logging with response times
- Comprehensive error tracking

### Environment-Specific Configuration

The application's environment-specific configuration system provides:

- Different settings for development, production, and testing environments
- Strong typing for configuration properties
- Validation to ensure all required properties are present
- Support for overriding settings via environment variables
- Flexible LLM provider selection based on environment
- Environment-specific logging configuration

The system uses a TypeScript-based configuration loader that automatically selects the appropriate config file based on the NODE_ENV environment variable. This allows for:

- Cost-saving development workflow (using mock LLM in development)
- Secure production deployment (API keys via environment variables)
- Deterministic and reliable tests that don't rely on external services
- Easy configuration for different deployment scenarios

### Data Storage

The current implementation uses an in-memory data store that:

- Provides full CRUD operations for issues
- Uses strongly typed models with validation
- Can easily be replaced with a persistent database

### Example Issue Creation

```bash
curl -X POST http://localhost:8000/events \
  -H "Content-Type: application/json" \
  -d '{
    "id": "issue-123",
    "title": "Add retry logic to HTTP client",
    "description": "Requests to external APIs sometimes fail. We need to add automatic entries.",
    "author": "alice@example.com",
    "createdAt": "2024-04-01T10:15:00Z"
  }'
```

## Future Enhancements

### Core Functionality

- **Real LLM Integration**: Replace mock LLM client with a real LLM service (OpenAI, Anthropic, etc.)
- **Database Integration**: Replace in-memory storage with a persistent database (MongoDB, PostgreSQL)
- **WebSocket Support**: Add real-time updates for collaborative issue management

### Security & Monitoring

- **Authentication**: Add user authentication with JWT or OAuth
- **Authorization**: Role-based access control for different operations
- **Rate Limiting**: Prevent API abuse
- **Enhanced Logging**: Add performance metrics and telemetry
- **Error Monitoring**: Integration with error tracking services

### Testing & Documentation

- **Unit Tests**: Expand test coverage for all modules
- **Integration Tests**: End-to-end API testing
- **API Documentation**: Implement Swagger/OpenAPI specifications
- **Advanced Analytics**: Add statistics and insights on issue resolution patterns
- **Test Utilities**: Continue to improve test helpers and coverage reporting
- **Configuration**: Support for encrypted configuration values and cloud secret management services

### UI & Usability

- **Web Frontend**: Develop a React/Vue.js frontend for the API
- **Email Notifications**: Alerts for issue updates and assignments
- **Custom Workflows**: Support for configurable issue workflows
- **Batch Operations**: Support for handling multiple issues at once

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

ISC License - see the [LICENSE](LICENSE) file for details
