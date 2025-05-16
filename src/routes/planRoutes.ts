import express from 'express';
import { planIssue } from '../controllers/issueAnalysis.js';

const planRouter = express.Router();

// Plan an issue
planRouter.post('/:issueId', planIssue);

export { planRouter };
