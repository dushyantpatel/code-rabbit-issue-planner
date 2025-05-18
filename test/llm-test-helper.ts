// Helper to ensure tests use the mock LLM client
import { ConfigBackup } from './utils/config-test-utils.js';

// Set up test configuration to use mock LLM client
export function setupTestLLMConfig(): void {
    try {
        // Initialize with the test config path
        ConfigBackup.initialize('./test/test-config.json');

        // Modify the configuration to ensure it uses mock LLM
        ConfigBackup.modifyConfig({
            llm: {
                provider: 'mock',
                // Keep the anthropic config but we won't use it in tests
                anthropic: {
                    apiKey: 'test-key-not-used',
                    model: 'test-model-not-used',
                    maxRetries: 0,
                },
            },
        });

        console.log('Test config set: Using mock LLM client');
    } catch (err) {
        console.error('Error setting test config:', err);
    }
}
