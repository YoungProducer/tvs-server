import express, { Request, NextFunction, Response } from 'express';
import bodyParser from 'body-parser';
import socket from 'socket.io';
import { Server } from 'http';
import dotenv from 'dotenv';

import { appRouter } from './routes';
import { RoomSocket } from './sockets/room';
import { parseEnv, EnvConfigInput } from './utils/parse-env';

const app: express.Application = express();
export const server = new Server(app);
export const io = socket(server);

const envConfig = dotenv.config() as EnvConfigInput;

parseEnv(app, envConfig);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/', appRouter);

app.get('/', async (req: Request, res: Response, next: NextFunction) => {
    res.status(200).send('Hello world!');
});

new RoomSocket(io).socketEvents();

export { app };
