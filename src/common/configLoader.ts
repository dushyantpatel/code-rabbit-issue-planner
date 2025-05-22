// Config loader utility to load appropriate configuration based on environment
import fs from 'fs';
import path from 'path';

// Define the configuration interface
export interface AppConfig {
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

// Get the environment from NODE_ENV or default to development
const env = process.env.NODE_ENV ?? 'development';

/**
 * Validates the application configuration
 * @param config The configuration object to validate
 * @throws Error if the configuration is invalid
 */
function validateConfigInternal(config: AppConfig): void {
    const errors: string[] = [];

    // Validate API port
    if (typeof config.apiPort !== 'number' || config.apiPort < 0 || config.apiPort > 65535) {
        errors.push('apiPort must be a valid port number (0-65535)');
    }

    // Validate logging level
    const validLogLevels = ['error', 'warn', 'info', 'http', 'debug'];
    if (!validLogLevels.includes(config.logging.level)) {
        errors.push(`logging.level must be one of: ${validLogLevels.join(', ')}`);
    }

    // Validate file logging configuration
    if (
        config.logging.file.enabled &&
        (!config.logging.file.path || !config.logging.file.errorPath)
    ) {
        errors.push('When file logging is enabled, both path and errorPath must be specified');
    }

    // Validate LLM provider
    const validProviders = ['anthropic', 'mock'];
    if (!validProviders.includes(config.llm.provider)) {
        errors.push(`llm.provider must be one of: ${validProviders.join(', ')}`);
    }

    // Validate Anthropic configuration when it's the selected provider
    if (config.llm.provider === 'anthropic') {
        if (!config.llm.anthropic.apiKey) {
            errors.push('llm.anthropic.apiKey is required when provider is set to anthropic');
        }

        if (!config.llm.anthropic.model) {
            errors.push('llm.anthropic.model is required when provider is set to anthropic');
        }

        if (
            typeof config.llm.anthropic.maxRetries !== 'number' ||
            config.llm.anthropic.maxRetries < 0
        ) {
            errors.push('llm.anthropic.maxRetries must be a non-negative number');
        }
    }

    // If there are validation errors, throw an error with all messages
    if (errors.length > 0) {
        throw new Error(`Configuration validation failed:\n- ${errors.join('\n- ')}`);
    }
}

// Function to load configuration based on environment
export function loadConfig(): AppConfig {
    try {
        let configPath: string;

        switch (env) {
            case 'production':
                configPath = path.resolve('./src/config.json');
                break;
            case 'test':
                configPath = path.resolve('./test/test-config.json');
                break;
            case 'development':
            default:
                configPath = path.resolve('./src/config.dev.json');
                break;
        }

        // Check if the file exists
        if (!fs.existsSync(configPath)) {
            console.warn(
                `Configuration file for environment ${env} not found at ${configPath}. Using default config.`,
            );
            configPath = path.resolve('./src/config.json');
        }

        // Read and parse the configuration file
        const configJson = fs.readFileSync(configPath, 'utf-8');
        const config = JSON.parse(configJson) as AppConfig;

        // Override configuration with environment variables
        applyEnvironmentVariables(config);

        // Validate the configuration internally
        validateConfigInternal(config);

        console.log(`Loaded configuration for environment: ${env}`);
        return config;
    } catch (error) {
        console.error(
            `Error loading configuration: ${error instanceof Error ? error.message : String(error)}`,
        );
        throw new Error('Failed to load configuration');
    }
}

/**
 * Apply environment variables to override configuration values
 * This allows sensitive values like API keys to be passed via environment variables
 */
function applyEnvironmentVariables(config: AppConfig): void {
    // Override API port if specified
    if (process.env.API_PORT) {
        config.apiPort = parseInt(process.env.API_PORT, 10);
    }

    // Override logging level if specified
    if (process.env.LOG_LEVEL) {
        config.logging.level = process.env.LOG_LEVEL;
    }

    // Override logging configuration
    if (process.env.LOG_TO_CONSOLE === 'true' || process.env.LOG_TO_CONSOLE === 'false') {
        config.logging.console.enabled = process.env.LOG_TO_CONSOLE === 'true';
    }

    if (process.env.LOG_TO_FILE === 'true' || process.env.LOG_TO_FILE === 'false') {
        config.logging.file.enabled = process.env.LOG_TO_FILE === 'true';
    }

    if (process.env.LOG_FILE_PATH) {
        config.logging.file.path = process.env.LOG_FILE_PATH;
    }

    if (process.env.LOG_ERROR_FILE_PATH) {
        config.logging.file.errorPath = process.env.LOG_ERROR_FILE_PATH;
    }

    // Override LLM provider if specified
    if (process.env.LLM_PROVIDER) {
        config.llm.provider = process.env.LLM_PROVIDER;
    }

    // Override Anthropic API key if specified
    if (process.env.ANTHROPIC_API_KEY) {
        config.llm.anthropic.apiKey = process.env.ANTHROPIC_API_KEY;
    }

    // Override Anthropic model if specified
    if (process.env.ANTHROPIC_MODEL) {
        config.llm.anthropic.model = process.env.ANTHROPIC_MODEL;
    }
}

// Export the configuration
const config: AppConfig = loadConfig();
export default config;
