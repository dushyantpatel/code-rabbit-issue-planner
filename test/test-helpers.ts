// Test utility functions and helpers
import { IssueClass } from '../src/types/issue.js';
import { dataStore } from '../src/db/dataStore.js';

/**
 * Creates a sample issue for testing
 * @param id Optional issue ID (defaults to 'test-id')
 * @returns A new issue instance for testing
 */
export function createTestIssue(id = 'test-id'): IssueClass {
    return new IssueClass(
        id,
        'Test Issue',
        'This is a test issue description',
        'test@example.com',
        new Date().toISOString(),
    );
}

/**
 * Clears the data store and optionally adds test issues
 * @param issues Optional array of issues to add after clearing
 */
export function resetDataStore(issues: IssueClass[] = []): void {
    // Clear data store
    dataStore.issues = [];

    // Add test issues if provided
    if (issues.length > 0) {
        dataStore.issues.push(...issues);
    }
}

/**
 * Creates multiple test issues with different IDs
 * @param count Number of issues to create
 * @returns Array of test issues
 */
export function createMultipleTestIssues(count: number): IssueClass[] {
    const issues: IssueClass[] = [];

    for (let i = 1; i <= count; i++) {
        issues.push(
            new IssueClass(
                `test-id-${i}`,
                `Test Issue ${i}`,
                `This is test issue ${i} description`,
                'test@example.com',
                new Date().toISOString(),
            ),
        );
    }

    return issues;
}
