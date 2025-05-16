import express, { Request, Response } from 'express';
import { saveNewIssue } from '../controllers/saveNewIssue.js';

const eventsRouter = express.Router();

eventsRouter.post('/', saveNewIssue);

export { eventsRouter };
