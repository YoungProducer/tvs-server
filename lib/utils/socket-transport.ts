import { Server, Namespace } from 'socket.io';

export namespace SocketTransport {
    export type EmitEvent = <T = any>(eventName: string, data: T, to?: string) => void;
    export type ListenEvent = (
        eventName: string,
        cb: (...args: any) => void | Promise<void>,
    ) => void;
    export type UseNamespace = (name: string) => void;
    export type EmitEventToNamespace = <T = any>(
        namespaceName: string,
        eventName: string,
        data: T,
        to?: string,
    ) => void;
    export type ListenEventOfNamespace = (
        namespaceName: string,
        eventName: string,
        cb: (...args: any) => void | Promise<void>,
        to?: string,
    ) => void;

    export interface Controller {
        instance: Server;
        emitEvent: EmitEvent;
        listenEvent: ListenEvent;
        useNamespace: UseNamespace;
        emitEventToNamespace: EmitEventToNamespace;
        listenEventOfNamespace: ListenEventOfNamespace;
    }
}

export class SocketTransport implements SocketTransport.Controller {
    instance: Server;
    namespaces: Namespace[];
    private ableToUseNamespace: boolean = false;

    constructor(socket: Server) {
        this.instance = socket;
        this.namespaces = [];
    }

    useNamespace: SocketTransport.UseNamespace = (name) => {
        const newNamespace = this.instance.of(name);
        this.namespaces.push(newNamespace);
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

    emitEventToNamespace: SocketTransport.EmitEventToNamespace = (
        namespaceName,
        eventName,
        data,
        to,
    ) => {
        const namespaceIntance = this.namespaces.find(namespace =>
            namespace.name = namespaceName);

        if (to && namespaceIntance) {
            namespaceIntance.to(to).emit(eventName, data);
        } else if (!to && namespaceIntance) {
            namespaceIntance.emit(eventName, data);
        }
    }

    listenEventOfNamespace: SocketTransport.ListenEventOfNamespace = (
        namespaceName,
        eventName,
        cb,
        to,
    ) => {
        const namespaceIntance = this.namespaces.find(namespace =>
            namespace.name = namespaceName);

        if (to && namespaceIntance) {
            namespaceIntance.to(to).on(eventName, cb);
        } else if (!to && namespaceIntance) {
            namespaceIntance.on(eventName, cb);
        }
    }
}
