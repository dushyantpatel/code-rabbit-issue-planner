// Configuration validator utility
import { AppConfig } from './configLoader.js';

/**
 * Validates the application configuration
 * @param config The configuration object to validate
 * @throws Error if the configuration is invalid
 */
export function validateConfig(config: AppConfig): void {
    const errors: string[] = [];

    // Validate API port
    if (
        !config.apiPort ||
        typeof config.apiPort !== 'number' ||
        config.apiPort < 0 ||
        config.apiPort > 65535
    ) {
        errors.push('apiPort must be a valid port number (0-65535)');
    }

    // Validate logging configuration
    if (!config.logging) {
        errors.push('logging configuration is missing');
    } else {
        // Validate logging level
        const validLogLevels = ['error', 'warn', 'info', 'http', 'debug'];
        if (!validLogLevels.includes(config.logging.level)) {
            errors.push(`logging.level must be one of: ${validLogLevels.join(', ')}`);
        }

        // Validate file logging configuration
        if (config.logging.file) {
            if (
                config.logging.file.enabled &&
                (!config.logging.file.path || !config.logging.file.errorPath)
            ) {
                errors.push(
                    'When file logging is enabled, both path and errorPath must be specified',
                );
            }
        } else {
            errors.push('logging.file configuration is missing');
        }

        // Validate console logging configuration
        if (!config.logging.console) {
            errors.push('logging.console configuration is missing');
        }
    }

    // Validate LLM configuration
    if (!config.llm) {
        errors.push('llm configuration is missing');
    } else {
        // Validate LLM provider
        const validProviders = ['anthropic', 'mock'];
        if (!validProviders.includes(config.llm.provider)) {
            errors.push(`llm.provider must be one of: ${validProviders.join(', ')}`);
        }

        // Validate Anthropic configuration when it's the selected provider
        if (config.llm.provider === 'anthropic') {
            if (!config.llm.anthropic) {
                errors.push(
                    'llm.anthropic configuration is missing when provider is set to anthropic',
                );
            } else {
                if (!config.llm.anthropic.apiKey) {
                    errors.push(
                        'llm.anthropic.apiKey is required when provider is set to anthropic',
                    );
                }

                if (!config.llm.anthropic.model) {
                    errors.push(
                        'llm.anthropic.model is required when provider is set to anthropic',
                    );
                }

                if (
                    typeof config.llm.anthropic.maxRetries !== 'number' ||
                    config.llm.anthropic.maxRetries < 0
                ) {
                    errors.push('llm.anthropic.maxRetries must be a non-negative number');
                }
            }
        }
    }

    // If there are validation errors, throw an error with all messages
    if (errors.length > 0) {
        throw new Error(`Configuration validation failed:\n- ${errors.join('\n- ')}`);
    }
}
