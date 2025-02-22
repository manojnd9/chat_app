import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import user_routes from './routes/user_routes';
import message_routes from './routes/message_routes';

dotenv.config();

const app: Express = express();

const port = process.env.PORT || 3000;

// Add cors and json support
app.use(cors());
app.use(express.json());

// Add routers
app.use('/users', user_routes);
app.use('/messages', message_routes);

app.get('/', (req: Request, res: Response) => {
  res.send('Chat backend running! File Changed!');
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
