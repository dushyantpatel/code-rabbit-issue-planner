import express from 'express';

export const issuesRouter = express.Router();

issuesRouter.get('/', (req, res) => {
    res.json("you're GET on /issues");
});

issuesRouter.get('/:issueId', (req, res) => {
    const { issueId } = req.params;
    res.json(`you're GET on /issues/${issueId}`);
});
