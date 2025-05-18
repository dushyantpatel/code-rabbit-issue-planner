import { LLMClient } from '../types/llmClient.js';
import { MockLLMClient } from './mockLLMClient.js';
import { AnthropicLLMClient } from './anthropicLLMClient.js';
import config from '../common/configLoader.js';
import { log } from '../common/logger.js';

/**
 * Functions for creating LLM client instances based on configuration
 */
export const LLMClientFactory = {
    /**
     * Creates and returns an appropriate LLM client based on configuration
     */
    createClient(): LLMClient {
        // Check if provider exists in config
        const llmConfig = config.llm;
        const clientType = llmConfig.provider || 'mock';

        log.info(`Creating LLM client of type: ${clientType}`, 'LLMClientFactory');

        switch (clientType) {
            case 'anthropic':
                return new AnthropicLLMClient();
            case 'mock':
            default:
                return new MockLLMClient();
        }
    },
};
