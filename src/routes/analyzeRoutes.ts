import express from 'express';
import { analyzeIssue } from '../controllers/issueAnalysis.js';

const analyzeRouter = express.Router();

// Analyze an issue
analyzeRouter.post('/:issueId', analyzeIssue);

export { analyzeRouter };
