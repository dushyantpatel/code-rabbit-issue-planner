/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

// This file sets up a test server for integration tests
import express, { Express } from 'express';
import cors from 'cors';
import { eventsRouter } from '../../src/routes/eventsRoutes.js';
import { issuesRouter } from '../../src/routes/issuesRoutes.js';
import { analyzeRouter } from '../../src/routes/analyzeRoutes.js';
import { planRouter } from '../../src/routes/planRoutes.js';

/**
 * Creates a test version of the Express application
 * without starting the server
 */
export function createTestApp(): Express {
    const app = express();

    app.use(cors());
    app.use(express.json());

    // Define routes for testing
    app.use('/events', eventsRouter);
    app.use('/issues', issuesRouter);
    app.use('/analyze', analyzeRouter);
    app.use('/plan', planRouter);

    return app;
}
