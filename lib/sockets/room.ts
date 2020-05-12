import { Server, Client } from 'socket.io';

import { Helper } from '../utils/helpers';
import { SocketTransport } from '../utils/socket-transport';

export const helper = new Helper<string>();

export namespace RoomSocket {
    export interface JoinRoomPayload {
        roomId: string;
        username: string;
    }

    export interface CreateRoomPayload {
        username: string;
    }
}

export class RoomSocket {
    // socketTransport!: SocketTransport.Controller;
    instance: Server;
    namespaceName: string = '/rooms';

    constructor(socket: Server) {
        this.instance = socket;
        // this.socketTransport = new SocketTransport(socket);
        // this.socketTransport.useNamespace('/room');
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
        });
    }
}
