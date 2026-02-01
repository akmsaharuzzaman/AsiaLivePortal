import { io, Socket } from "socket.io-client";

const BASE_URL = "http://69.62.74.36:8000";

let socketInstance: Socket | null = null;

/**
 * Initialize or re-initialize the socket connection with a userId.
 * If already initialized, the existing socket is disconnected first.
 * @param userId - required user identifier appended as a query param
 */
export function initSocket(userId: string, autoConnect = true): Socket {
  if (!userId || typeof userId !== "string" || userId.trim().length === 0) {
    throw new Error("initSocket requires a non-empty userId string");
  }

  // If we already have a socket, tear it down so callers can re-init with a new id
  if (socketInstance) {
    try {
      socketInstance.removeAllListeners();
      socketInstance.disconnect();
    } catch (err) {
      // best-effort
      console.warn("Failed to cleanly disconnect previous socket", err);
    }
    socketInstance = null;
  }

  // Append userId as query parameter exactly as the backend expects
  const url = `${BASE_URL}?userId=${encodeURIComponent(userId)}`;

  const socket = io(url, {
    transports: ["websocket"],
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    // Keep socket client resilient - useful default for live data
    autoConnect,
  });

  socketInstance = socket;
  return socketInstance;
}

export function getSocket(): Socket | null {
  return socketInstance;
}

export function closeSocket() {
  if (!socketInstance) return;
  try {
    socketInstance.removeAllListeners();
    socketInstance.disconnect();
  } finally {
    socketInstance = null;
  }
}

export default initSocket;
