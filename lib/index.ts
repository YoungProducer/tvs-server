import express, { Request, NextFunction, Response } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import socket from 'socket.io';
import { Server } from 'http';
import dotenv from 'dotenv';

import { appRouter } from './routes';
import { RoomSocket } from './sockets/room';
import { parseEnv, EnvConfigInput } from './utils/parse-env';

const app: express.Application = express();
export const server = new Server(app);
export const io = socket(server);

const corsOptions = {
    origin: 'http://localhost:3000',
    methods: ["POST"],
    credentials: true,
    maxAge: 3600,
};

const envConfig = dotenv.config() as EnvConfigInput;

parseEnv(app, envConfig);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors(corsOptions));

app.use('/', appRouter);

app.get('/', async (req: Request, res: Response, next: NextFunction) => {
    res.status(200).send('Hello world!');
});

new RoomSocket(io).socketEvents();

export { app };
