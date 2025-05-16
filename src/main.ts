import express from 'express';
import cors from 'cors';

const PORT: number = 8000;

const app = express();
app.use(cors());

app.get('/', (req, res) => {
    res.send('<h1>Something here</h1>');
});

app.listen(PORT, () => console.log(`server connected on port ${PORT}`));
