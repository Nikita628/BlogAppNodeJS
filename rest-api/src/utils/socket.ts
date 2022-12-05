import { Server } from "http";
import { Server as SocketServer } from "socket.io";
import { config } from "../config";

let io: SocketServer;

export const socket = {
  init: (server: Server) => {
    io = new SocketServer(server, { cors: { origin: `${config.uiAppUrl}` } });
    return io;
  },
  getSocketIO: () => {
    if (!io) {
        throw new Error('io is not initialized');
    }

    return io;
  }
};
