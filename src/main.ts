import express from 'express';
import cors from 'cors';
import { eventsRouter } from './routes/eventsRoutes.js';
import { issuesRouter } from './routes/issuesRoutes.js';
import { analyzeRouter } from './routes/analyzeRoutes.js';
import { planRouter } from './routes/planRoutes.js';
import config from './config.json' with { type: 'json' };
import { htmlReadmeContent } from './readme.js';

const PORT: number = config.apiPort;
const default404Message = 'Endpoint not found. Please check the API documentation.';

const app = express();

app.use(cors());

// Serve README as HTML at root
app.get('/', (req, res) => {
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
    res.status(404).json({ message: default404Message });
});

// start server
app.listen(PORT, () => {
    console.log(`server connected on port ${PORT.toString()}`);
});
