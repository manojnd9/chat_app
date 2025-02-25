/** Contains functions for server initialisation and launch.*/

import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import http from 'http';

import user_routes from './routes/user_routes';
import message_routes from './routes/message_routes';

import { initialise_websocket } from './wesocket';
import { seed_users } from './utils/seed_users';

dotenv.config();

const app = express();

const port = process.env.PORT || 3000;

// Add cors and json support
app.use(cors());
app.use(express.json());

// Add rest api routes
app.use('/users', user_routes);
app.use('/messages', message_routes);

// Create a http server and attach socket.io
const server = http.createServer(app);
initialise_websocket(server);

// check seed user creation and then start sever
seed_users().then(() => {
    app.get('/', (req: Request, res: Response) => {
        res.send('Chat backend is running!');
    });

    server.listen(port, () => {
        console.log(`Server is running at http://localhost:${port}`);
    });
});
