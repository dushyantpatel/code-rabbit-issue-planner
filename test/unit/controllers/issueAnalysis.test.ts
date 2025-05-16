/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

// Unit tests for the issueAnalysis controller
import { expect } from 'chai';
import { Request, Response } from 'express';
import sinon from 'sinon';
import { analyzeIssue, planIssue } from '../../../src/controllers/issueAnalysis.js';
import { dataStore } from '../../../src/db/dataStore.js';
import { IssueClass } from '../../../src/types/issue.js';

describe('Issue Analysis Controller', () => {
    // Setup mock request and response objects
    let req: Partial<Request>;
    let res: Partial<Response>;
    let statusStub: sinon.SinonStub;
    let jsonStub: sinon.SinonStub;

    beforeEach(() => {
        // Reset the issues array before each test
        dataStore.issues = [];

        // Create mock request and response
        req = {};
        jsonStub = sinon.stub();
        statusStub = sinon.stub().returns({ json: jsonStub });
        res = {
            json: jsonStub,
            status: statusStub,
        };
    });

    afterEach(() => {
        sinon.restore();
    });

    describe('analyzeIssue', () => {
        it('should analyze an issue and update it with results', async () => {
            // Add test issue to dataStore
            const issue = new IssueClass(
                'test-id',
                'Test Title',
                'Test Description',
                'test@example.com',
                new Date().toISOString(),
            );
            dataStore.issues.push(issue);

            // Setup request parameters
            req.params = { issueId: 'test-id' };

            // Call the function
            await analyzeIssue(req as Request, res as Response);

            // Check json was called
            expect(jsonStub.calledOnce).to.be.true;

            // Check that the issue was updated
            const updatedIssue = dataStore.issues[0];
            expect(updatedIssue.labels).to.be.a('string');
            expect(updatedIssue.assignedTo).to.be.a('string');
            expect(updatedIssue.confidence).to.be.a('number');
            expect(['low', 'medium', 'high']).to.include(updatedIssue.priority);
        });

        it('should return 404 if issue not found', async () => {
            // Setup request with non-existent ID
            req.params = { issueId: 'non-existent' };

            // Call the function
            await analyzeIssue(req as Request, res as Response);

            // Check status code set to 404
            expect(statusStub.calledWith(404)).to.be.true;
        });
    });

    describe('planIssue', () => {
        it('should plan an issue and update it with plan', async () => {
            // Add test issue to dataStore
            const issue = new IssueClass(
                'test-id',
                'Test Title',
                'Test Description',
                'test@example.com',
                new Date().toISOString(),
            );
            dataStore.issues.push(issue);

            // Setup request parameters
            req.params = { issueId: 'test-id' };

            // Call the function
            await planIssue(req as Request, res as Response);

            // Check json was called
            expect(jsonStub.calledOnce).to.be.true;

            // Check that the issue was updated with a plan
            const updatedIssue = dataStore.issues[0];
            expect(updatedIssue.plan).to.be.a('string');
            expect(updatedIssue.plan).to.not.be.empty;
        });

        it('should return 404 if issue not found', async () => {
            // Setup request with non-existent ID
            req.params = { issueId: 'non-existent' };

            // Call the function
            await planIssue(req as Request, res as Response);

            // Check status code set to 404
            expect(statusStub.calledWith(404)).to.be.true;
        });
    });
});
