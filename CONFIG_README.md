# Environment-Specific Configuration

This project supports different configuration settings based on the environment in which it's running: development, production, or testing.

## Configuration Files

- `src/config.json` - Production environment configuration
- `src/config.dev.json` - Development environment configuration
- `test/test-config.json` - Testing environment configuration

## How Configuration Loading Works

The application uses the `NODE_ENV` environment variable to determine which configuration file to load. The `src/common/configLoader.ts` module handles this process:

- `NODE_ENV=production` - Loads `src/config.json`
- `NODE_ENV=development` - Loads `src/config.dev.json`
- `NODE_ENV=test` - Loads `test/test-config.json`
- Default - If `NODE_ENV` is not set, it defaults to development mode

## Configuration Structure

The configuration follows this structure:

```typescript
interface AppConfig {
    apiPort: number;
    logging: {
        level: string;
        file: {
            enabled: boolean;
            path: string;
            errorPath: string;
        };
        console: {
            enabled: boolean;
            colorized: boolean;
        };
    };
    llm: {
        provider: string;
        anthropic: {
            apiKey: string;
            model: string;
            maxRetries: number;
        };
    };
}
```

## Key Configuration Differences

### Production Configuration

- Optimized for stable performance
- Uses real Anthropic LLM API
- More conservative logging (info level)
- API keys should be real, production keys

### Development Configuration

- Optimized for developer experience
- Can use mock LLM provider to avoid API costs during development
- More verbose logging (debug level)
- Can use lower-cost AI models for development

### Test Configuration

- Uses mock LLM provider to ensure tests are fast and deterministic
- No external service dependencies to ensure reliable CI/CD

## Environment Variable Support

The application supports overriding configuration values using environment variables:

| Environment Variable | Configuration Property  | Description                              |
| -------------------- | ----------------------- | ---------------------------------------- |
| API_PORT             | apiPort                 | Port the API server runs on              |
| LOG_LEVEL            | logging.level           | Logging level (error, warn, info, debug) |
| LOG_TO_CONSOLE       | logging.console.enabled | Enable/disable console logging           |
| LOG_TO_FILE          | logging.file.enabled    | Enable/disable file logging              |
| LOG_FILE_PATH        | logging.file.path       | Path for the combined log file           |
| LOG_ERROR_FILE_PATH  | logging.file.errorPath  | Path for the error log file              |
| LLM_PROVIDER         | llm.provider            | LLM provider (anthropic, mock)           |
| ANTHROPIC_API_KEY    | llm.anthropic.apiKey    | Anthropic API key                        |
| ANTHROPIC_MODEL      | llm.anthropic.model     | Anthropic model name                     |

Example:

```bash
ANTHROPIC_API_KEY=your-api-key NODE_ENV=production npm start
```

## Configuration Validation

The application validates configuration during loading to ensure all required values are present and valid. If validation fails, the application will throw an error with details about what's missing or invalid.

## Setting Up Environment Variables

To run the application with a specific configuration:

```bash
# For production
NODE_ENV=production npm start

# For development
NODE_ENV=development npm run dev

# For test
NODE_ENV=test npm test
```

## Test Configuration Utilities

For testing, a configuration backup/restore system is available in `/test/utils/config-test-utils.ts`:

```typescript
// In your test setup
import { configFixture } from './utils/config-test-utils.js';

// Before tests - backs up configuration
before(configFixture.setup);

// After tests - restores original configuration
after(configFixture.teardown);

// During tests - temporarily modify config
ConfigBackup.modifyConfig({
    llm: { provider: 'mock' },
});
```

## Important Security Notes

- Never commit real API keys to the repository
- Use environment variables or a secure secrets manager for sensitive credentials in production
- The configuration files should contain placeholder values that are overridden in the actual deployment environment
