/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

// Integration tests for the analyze and plan routes
import { expect } from 'chai';
import request from 'supertest';
import { createTestApp } from '../test-server.js';
import { dataStore } from '../../../src/db/dataStore.js';
import { IssueClass } from '../../../src/types/issue.js';

describe('Analyze Routes', () => {
    const app = createTestApp();

    beforeEach(() => {
        // Reset the dataStore before each test
        dataStore.issues = [];
    });

    describe('POST /analyze/:issueId', () => {
        it('should analyze an issue and return results', async () => {
            // Add a test issue
            const issue = new IssueClass(
                'test-id',
                'Test Issue',
                'Description',
                'test@example.com',
                new Date().toISOString(),
            );
            dataStore.issues.push(issue);

            const response = await request(app).post('/analyze/test-id');

            expect(response.status).to.equal(200);
            expect(response.body).to.have.property('labels').that.is.an('array');
            expect(response.body).to.have.property('assignedTo').that.is.a('string');
            expect(response.body).to.have.property('confidence').that.is.a('number');
            expect(response.body).to.have.property('priority').that.is.a('string');

            // Check that the issue was updated
            const updatedIssue = dataStore.issues[0];
            expect(updatedIssue.labels).to.be.a('string');
            expect(updatedIssue.assignedTo).to.be.a('string');
            expect(updatedIssue.confidence).to.be.a('number');
            expect(['low', 'medium', 'high']).to.include(updatedIssue.priority);
        });

        it('should return 404 if issue not found', async () => {
            const response = await request(app).post('/analyze/non-existent');

            expect(response.status).to.equal(404);
        });
    });
});

describe('Plan Routes', () => {
    const app = createTestApp();

    beforeEach(() => {
        // Reset the dataStore before each test
        dataStore.issues = [];
    });

    describe('POST /plan/:issueId', () => {
        it('should create a plan for an issue and return results', async () => {
            // Add a test issue
            const issue = new IssueClass(
                'test-id',
                'Test Issue',
                'Description',
                'test@example.com',
                new Date().toISOString(),
            );
            dataStore.issues.push(issue);

            const response = await request(app).post('/plan/test-id');

            expect(response.status).to.equal(200);
            expect(response.body).to.have.property('plan').that.is.a('string');

            // Check that the issue was updated
            const updatedIssue = dataStore.issues[0];
            expect(updatedIssue.plan).to.be.a('string');
        });

        it('should return 404 if issue not found', async () => {
            const response = await request(app).post('/plan/non-existent');

            expect(response.status).to.equal(404);
        });
    });
});
