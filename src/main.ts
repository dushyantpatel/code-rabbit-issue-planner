import express from 'express';
import cors from 'cors';
import { eventsRouter } from './routes/eventsRoutes';
import { issuesRouter } from './routes/issuesRoutes';
import { analyzeRouter } from './routes/analyzeRoutes';
import { planRouter } from './routes/planRoutes';

const PORT: number = 8000;

const app = express();

app.use(cors());

app.get('/', (req, res) => {
    res.send('<h1>ReadMe here</h1>');
});

app.use('/events', eventsRouter);
app.use('/issues', issuesRouter);
app.use('/analyze', analyzeRouter);
app.use('/plan', planRouter);

app.use((req, res) => {
    // 404 endpoint not found
    res.status(404).json({ message: 'Endpoint not found. Please check the API documentation.' });
});

app.listen(PORT, () => console.log(`server connected on port ${PORT}`));
