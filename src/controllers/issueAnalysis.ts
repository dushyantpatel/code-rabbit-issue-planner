import { Request, Response } from 'express';
import { dataStore } from '../db/dataStore.js';
import { HTTPError, throwHttpError } from '../common/errors.js';
import { LLMClientFactory } from '../services/llmClientFactory.js';
import { log } from '../common/logger.js';

// Create a singleton instance of the LLM client using the factory
const llmClient = LLMClientFactory.createClient();

/**
 * Analyzes an issue using the LLM client and updates the issue with the analysis results
 */
async function analyzeIssue(req: Request, res: Response): Promise<void> {
    try {
        const { issueId } = req.params;
        log.info(`Analyzing issue with ID: ${issueId}`, 'issueAnalysis');

        const issue = dataStore.issues.find((i) => i.id === issueId);

        if (!issue) {
            log.warn(`Issue ${issueId} not found for analysis`, 'issueAnalysis');
            throwHttpError(404, `Issue ${issueId} not found`);
        }

        log.info(`Requesting analysis from LLM client for issue: ${issueId}`, 'issueAnalysis');
        const analysis = await llmClient.analyzeIssue(issue);
        log.debug(`Received analysis from LLM: ${JSON.stringify(analysis)}`, 'issueAnalysis');

        // Update the issue with the analysis results
        log.info(`Updating issue ${issueId} with analysis results`, 'issueAnalysis');
        issue.labels = analysis.labels.join(',');
        issue.assignedTo = analysis.assignedTo;
        issue.confidence = analysis.confidence;
        issue.priority = analysis.priority;

        log.info(`Analysis completed for issue: ${issueId}`, 'issueAnalysis');
        res.json(analysis);
    } catch (err) {
        const statusCode = err instanceof HTTPError ? err.statusCode : 500;
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        log.error(`Analysis failed: ${errorMessage}`, 'issueAnalysis');
        res.status(statusCode).json(err);
    }
}

/**
 * Generates a plan for an issue using the LLM client and updates the issue
 */
async function planIssue(req: Request, res: Response): Promise<void> {
    try {
        const { issueId } = req.params;
        log.info(`Planning issue with ID: ${issueId}`, 'issueAnalysis');

        const issue = dataStore.issues.find((i) => i.id === issueId);

        if (!issue) {
            log.warn(`Issue ${issueId} not found for planning`, 'issueAnalysis');
            throwHttpError(404, `Issue ${issueId} not found`);
        }

        log.info(`Requesting plan from LLM client for issue: ${issueId}`, 'issueAnalysis');
        const planResponse = await llmClient.planIssue(issue);
        log.debug(`Received plan from LLM: ${JSON.stringify(planResponse)}`, 'issueAnalysis');

        // Update the issue with the plan
        log.info(`Updating issue ${issueId} with plan`, 'issueAnalysis');
        issue.plan = planResponse.plan;

        log.info(`Planning completed for issue: ${issueId}`, 'issueAnalysis');
        res.json(planResponse);
    } catch (err) {
        const statusCode = err instanceof HTTPError ? err.statusCode : 500;
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        log.error(`Planning failed: ${errorMessage}`, 'issueAnalysis');
        res.status(statusCode).json(err);
    }
}

export { analyzeIssue, planIssue };
