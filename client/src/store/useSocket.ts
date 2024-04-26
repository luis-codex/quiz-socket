import { io, type Socket } from 'socket.io-client';
import { create } from 'zustand';


export type Auth = {
    id: string;
    avatarUrl: string;
    name: string;
    roomId: string;
    timeLimit: number;
}

interface State {
    socket: Socket | null,
    setCredentials: (auth: Auth) => void,

    getAuth: () => Auth | null,
}

const isProduction = process.env.NODE_ENV === 'production';

export const useSocket = create<State>((set, get) => ({
    socket: null,
    setCredentials: (auth) => {
        const socket = auth ? io(isProduction ?
            window.location.origin
            : 'http://localhost:3000', { auth }) : null;
        set({ socket })
    },
    getAuth: () => {
        return get().socket?.auth as Auth | null;
    }
}))