# Code Rabbit Issue Planner

An intelligent issue management system that uses LLM (Large Language Model) capabilities to automatically analyze and plan software development tasks.

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

## Tech Stack

- Node.js & Express
- TypeScript
- ESLint & Prettier for code quality
- CORS enabled
- In-memory data store (easily replaceable with a database)

## API Endpoints

### Issues

- `GET /issues` - List all issues
- `GET /issues/:issueId` - Get a specific issue
- `PUT /issues/:issueId` - Update an issue
- `DELETE /issues/:issueId` - Delete an issue

### Events

- `POST /events` - Create a new issue

### Analysis & Planning

- `POST /analyze/:issueId` - Analyze an issue using LLM
- `POST /plan/:issueId` - Generate a plan for an issue using LLM

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

## Project Structure

```
src/
├── config.json         # Application configuration
├── main.ts             # Application entry point
├── common/             # Shared utilities
├── controllers/        # Request handlers
├── db/                 # Data storage layer
├── routes/             # API route definitions
├── services/           # Business logic layer
└── types/              # TypeScript type definitions
```

## Current Implementation

The system currently uses a mock LLM client (`MockLLMClient`) that provides deterministic responses based on issue content. This can be replaced with a real LLM service implementation by implementing the `LLMClient` interface.

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

- Replace in-memory storage with a persistent database
- Add authentication and authorization
- Implement a real LLM service integration
- Add WebSocket support for real-time updates
- Add test coverage
- Add API documentation (Swagger/OpenAPI)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

ISC License - see the [LICENSE](LICENSE) file for details
