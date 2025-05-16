import { Request, Response } from 'express';
import { HTTPError } from '../common/errors.js';
import { IssueClass } from '../types/issue.js';
import { dataStore } from '../db/dataStore.js';

function saveNewIssue(req: Request, res: Response): void {
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

export { saveNewIssue };
