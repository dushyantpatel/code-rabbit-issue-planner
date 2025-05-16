// Unit tests for the MockLLMClient
import { expect } from 'chai';
import { MockLLMClient } from '../../../src/services/mockLLMClient.js';
import { IssueClass } from '../../../src/types/issue.js';

describe('MockLLMClient', () => {
    let llmClient: MockLLMClient;
    let testIssue: IssueClass;

    beforeEach(() => {
        // Initialize the LLM client before each test
        llmClient = new MockLLMClient();

        // Create a test issue
        testIssue = new IssueClass(
            'test-issue-1',
            'Test Issue Title',
            'This is a test issue description',
            'test@example.com',
            new Date().toISOString(),
        );
    });

    describe('analyzeIssue', () => {
        it('should return analysis results with expected properties', async () => {
            const result = await llmClient.analyzeIssue(testIssue);

            // Check that the result has all required properties
            expect(result).to.have.property('labels').that.is.an('array');
            expect(result).to.have.property('assignedTo').that.is.a('string');
            expect(result).to.have.property('confidence').that.is.a('number');
            expect(result).to.have.property('priority').that.is.a('string');

            // Check confidence value is in expected range
            expect(result.confidence).to.be.at.least(0.5);
            expect(result.confidence).to.be.at.most(1);

            // Check priority is one of the expected values
            expect(['low', 'medium', 'high']).to.include(result.priority);
        });

        it('should be deterministic for the same input', async () => {
            const result1 = await llmClient.analyzeIssue(testIssue);
            const result2 = await llmClient.analyzeIssue(testIssue);

            // Results should be identical for the same input
            expect(result1).to.deep.equal(result2);
        });
    });

    describe('planIssue', () => {
        it('should return a plan string', async () => {
            const result = await llmClient.planIssue(testIssue);

            // Check that result has a plan
            expect(result).to.have.property('plan').that.is.a('string');
            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
            expect(result.plan).to.not.be.empty;
        });

        it('should be deterministic for the same input', async () => {
            const result1 = await llmClient.planIssue(testIssue);
            const result2 = await llmClient.planIssue(testIssue);

            // Results should be identical for the same input
            expect(result1).to.deep.equal(result2);
        });
    });
});
