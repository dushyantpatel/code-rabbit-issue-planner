import { Request, Response } from 'express';
import { dataStore } from '../db/dataStore.js';
import { HTTPError, throwHttpError } from '../common/errors.js';
import { Issue, IssueClass } from '../types/issue.js';
import { log } from '../common/logger.js';

/**
 * Creates a new issue
 */
function createIssue(req: Request, res: Response): void {
    try {
        log.info('Creating new issue', 'issueManagement');
        const issue: IssueClass = IssueClass.fromJson(req.body);
        dataStore.issues.push(issue);
        log.info(`Issue created with ID: ${issue.id}`, 'issueManagement');
        res.json('OK');
    } catch (err) {
        const statusCode = err instanceof HTTPError ? err.statusCode : 500;
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        log.error(`Failed to create issue: ${errorMessage}`, 'issueManagement');
        res.status(statusCode).json(err); // TODO - in prod, don't send err as it is. Make the message meaningful without giving away too much info
    }
}

/**
 * Lists all issues
 */
function listIssues(req: Request, res: Response): void {
    try {
        log.info('Listing all issues', 'issueManagement');
        res.json(dataStore.issues);
        log.debug(`Returned ${dataStore.issues.length.toString()} issues`, 'issueManagement');
    } catch (err) {
        const statusCode = err instanceof HTTPError ? err.statusCode : 500;
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        log.error(`Failed to list issues: ${errorMessage}`, 'issueManagement');
        res.status(statusCode).json(err);
    }
}

/**
 * Gets a single issue by ID
 */
function getIssue(req: Request, res: Response): void {
    try {
        const { issueId } = req.params;
        log.info(`Getting issue with ID: ${issueId}`, 'issueManagement');

        const issue = dataStore.issues.find((i) => i.id === issueId);

        if (!issue) {
            log.warn(`Issue ${issueId} not found`, 'issueManagement');
            throwHttpError(404, `Issue ${issueId} not found`);
        }

        log.debug(`Successfully retrieved issue: ${issueId}`, 'issueManagement');
        res.json(issue);
    } catch (err) {
        const statusCode = err instanceof HTTPError ? err.statusCode : 500;
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        log.error(`Failed to get issue: ${errorMessage}`, 'issueManagement');
        res.status(statusCode).json(err);
    }
}

/**
 * Updates an issue's fields
 */
function updateIssue(
    req: Request<{ issueId: string }, unknown, Partial<Issue>>,
    res: Response,
): void {
    try {
        const { issueId } = req.params;
        log.info(`Updating issue with ID: ${issueId}`, 'issueManagement');

        const issueIndex = dataStore.issues.findIndex((i) => i.id === issueId);

        if (issueIndex === -1) {
            log.warn(`Issue ${issueId} not found for update`, 'issueManagement');
            throwHttpError(404, `Issue ${issueId} not found`);
        }

        const existingIssue = dataStore.issues[issueIndex];
        // Get raw data from existing issue and update with new values
        const currentData = existingIssue.toJSON();
        const updatedData = {
            ...currentData,
            ...req.body,
            id: issueId, // prevent ID from being changed
        };

        // Re-instantiate as IssueClass to ensure validation
        dataStore.issues[issueIndex] = IssueClass.fromJson(updatedData);

        log.info(`Successfully updated issue: ${issueId}`, 'issueManagement');
        log.debug(`Updated issue data: ${JSON.stringify(req.body)}`, 'issueManagement');
        res.json(dataStore.issues[issueIndex]);
    } catch (err) {
        const statusCode = err instanceof HTTPError ? err.statusCode : 500;
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        log.error(`Failed to update issue: ${errorMessage}`, 'issueManagement');
        res.status(statusCode).json(err);
    }
}

/**
 * Deletes an issue
 */
function deleteIssue(req: Request, res: Response): void {
    try {
        const { issueId } = req.params;
        log.info(`Deleting issue with ID: ${issueId}`, 'issueManagement');

        const issueIndex = dataStore.issues.findIndex((i) => i.id === issueId);

        if (issueIndex === -1) {
            log.warn(`Issue ${issueId} not found for deletion`, 'issueManagement');
            throwHttpError(404, `Issue ${issueId} not found`);
        }

        dataStore.issues.splice(issueIndex, 1);
        log.info(`Successfully deleted issue: ${issueId}`, 'issueManagement');
        res.status(204).send();
    } catch (err) {
        const statusCode = err instanceof HTTPError ? err.statusCode : 500;
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        log.error(`Failed to delete issue: ${errorMessage}`, 'issueManagement');
        res.status(statusCode).json(err);
    }
}

export { createIssue, listIssues, getIssue, updateIssue, deleteIssue };
