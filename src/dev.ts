import { ServerWebSocket } from "bun";

declare global {
  var count: number;
  var sockets: Set<ServerWebSocket<unknown>>;
}

export const WATCH = process.env.WATCH === "true";

if (WATCH) {
  globalThis.sockets ??= new Set<ServerWebSocket<unknown>>();
  globalThis.count ??= 0;
  globalThis.count++;

  if (globalThis.count !== 0) {
    globalThis.sockets.forEach((socket) => {
      setTimeout(() => {
        socket.send("refresh");
      }, 100);
    });

    globalThis.count = 0;
  }
}

export const devWebsocket = WATCH
  ? {
      open(socket: ServerWebSocket<unknown>) {
        globalThis.sockets.add(socket);
      },
      message() {
        //
      },
      close(socket: ServerWebSocket<unknown>) {
        globalThis.sockets.delete(socket);
      },
    }
  : undefined;
