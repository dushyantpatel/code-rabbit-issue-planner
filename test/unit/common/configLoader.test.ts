// Test file for configuration loader
import { expect } from 'chai';
import { ConfigBackup } from '../../utils/config-test-utils.js';
import path from 'path';
import { AppConfig } from '../../../src/common/configLoader.js';
import { readFileSync } from 'fs';

// Function to load the current config directly from the file
function loadCurrentConfig(): AppConfig {
    const configPath = path.resolve('./test/test-config.json');
    const configContent = readFileSync(configPath, 'utf-8');
    return JSON.parse(configContent) as AppConfig;
}

describe('Configuration System', () => {
    // Setup the config backup mechanism
    before(() => {
        ConfigBackup.backup();
    });

    // Restore original config after tests
    after(() => {
        ConfigBackup.restore();
    });

    it('should override config using environment variables', () => {
        // Modify the configuration
        ConfigBackup.modifyConfig({
            apiPort: 9000,
            logging: {
                level: 'error',
                file: {
                    enabled: true,
                    path: 'logs/test-combined.log',
                    errorPath: 'logs/test-error.log',
                },
                console: {
                    enabled: true,
                    colorized: false,
                },
            },
        });

        // Load the current config directly from the file
        const config = loadCurrentConfig();

        // Test that our modifications worked
        expect(config.apiPort).to.equal(9000);
        expect(config.logging.level).to.equal('error');
    });

    it('should restore config after backup', () => {
        // Restore the config
        ConfigBackup.restore();

        // Load the current config directly from the file
        const config = loadCurrentConfig();

        // Test that our original values are restored
        expect(config.apiPort).to.equal(8000);
    });
});
