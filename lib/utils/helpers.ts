import { v4 as uuidv4 } from 'uuid';

import { makeId } from './make-id';

export namespace Helper {
    export interface User {
        name: string;
        socketId: string;
    }

    export interface Room<T> {
        id: string;
        name: string;
        users: User[];
        data?: T;
    }

    export type AddRoom<T = any> = (name: string) => Room<T>;
    export type RemoveRoom = (roomId: string) => void;
    export type AddUserToRoom = (roomId: string, user: User) => void;
    export type UpdateRoomData<T = any> = (roomId: string, data: T) => Room<T>;
    export type RemoveUserFromRoom = (roomId: string, username: string) => void;

    /** RD - type of Room Data */
    export interface Controller {
        addRoom: AddRoom;
        removeRoom: RemoveRoom;
        addUserToRoom: AddUserToRoom;
        removeUserFromRoom: RemoveUserFromRoom;
        updateRoomData: UpdateRoomData;
    }
}

export class Helper<RD = any> implements Helper.Controller {
    rooms: Helper.Room<RD>[] = [];

    addRoom: Helper.AddRoom<RD> = (name) => {
        const roomId = uuidv4();

        const newRoom: Helper.Room<RD> = {
            name,
            id: roomId,
            users: [],
        };

        this.rooms.push(newRoom);

        return newRoom;
    }

    removeRoom: Helper.RemoveRoom = (roomId) => {
        const rooms = this.rooms;

        this.rooms = rooms.reduce((acc, curr) => {
            if (curr.id === roomId) return acc;
            return [...acc, curr];
        }, [] as Helper.Room<RD>[]);
    }

    addUserToRoom: Helper.AddUserToRoom = (roomId, user) => {
        const roomIndex = this.rooms.findIndex(room => room.id === roomId);

        const room = this.rooms[roomIndex];
        room.users.push(user);

        this.rooms[roomIndex] = room;

        return room;
    }

    removeUserFromRoom: Helper.RemoveUserFromRoom = (roomId, username) => {
        const roomIndex = this.rooms.findIndex(room => room.id === roomId);
        const users = this.rooms[roomIndex].users;

        this.rooms[roomIndex].users = users.reduce((acc, curr) => {
            if (curr.name === username) return acc;
            return [...acc, curr];
        }, [] as Helper.User[]);
    }

    updateRoomData: Helper.UpdateRoomData<RD> = (roomId, data) => {
        const roomIndex = this.rooms.findIndex(room => room.id === roomId);
        const room = this.rooms[roomIndex];

        room.data = data;

        this.rooms[roomIndex] = room;

        return room;
    }
}
