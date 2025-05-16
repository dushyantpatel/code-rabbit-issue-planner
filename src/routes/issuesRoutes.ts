import express from 'express';
import { listIssues, getIssue, updateIssue, deleteIssue } from '../controllers/issueManagement.js';

const issuesRouter = express.Router();

// Get all issues
issuesRouter.get('/', listIssues);

// Get a specific issue
issuesRouter.get('/:issueId', getIssue);

// Update an issue
issuesRouter.put('/:issueId', updateIssue);

// Delete an issue
issuesRouter.delete('/:issueId', deleteIssue);

export { issuesRouter };
