import { io, Socket } from "socket.io-client";

export interface ServerToClientEvents {
    welcome: (data: { message: string }) => void;
    chat_message: (data: { user: string; message: string }) => void;
}

export interface ClientToServerEvents {
    chat_message: (data: { user: string; message: string }) => void;
}

const URL = import.meta.env.VITE_API_URL;
console.log(URL)

export const socket: Socket = io(URL, {
    autoConnect: false,
    transports: ["websocket"]
});