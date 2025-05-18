import express from 'express';
import cors from 'cors';
import { eventsRouter } from './routes/eventsRoutes.js';
import { issuesRouter } from './routes/issuesRoutes.js';
import { analyzeRouter } from './routes/analyzeRoutes.js';
import { planRouter } from './routes/planRoutes.js';
import config from './common/configLoader.js';
import { htmlReadmeContent } from './readme.js';
import { log, httpLogger } from './common/logger.js';

const PORT: number = config.apiPort;
const default404Message = 'Endpoint not found. Please check the API documentation.';

const app = express();

app.use(cors());

// Add HTTP request logging middleware
app.use(httpLogger);

// Log all uncaught exceptions
process.on('uncaughtException', (error) => {
    log.error(`Uncaught Exception: ${error.message}`, 'Process');
    log.error(error.stack ?? '', 'Process');
    process.exit(1);
});

// Log unhandled promise rejections
process.on('unhandledRejection', (reason: unknown) => {
    log.error(`Unhandled Rejection, reason: ${String(reason)}`, 'Process');
    process.exit(1);
});

// Serve README as HTML at root
app.get('/', (req, res) => {
    log.info('Serving README at root', 'Router');
    res.type('html').send(htmlReadmeContent);
});

// json payloads
app.use(express.json());

// define routers for each route
app.use('/events', eventsRouter);
app.use('/issues', issuesRouter);
app.use('/analyze', analyzeRouter);
app.use('/plan', planRouter);

// catch all requests sent to invalid endpoints
app.use((req, res) => {
    // 404 endpoint not found
    log.warn(`404 Not Found: ${req.originalUrl}`, 'Router');
    res.status(404).json({ message: default404Message });
});

// start server
app.listen(PORT, () => {
    log.info(`Server started and listening on port ${PORT.toString()}`, 'Server');
});
