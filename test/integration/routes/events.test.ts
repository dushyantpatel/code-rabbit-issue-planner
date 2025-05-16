/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

// Integration tests for the events routes
import { expect } from 'chai';
import request from 'supertest';
import { createTestApp } from '../test-server.js';
import { dataStore } from '../../../src/db/dataStore.js';

describe('Events Routes', () => {
    const app = createTestApp();

    beforeEach(() => {
        // Reset the dataStore before each test
        dataStore.issues = [];
    });

    describe('POST /events', () => {
        it('should create a new issue', async () => {
            const newIssue = {
                id: 'event-1',
                title: 'New Test Issue',
                description: 'This is a test issue created from an event',
                author: 'test@example.com',
                createdAt: new Date().toISOString(),
            };

            const response = await request(app).post('/events').send(newIssue);

            expect(response.status).to.equal(200);
            expect(response.body).to.equal('OK');

            // Check that the issue was added to dataStore
            expect(dataStore.issues).to.be.an('array').with.lengthOf(1);
            expect(dataStore.issues[0].id).to.equal('event-1');
            expect(dataStore.issues[0].title).to.equal('New Test Issue');
        });

        it('should return 400 for invalid issue data', async () => {
            const invalidIssue = {
                // Missing required fields
                title: 'Invalid Issue',
            };

            const response = await request(app).post('/events').send(invalidIssue);

            expect(response.status).to.equal(400);

            // Check that no issue was added
            expect(dataStore.issues).to.be.an('array').with.lengthOf(0);
        });
    });
});
