import express from 'express';

export const planRouter = express.Router();

planRouter.post('/:issueId', (req, res) => {
    const { issueId } = req.params;
    res.json(`you're POST on /plan/${issueId}`);
});
