import express from 'express';

export const eventsRouter = express.Router();

eventsRouter.post('/', (req, res) => {
    res.json("you're POST on /events");
});
