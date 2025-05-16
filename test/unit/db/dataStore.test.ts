// Unit tests for the dataStore module
import { expect } from 'chai';
import { dataStore } from '../../../src/db/dataStore.js';
import { createTestIssue, resetDataStore } from '../../test-helpers.js';

describe('DataStore', () => {
    beforeEach(() => {
        // Reset the dataStore before each test
        resetDataStore();
    });

    it('should initialize with an empty issues array', () => {
        expect(dataStore).to.have.property('issues');
        expect(dataStore.issues).to.be.an('array');
        expect(dataStore.issues).to.have.lengthOf(0);
    });

    it('should be able to store and retrieve issues', () => {
        // Add a test issue
        const testIssue = createTestIssue();
        dataStore.issues.push(testIssue);

        // Verify it was added
        expect(dataStore.issues).to.have.lengthOf(1);
        expect(dataStore.issues[0].id).to.equal('test-id');

        // Retrieve by ID
        const retrievedIssue = dataStore.issues.find((i) => i.id === 'test-id');
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        expect(retrievedIssue).to.not.be.undefined;
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        expect(retrievedIssue?.title).to.equal('Test Issue');
    });

    it('should maintain issue integrity when updating', () => {
        // Add a test issue
        const testIssue = createTestIssue();
        dataStore.issues.push(testIssue);

        // Modify the issue
        const issueIndex = dataStore.issues.findIndex((i) => i.id === 'test-id');
        dataStore.issues[issueIndex].title = 'Updated Title';

        // Verify update was successful
        expect(dataStore.issues[0].title).to.equal('Updated Title');
        expect(dataStore.issues[0].id).to.equal('test-id'); // ID should be unchanged
    });

    it('should be able to remove issues', () => {
        // Add a test issue
        const testIssue = createTestIssue();
        dataStore.issues.push(testIssue);

        // Verify it was added
        expect(dataStore.issues).to.have.lengthOf(1);

        // Remove the issue
        const issueIndex = dataStore.issues.findIndex((i) => i.id === 'test-id');
        dataStore.issues.splice(issueIndex, 1);

        // Verify it was removed
        expect(dataStore.issues).to.have.lengthOf(0);
    });
});
