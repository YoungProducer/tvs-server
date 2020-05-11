import { Server, Client } from 'socket.io';

import { Helper } from '../utils/helpers';
import { SocketTransport } from '../utils/socket-transport';

const helper = new Helper<string>();

export namespace RoomSocket {
    export interface JoinRoomCbPayload {
        roomId: string;
        user: string;
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
                'create-room',
                async ({ username }: RoomSocket.CreateRoomPayload) => {
                    const newRoom = helper.addRoom({
                        name: username,
                        socketId: socket.id,
                    });

                    socket.join(newRoom.id);

                    this.instance
                        .of('/rooms')
                        .to(socket.id)
                        .emit(
                            'create-room-response',
                            newRoom.id,
                        );
                });
        });
    }
}
