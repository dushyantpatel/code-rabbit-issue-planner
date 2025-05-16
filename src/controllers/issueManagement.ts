import { Request, Response } from 'express';
import { dataStore } from '../db/dataStore.js';
import { HTTPError, throwHttpError } from '../common/errors.js';
import { IssueClass } from '../types/issue.js';

/**
 * Creates a new issue
 */

function createIssue(req: Request, res: Response): void {
    try {
        const issue: IssueClass = IssueClass.fromJson(req.body);
        dataStore.issues.push(issue);
        console.log(dataStore);
        res.json("you're POST on /events");
    } catch (err) {
        const statusCode = err instanceof HTTPError ? err.statusCode : 500;
        res.status(statusCode).json(err); // TODO - in prod, don't send err as it is. Make the message meaningful without giving away too much info
    }
}

/**
 * Lists all issues
 */
function listIssues(req: Request, res: Response): void {
    try {
        res.json(dataStore.issues);
    } catch (err) {
        const statusCode = err instanceof HTTPError ? err.statusCode : 500;
        res.status(statusCode).json(err);
    }
}

/**
 * Gets a single issue by ID
 */
function getIssue(req: Request, res: Response): void {
    try {
        const { issueId } = req.params;
        const issue = dataStore.issues.find((i) => i.id === issueId);

        if (!issue) {
            throwHttpError(404, `Issue ${issueId} not found`);
        }

        res.json(issue);
    } catch (err) {
        const statusCode = err instanceof HTTPError ? err.statusCode : 500;
        res.status(statusCode).json(err);
    }
}

/**
 * Updates an issue's fields
 */
function updateIssue(req: Request, res: Response): void {
    try {
        const { issueId } = req.params;
        const issueIndex = dataStore.issues.findIndex((i) => i.id === issueId);

        if (issueIndex === -1) {
            throwHttpError(404, `Issue ${issueId} not found`);
        }

        const existingIssue = dataStore.issues[issueIndex];
        const updatedIssue = { ...existingIssue, ...req.body };

        // Re-instantiate as IssueClass to ensure validation
        dataStore.issues[issueIndex] = IssueClass.fromJson(updatedIssue);

        res.json(dataStore.issues[issueIndex]);
    } catch (err) {
        const statusCode = err instanceof HTTPError ? err.statusCode : 500;
        res.status(statusCode).json(err);
    }
}

/**
 * Deletes an issue
 */
function deleteIssue(req: Request, res: Response): void {
    try {
        const { issueId } = req.params;
        const issueIndex = dataStore.issues.findIndex((i) => i.id === issueId);

        if (issueIndex === -1) {
            throwHttpError(404, `Issue ${issueId} not found`);
        }

        dataStore.issues.splice(issueIndex, 1);
        res.status(204).send();
    } catch (err) {
        const statusCode = err instanceof HTTPError ? err.statusCode : 500;
        res.status(statusCode).json(err);
    }
}

export { createIssue, listIssues, getIssue, updateIssue, deleteIssue };
