import { Request, Response } from 'express';
import { dataStore } from '../db/dataStore.js';
import { HTTPError, throwHttpError } from '../common/errors.js';
import { MockLLMClient } from '../services/mockLLMClient.js';

// Create a singleton instance of the LLM client
const llmClient = new MockLLMClient();

/**
 * Analyzes an issue using the LLM client and updates the issue with the analysis results
 */
async function analyzeIssue(req: Request, res: Response): Promise<void> {
    try {
        const { issueId } = req.params;
        const issue = dataStore.issues.find((i) => i.id === issueId);

        if (!issue) {
            throwHttpError(404, `Issue ${issueId} not found`);
        }

        const analysis = await llmClient.analyzeIssue(issue);

        // Update the issue with the analysis results
        issue.labels = analysis.labels.join(',');
        issue.assignedTo = analysis.assignedTo;
        issue.confidence = analysis.confidence;
        issue.priority = analysis.priority;

        res.json(analysis);
    } catch (err) {
        const statusCode = err instanceof HTTPError ? err.statusCode : 500;
        res.status(statusCode).json(err);
    }
}

/**
 * Generates a plan for an issue using the LLM client and updates the issue
 */
async function planIssue(req: Request, res: Response): Promise<void> {
    try {
        const { issueId } = req.params;
        const issue = dataStore.issues.find((i) => i.id === issueId);

        if (!issue) {
            throwHttpError(404, `Issue ${issueId} not found`);
        }

        const planResponse = await llmClient.planIssue(issue);

        // Update the issue with the plan
        issue.plan = planResponse.plan;

        res.json(planResponse);
    } catch (err) {
        const statusCode = err instanceof HTTPError ? err.statusCode : 500;
        res.status(statusCode).json(err);
    }
}

export { analyzeIssue, planIssue };
