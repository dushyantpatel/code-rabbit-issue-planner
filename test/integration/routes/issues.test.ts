/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

// Integration tests for the issues routes
import { expect } from 'chai';
import request from 'supertest';
import { createTestApp } from '../test-server.js';
import { dataStore } from '../../../src/db/dataStore.js';
import { IssueClass } from '../../../src/types/issue.js';

describe('Issues Routes', () => {
    const app = createTestApp();

    beforeEach(() => {
        // Reset the dataStore before each test
        dataStore.issues = [];
    });

    describe('GET /issues', () => {
        it('should return all issues', async () => {
            // Add some test issues
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

            const response = await request(app).get('/issues');

            expect(response.status).to.equal(200);
            expect(response.body).to.be.an('array').with.lengthOf(2);
            expect(response.body[0].id).to.equal('test-1');
            expect(response.body[1].id).to.equal('test-2');
        });

        it('should return empty array when no issues exist', async () => {
            const response = await request(app).get('/issues');

            expect(response.status).to.equal(200);
            expect(response.body).to.be.an('array').with.lengthOf(0);
        });
    });

    describe('GET /issues/:issueId', () => {
        it('should return a specific issue', async () => {
            // Add a test issue
            const issue = new IssueClass(
                'test-id',
                'Test Issue',
                'Description',
                'test@example.com',
                new Date().toISOString(),
            );
            dataStore.issues.push(issue);

            const response = await request(app).get('/issues/test-id');

            expect(response.status).to.equal(200);
            expect(response.body.id).to.equal('test-id');
            expect(response.body.title).to.equal('Test Issue');
        });

        it('should return 404 if issue not found', async () => {
            const response = await request(app).get('/issues/non-existent');

            expect(response.status).to.equal(404);
        });
    });

    describe('PUT /issues/:issueId', () => {
        it('should update an issue', async () => {
            // Add a test issue
            const issue = new IssueClass(
                'test-id',
                'Original Title',
                'Original Description',
                'test@example.com',
                new Date().toISOString(),
            );
            dataStore.issues.push(issue);

            const updateData = {
                title: 'Updated Title',
                description: 'Updated Description',
            };

            const response = await request(app).put('/issues/test-id').send(updateData);

            expect(response.status).to.equal(200);
            expect(response.body.id).to.equal('test-id');
            expect(response.body.title).to.equal('Updated Title');
            expect(response.body.description).to.equal('Updated Description');

            // Check that the dataStore was updated
            expect(dataStore.issues[0].title).to.equal('Updated Title');
            expect(dataStore.issues[0].description).to.equal('Updated Description');
        });

        it('should return 404 if issue not found', async () => {
            const response = await request(app)
                .put('/issues/non-existent')
                .send({ title: 'Updated Title' });

            expect(response.status).to.equal(404);
        });
    });

    describe('DELETE /issues/:issueId', () => {
        it('should delete an issue', async () => {
            // Add a test issue
            const issue = new IssueClass(
                'test-id',
                'Test Issue',
                'Description',
                'test@example.com',
                new Date().toISOString(),
            );
            dataStore.issues.push(issue);

            const response = await request(app).delete('/issues/test-id');

            expect(response.status).to.equal(204);

            // Check that the issue was removed from dataStore
            expect(dataStore.issues).to.be.an('array').with.lengthOf(0);
        });

        it('should return 404 if issue not found', async () => {
            const response = await request(app).delete('/issues/non-existent');

            expect(response.status).to.equal(404);
        });
    });
});
