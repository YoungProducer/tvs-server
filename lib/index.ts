import express, { Request, NextFunction, Response } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import socket from 'socket.io';
import { Server } from 'http';

import { appRouter } from './routes';
import { RoomSocket } from './sockets/room';

const app: express.Application = express();
export const server = new Server(app);
export const io = socket(server);

const corsOptions = {
    origin: ['http://localhost:3000', 'https://tvs-client.000webhostapp.com/dashboard'],
    methods: ["POST"],
    credentials: true,
    maxAge: 3600,
};

console.log(process.env.PORT);

app.set('PORT', process.env.PORT);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors(corsOptions));

app.use('/', appRouter);

app.get('/', async (req: Request, res: Response, next: NextFunction) => {
    res.status(200).send('Hello world!');
});

new RoomSocket(io).socketEvents();

export { app };
