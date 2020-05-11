import { Router, Request, Response, NextFunction } from 'express';

import { helper } from '../../sockets/room';

const router = Router();

interface AddRoomRequestBody {
    roomName: string;
}

router
    .post(
        '/room',
        async (req: Request, res: Response, next: NextFunction) => {
            const body: AddRoomRequestBody = req.body;

            const createdRoom = helper.addRoom(body.roomName);

            res.status(201).send({
                room: {
                    id: createdRoom.id,
                    name: createdRoom.name,
                },
            });
        },
    );

export { router as room };
