import express from 'express';
import { createIssue } from '../controllers/issueManagement.js';

const eventsRouter = express.Router();

// Create a new issue
eventsRouter.post('/', createIssue);

export { eventsRouter };
