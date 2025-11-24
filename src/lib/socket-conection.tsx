import { io, Socket } from "socket.io-client";

const SOCKET_URL = "http://31.97.222.97:8000"; // replace this

// export const socket: Socket = io(
//   `${SOCKET_URL}?userId=68b29d4fdbe72fea7e760a2d`,
//   {
//     transports: ["websocket"],
//     autoConnect: false,
//   },
// );

export const createSocket = (userId: string): Socket => {
  return io(SOCKET_URL, {
    transports: ["websocket"],
    autoConnect: false,
    query: {
      userId, // 👈 sending userId to backend
    },
  });
};
