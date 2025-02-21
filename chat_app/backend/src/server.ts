import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app: Express = express();

const port = process.env.PORT || 3000;

// Add cors and json support
app.use(cors());
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send('Chat backend running! File Changed!');
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
