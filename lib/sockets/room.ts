import { Server } from 'socket.io';

import { Helper } from '../utils/helpers';

export const helper = new Helper<string>();

export namespace RoomSocket {
    export interface JoinRoomPayload {
        roomId: string;
        username: string;
    }

    export interface CreateRoomPayload {
        username: string;
    }

    export interface TextChange {
        roomId: string;
        value: string;
    }
}

export class RoomSocket {
    instance: Server;
    namespaceName: string = '/rooms';

    constructor(socket: Server) {
        this.instance = socket;
    }

    socketEvents() {
        const namespace = this.instance.of(this.namespaceName);

        namespace.on('connection', async (socket) => {
            socket.on(
                'join-room',
                async ({ roomId, username }: RoomSocket.JoinRoomPayload) => {
                    const user: Helper.User = {
                        name: username,
                        socketId: socket.id,
                    };

                    const room = helper.addUserToRoom(roomId, user);

                    socket.join(roomId);

                    namespace
                        .to(roomId)
                        .emit('join-room-response', room);
                },
            );

            socket.on(
                'text-change',
                async ({ roomId, value }: RoomSocket.TextChange) => {
                    const room = helper.updateRoomData(roomId, value);

                    const newData = room.data;

                    socket
                        .broadcast
                        .to(roomId)
                        .emit('text-change-response', newData);
                },
            );
        });
    }
}
