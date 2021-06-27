import express, {Request, Response} from 'express';
import userRouter from './api/routes/user.routes'

const app = express();
const port = 8000;

app.use(express.urlencoded({extended: false}));
app.use(express.json());

app.use('/user', userRouter);

app.use('/', (req: Request, res: Response) => {
    res.status(404).send('ERROR 404 not found');
});

app.listen(port, () => {
    console.log(`app listen on port ${port}`);
});

