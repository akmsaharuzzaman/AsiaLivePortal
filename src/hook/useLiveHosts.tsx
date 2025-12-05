import { useEffect, useRef, useState } from "react";
import { Socket } from "socket.io-client";
import initSocket, { closeSocket } from "../socket";
import type {
  AudioHost,
  GetAudioHostsResponse,
  GetVideoHostsResponse,
  VideoHost,
  ErrorMessagePayload,
} from "@/types/socket-types";

export interface UseLiveHostsResult {
  videoHosts: VideoHost[];
  audioHosts: AudioHost[];
  errors: string[];
  connected: boolean;
  requestVideoHosts: (payload?: unknown) => void;
  requestAudioHosts: (payload?: unknown) => void;
}

function normalizeError(payload: ErrorMessagePayload): string {
  if (!payload) return "Unknown error";
  if (typeof payload === "string") return payload;
  if (typeof payload === "object") {
    // backend could send { message } or { error }
    // pick the first defined property
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const anyp = payload as any;
    return anyp.message ?? anyp.error ?? JSON.stringify(payload);
  }
  return String(payload);
}

/**
 * useLiveHosts - hook to connect via socket and expose hosts + errors
 * @param userId - required user id used to initialize the socket connection
 */
export default function useLiveHosts(
  userId?: string | null,
): UseLiveHostsResult {
  const [videoHosts, setVideoHosts] = useState<VideoHost[]>([]);
  const [audioHosts, setAudioHosts] = useState<AudioHost[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [connected, setConnected] = useState<boolean>(false);

  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!userId) {
      // if userId missing, still ensure previous socket (if any) is disconnected
      closeSocket();
      socketRef.current = null;
      setConnected(false);
      return;
    }

    // initialize socket for this userId without immediately connecting
    try {
      socketRef.current = initSocket(userId, false);
    } catch (err) {
      // invalid userId or init failure
      const msg = err instanceof Error ? err.message : String(err);
      // eslint-disable-next-line no-console
      console.error("Failed to init socket:", err);
      setErrors((prev) => [...prev, msg]);
      return;
    }

    const s = socketRef.current;

    function onConnect() {
      setConnected(true);
    }

    function onDisconnect() {
      setConnected(false);
    }

    function onGetVideoHosts(payload: GetVideoHostsResponse) {
      if (!payload) return;
      setVideoHosts(Array.isArray(payload.hosts) ? payload.hosts : []);
    }

    function onGetAudioHosts(payload: GetAudioHostsResponse) {
      if (!payload) return;
      setAudioHosts(Array.isArray(payload.data) ? payload.data : []);
    }

    function onErrorMessage(payload: ErrorMessagePayload) {
      const msg = normalizeError(payload);

      // ignore the backend error-message 'User does not exist' which sometimes
      // arrives alongside valid payloads and should not block host updates.
      if (
        (msg ?? "").toString().trim().toLowerCase() === "user does not exist"
      ) {
        // eslint-disable-next-line no-console
        console.debug("Ignored backend 'User does not exist' error");
        return;
      }

      // otherwise record error
      // eslint-disable-next-line no-console
      console.error("Socket error-message:", msg, payload);
      setErrors((prev) => [...prev, msg]);
    }

    s.on("connect", onConnect);
    s.on("disconnect", onDisconnect);
    s.on("get-video-hosts", onGetVideoHosts);
    s.on("get-audio-hosts", onGetAudioHosts);
    s.on("error-message", onErrorMessage);

    // attach listeners first, then begin the connection so we don't miss immediate server emits
    try {
      s.connect();
    } catch (e) {
      // some environments connect automatically; ignore connect error
    }

    // also check if socket has already connected quickly
    if (s.connected) setConnected(true);

    return () => {
      if (!s) return;
      s.off("connect", onConnect);
      s.off("disconnect", onDisconnect);
      s.off("get-video-hosts", onGetVideoHosts);
      s.off("get-audio-hosts", onGetAudioHosts);
      s.off("error-message", onErrorMessage);

      // Keep the socket lifecycle controlled by the hook: close the socket when the hook unmounts
      try {
        s.removeAllListeners();
        s.disconnect();
      } catch (e) {
        // best effort
      }

      socketRef.current = null;
    };
  }, [userId]);

  // functions to request hosts from server (emit events)
  function requestVideoHosts(payload?: unknown) {
    const s = socketRef.current;
    if (!s) return;
    try {
      s.emit("get-video-hosts", payload);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error("Failed to emit get-video-hosts", e);
    }
  }

  function requestAudioHosts(payload?: unknown) {
    const s = socketRef.current;
    if (!s) return;
    try {
      s.emit("get-audio-hosts", payload);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error("Failed to emit get-audio-hosts", e);
    }
  }

  return {
    videoHosts,
    audioHosts,
    errors,
    connected,
    requestVideoHosts,
    requestAudioHosts,
  };
}
