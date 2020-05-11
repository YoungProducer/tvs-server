import { Server } from 'socket.io';

export namespace SocketTransport {
    export type EmitEvent = <T = any>(eventName: string, data: T, to?: string) => void;
    export type ListenEvent = (eventName: string, cb: () => void) => void;

    export interface Controller {
        emitEvent: EmitEvent;
        listenEvent: ListenEvent;
    }
}

class SocketTransport implements SocketTransport.Controller {
    instance: Server;

    constructor(socket: Server) {
        this.instance = socket;
    }

    emitEvent: SocketTransport.EmitEvent = (eventName, data, to) => {
        if (to) {
            this.instance.to(to).emit(eventName, data);
        } else {
            this.instance.emit(eventName, data);
        }
    }

    listenEvent: SocketTransport.ListenEvent = (eventName, cb) => {
        this.instance.on(eventName, cb);
    }
}
