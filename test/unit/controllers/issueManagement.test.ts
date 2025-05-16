/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

// Unit tests for the issueManagement controller
import { expect } from 'chai';
import { Request, Response } from 'express';
import sinon from 'sinon';
import {
    createIssue,
    listIssues,
    getIssue,
    updateIssue,
    deleteIssue,
} from '../../../src/controllers/issueManagement.js';
import { dataStore } from '../../../src/db/dataStore.js';
import { Issue, IssueClass } from '../../../src/types/issue.js';

describe('Issue Management Controller', () => {
    // Setup mock request and response objects
    let req: Partial<Request>;
    let res: Partial<Response>;
    let statusStub: sinon.SinonStub;
    let jsonStub: sinon.SinonStub;
    let sendStub: sinon.SinonStub;

    beforeEach(() => {
        // Reset the issues array before each test
        dataStore.issues = [];

        // Create mock request and response
        req = {};
        jsonStub = sinon.stub();
        sendStub = sinon.stub();
        statusStub = sinon.stub().returns({ json: jsonStub, send: sendStub });
        res = {
            json: jsonStub,
            status: statusStub,
        };
    });

    afterEach(() => {
        sinon.restore();
    });

    describe('createIssue', () => {
        it('should create a new issue and return OK', () => {
            // Setup request body
            req.body = {
                id: 'test-123',
                title: 'Test Issue',
                description: 'Test Description',
                author: 'test@example.com',
                createdAt: new Date().toISOString(),
            };

            // Call the function
            createIssue(req as Request, res as Response);

            // Check that json was called with 'OK'
            expect(jsonStub.calledWith('OK')).to.be.true;

            // Check that the issue was added to dataStore
            expect(dataStore.issues.length).to.equal(1);
            expect(dataStore.issues[0].id).to.equal('test-123');
        });

        it('should handle errors and return correct status code', () => {
            // Setup invalid request body
            req.body = {
                // Missing required fields
                title: 'Test Issue',
            };

            // Call the function
            createIssue(req as Request, res as Response);

            // Check status code set to 400 (Bad Request)
            expect(statusStub.calledWith(400)).to.be.true;

            // Check no issue was added
            expect(dataStore.issues.length).to.equal(0);
        });
    });

    describe('listIssues', () => {
        it('should return an array of all issues', () => {
            // Add test issues to dataStore
            const issue1 = new IssueClass(
                'test-1',
                'Test 1',
                'Description 1',
                'test@example.com',
                new Date().toISOString(),
            );
            const issue2 = new IssueClass(
                'test-2',
                'Test 2',
                'Description 2',
                'test@example.com',
                new Date().toISOString(),
            );
            dataStore.issues.push(issue1, issue2);

            // Call the function
            listIssues(req as Request, res as Response);

            // Check json was called with the issues array
            expect(jsonStub.calledOnce).to.be.true;
            const responseData = jsonStub.firstCall.args[0];
            expect(responseData).to.be.an('array').with.lengthOf(2);
            expect(responseData[0].id).to.equal('test-1');
            expect(responseData[1].id).to.equal('test-2');
        });
    });

    describe('getIssue', () => {
        it('should return a specific issue by ID', () => {
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
            getIssue(req as Request, res as Response);

            // Check json called with correct issue
            expect(jsonStub.calledOnce).to.be.true;
            const responseData = jsonStub.firstCall.args[0];
            expect(responseData.id).to.equal('test-id');
            expect(responseData.title).to.equal('Test Title');
        });

        it('should return 404 if issue not found', () => {
            // Setup request with non-existent ID
            req.params = { issueId: 'non-existent' };

            // Call the function
            getIssue(req as Request, res as Response);

            // Check status code set to 404
            expect(statusStub.calledWith(404)).to.be.true;
        });
    });

    describe('updateIssue', () => {
        it('should update an issue and return the updated version', () => {
            // Add test issue to dataStore
            const issue = new IssueClass(
                'test-id',
                'Original Title',
                'Original Description',
                'test@example.com',
                new Date().toISOString(),
            );
            dataStore.issues.push(issue);

            // Setup request
            req.params = { issueId: 'test-id' };
            req.body = { title: 'Updated Title' };

            // Call the function with proper typing
            updateIssue(
                req as Request<{ issueId: string }, unknown, Partial<Issue>>,
                res as Response,
            );

            // Check json called with updated issue
            expect(jsonStub.calledOnce).to.be.true;
            const responseData = jsonStub.firstCall.args[0];
            expect(responseData.id).to.equal('test-id');
            expect(responseData.title).to.equal('Updated Title');

            // Check dataStore was updated
            expect(dataStore.issues[0].title).to.equal('Updated Title');
        });

        it('should return 404 if issue not found', () => {
            // Setup request with non-existent ID
            req.params = { issueId: 'non-existent' };
            req.body = { title: 'Updated Title' };

            // Call the function with proper typing
            updateIssue(
                req as Request<{ issueId: string }, unknown, Partial<Issue>>,
                res as Response,
            );

            // Check status code set to 404
            expect(statusStub.calledWith(404)).to.be.true;
        });
    });

    describe('deleteIssue', () => {
        it('should delete an issue and return 204 status', () => {
            // Add test issue to dataStore
            const issue = new IssueClass(
                'test-id',
                'Test Title',
                'Test Description',
                'test@example.com',
                new Date().toISOString(),
            );
            dataStore.issues.push(issue);

            // Setup request
            req.params = { issueId: 'test-id' };

            // Call the function
            deleteIssue(req as Request, res as Response);

            // Check status code set to 204
            expect(statusStub.calledWith(204)).to.be.true;

            // Check issue was removed from dataStore
            expect(dataStore.issues.length).to.equal(0);
        });

        it('should return 404 if issue not found', () => {
            // Setup request with non-existent ID
            req.params = { issueId: 'non-existent' };

            // Call the function
            deleteIssue(req as Request, res as Response);

            // Check status code set to 404
            expect(statusStub.calledWith(404)).to.be.true;
        });
    });
});
