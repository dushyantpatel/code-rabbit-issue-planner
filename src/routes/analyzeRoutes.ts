import express from 'express';

export const analyzeRouter = express.Router();

analyzeRouter.post('/:issueId', (req, res) => {
    const { issueId } = req.params;
    res.json(`you're POST on /analyze/${issueId}`);
});
