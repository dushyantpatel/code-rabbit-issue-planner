# Code Rabbit Issue Planner

An intelligent issue management system that uses LLM (Large Language Model) capabilities to automatically analyze and plan software development tasks. The system provides a robust backend for issue tracking with automated analysis and planning.

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
- **Robust Logging**: Comprehensive logging system with context-aware logs
- **Interactive Documentation**: Markdown README rendered as HTML at the root endpoint

## Tech Stack

- **Backend**: Node.js & Express 5.x
- **Language**: TypeScript with strict type checking
- **Code Quality**: ESLint & Prettier configuration
- **API Security**: CORS enabled for cross-origin requests
- **Logging**: Winston logger with custom formatting
- **Documentation**: Marked for rendering Markdown as HTML
- **Data Store**: In-memory data store (easily replaceable with a database)

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
    npm run dev
    ```

The server will start on port 8000 (configurable in `src/config.json`).

## Development

- `npm run dev:watch` - Start dev server with hot reload
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Check code style
- `npm run lint:fix` - Fix code style issues

## Testing

This project includes a comprehensive test suite with both unit tests and integration tests:

- `npm test` - Run all tests
- `npm run test:unit` - Run only unit tests
- `npm run test:integration` - Run only integration tests
- `npm run test:coverage` - Run all tests with coverage reporting

The testing framework uses:

- **Mocha** - Test runner
- **Chai** - Assertions library
- **Sinon** - Mocking and stubbing
- **Supertest** - HTTP testing
- **NYC (Istanbul)** - Code coverage

## Project Structure

```
src/
├── config.json         # Application configuration
├── main.ts             # Application entry point
├── readme.ts           # Markdown to HTML converter for documentation
├── common/             # Shared utilities
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
│   └── mockLLMClient.ts    # Mock LLM service implementation
└── types/              # TypeScript type definitions
    ├── issue.ts            # Issue model and validation
    ├── issueComment.ts     # Comment model
    ├── llmAnalysisResponse.ts  # Analysis result structure
    ├── llmClient.ts        # LLM client interface
    └── llmIssuePlanResponse.ts # Planning result structure
```

## Current Implementation

### LLM Integration

The system currently uses a mock LLM client (`MockLLMClient`) that provides deterministic responses based on issue content. This mock implementation:

- Generates consistent labels, priority, and assignees based on the issue content
- Uses a simple hash function to ensure responses are deterministic yet varied
- Simulates typical LLM processing delays
- Can be replaced with a real LLM service implementation by implementing the `LLMClient` interface

### Logging System

The application features a robust logging system with:

- Multiple log levels (error, warn, info, http, debug)
- Context-aware logging that includes the source component
- Colorized console output for better readability
- File-based logs with separate error log
- HTTP request logging with response times
- Comprehensive error tracking

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

- **Unit Tests**: Add comprehensive test coverage with Jest
- **Integration Tests**: End-to-end API testing
- **API Documentation**: Implement Swagger/OpenAPI specifications
- **Advanced Analytics**: Add statistics and insights on issue resolution patterns

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
