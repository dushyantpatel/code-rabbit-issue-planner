// Test utilities for configuration management
import { AppConfig } from '../../src/common/configLoader.js';
import fs from 'fs';
import path from 'path';

/**
 * A class to handle configuration backup and restoration for tests
 */
export class ConfigBackup {
    private static originalConfig: AppConfig | null = null;
    private static configPath: string;

    /**
     * Initialize the config backup with the path to the config file
     * @param configPath Path to the configuration file
     */
    public static initialize(configPath: string = path.resolve('./test/test-config.json')): void {
        this.configPath = configPath;
    }

    /**
     * Backup the current configuration
     */
    public static backup(): void {
        if (!this.configPath) {
            this.initialize();
        }

        if (fs.existsSync(this.configPath)) {
            const configStr = fs.readFileSync(this.configPath, 'utf-8');
            this.originalConfig = JSON.parse(configStr);
        } else {
            console.warn(`Config file not found at ${this.configPath} for backup`);
            this.originalConfig = null;
        }
    }

    /**
     * Restore the configuration from backup
     */
    public static restore(): void {
        if (this.originalConfig) {
            fs.writeFileSync(
                this.configPath,
                JSON.stringify(this.originalConfig, null, 2),
                'utf-8',
            );
            console.log(`Configuration restored from backup at ${this.configPath}`);
        } else {
            console.warn('No configuration backup to restore from');
        }
    }

    /**
     * Modify the configuration for testing
     * @param configUpdates Partial configuration object with values to update
     */
    public static modifyConfig(configUpdates: Partial<AppConfig>): void {
        if (!this.originalConfig) {
            this.backup();
        }

        if (fs.existsSync(this.configPath)) {
            const configStr = fs.readFileSync(this.configPath, 'utf-8');
            const currentConfig = JSON.parse(configStr);

            // Apply updates recursively
            const mergedConfig = this.deepMerge(currentConfig, configUpdates);

            fs.writeFileSync(this.configPath, JSON.stringify(mergedConfig, null, 2), 'utf-8');
            console.log(`Configuration modified at ${this.configPath}`);
        } else {
            console.warn(`Config file not found at ${this.configPath} for modification`);
        }
    }

    /**
     * Deep merge two objects
     */
    private static deepMerge(target: any, source: any): any {
        const output = { ...target };

        if (this.isObject(target) && this.isObject(source)) {
            Object.keys(source).forEach((key) => {
                if (this.isObject(source[key])) {
                    if (!(key in target)) {
                        Object.assign(output, { [key]: source[key] });
                    } else {
                        output[key] = this.deepMerge(target[key], source[key]);
                    }
                } else {
                    Object.assign(output, { [key]: source[key] });
                }
            });
        }

        return output;
    }

    /**
     * Check if value is an object
     */
    private static isObject(item: any): boolean {
        return item && typeof item === 'object' && !Array.isArray(item);
    }
}

/**
 * A fixture to use in tests to automatically handle configuration backup and restoration
 * Usage:
 * before(configFixture.setup);
 * after(configFixture.teardown);
 */
export const configFixture = {
    setup: () => {
        ConfigBackup.backup();
    },
    teardown: () => {
        ConfigBackup.restore();
    },
};
