// import { socket } from "@/lib/socket-conection";
// import { useEffect, useState } from "react";

import { createSocket } from "@/lib/socket-conection";
import { useAppSelector } from "@/redux/hooks";
import { useEffect, useState } from "react";

interface VideoHostsResponse {
  status: number;
  hosts: any[];
}

interface AudioResponse {
  status: number;
  audio: any;
}

export function UseSocket() {
  const userId = useAppSelector((state) => state.auth.user?.id);

  const [videoHosts, setVideoHosts] = useState<VideoHostsResponse | null>(null);
  const [audioData, setAudioData] = useState<AudioResponse | null>(null);
  // const [errorMessage, setErrorMessage] = useState<string | null>(null);
  // const [getRooms, setGetRooms] = useState([]);
  const [socket, setSocket] = useState<any>(null);
  // getting user persi

  useEffect(() => {
    if (!userId) return;

    //     // ✨ Create socket only when userId exists
    const newSocket = createSocket(userId);
    setSocket(newSocket);
    newSocket.connect();
    newSocket.connect();

    // 1️⃣ When backend sends "get-video-hosts"
    newSocket.on("get-video-hosts", (data: VideoHostsResponse) => {
      console.log("VIDEO HOSTS:", data);
      setVideoHosts(data);
    });

    // 2️⃣ When backend sends "get-audio"
    newSocket.on("get-audio-hosts", (data: AudioResponse) => {
      console.log("AUDIO DATA:", data);
      setAudioData(data);
    });
    // When backend sends "get-rooms"
    // newSocket.on("get-rooms", (data: any) => {
    //   console.log("ROOM DATA:", data);
    //   setGetRooms(data);
    // });

    // 3️⃣ When backend sends error message
    // newSocket.on("error-message", (msg: string) => {
    //   console.log("ERROR:", msg);
    //   setErrorMessage(msg);
    // });

    return () => {
      newSocket.off("get-video-hosts");
      newSocket.off("get-audio-hosts");
      // newSocket.off("error-message");
      newSocket.disconnect();
    };
  }, []);

  return { videoHosts, audioData };
}

// 3rd TIME
// import { useEffect, useState } from "react";
// import { createSocket } from "@/lib/socket-conection";
// import { useSelector } from "react-redux";
// import { RootState } from "@/redux/store";

// export function useSocket() {
//   const userId = useSelector((state: RootState) => state.auth.user?.id);
//   const [socket, setSocket] = useState<any>(null);
//   const [videoHosts, setVideoHosts] = useState([]);
//   const [audioData, setAudioData] = useState([]);
//   // const [errorMessage, setErrorMessage] = useState<string | null>(null);
//   // const [getRooms, setGetRooms] = useState([]);

//   useEffect(() => {
//     if (!userId) return;

//     // ✨ Create socket only when userId exists
//     const newSocket = createSocket(userId);
//     setSocket(newSocket);
//     newSocket.connect();

//     newSocket.on("get-video-hosts", (data) => setVideoHosts(data));
//     newSocket.on("get-audio-hosts", (data) => setAudioData(data));
//     // newSocket.on("error-message", (msg) => setErrorMessage(msg));
//     // newSocket.on("get-rooms", (data) => setGetRooms(data));

//     return () => {
//       newSocket.disconnect();
//     };
//   }, [userId]);
//   console.log(socket, 'sk');
//   return { videoHosts, audioData, socket };
// }

// import { useEffect, useRef, useState } from "react";
// import { createSocket } from "@/lib/socket-conection";
// import { useSelector } from "react-redux";
// import { RootState } from "@/redux/store";

// export function useSocket() {
//   const userId = useSelector((state: RootState) => state.auth.user?.id);

//   const socketRef = useRef<any>(null);

//   const [videoHosts, setVideoHosts] = useState([]);
//   const [audioData, setAudioData] = useState([]);

//   useEffect(() => {
//     if (!userId) return;

//     // Prevent duplicate sockets
//     if (socketRef.current) return;

//     const socket = createSocket(userId);
//     socketRef.current = socket;

//     socket.connect();

//     // ---- LISTEN ----
//     socket.on("get-video-hosts", (data) => {
//       console.log("VIDEO HOSTS:", data);
//       setVideoHosts(data);
//     });

//     socket.on("get-audio-hosts", (data) => {
//       console.log("AUDIO HOSTS:", data);
//       setAudioData(data);
//     });

//     return () => {
//       if (socketRef.current) {
//         socketRef.current.off("get-video-hosts");
//         socketRef.current.off("get-audio-hosts");
//         socketRef.current.disconnect();
//         socketRef.current = null;
//       }
//     };
//   }, []);

//   return { videoHosts, audioData, socket: socketRef.current };
// }
