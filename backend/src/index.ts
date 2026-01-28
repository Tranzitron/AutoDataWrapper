import express, {Application, Request, Response} from 'express';
import router from './routes';
import cors from 'cors';

const app: Application = express();
const port = process.env.PORT || 3000;

app.use(cors());

app.get('/', (req: Request, res: Response) => {
    res.send('Welcome to Express & TypeScript Server!');
});

app.use('/', router);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
