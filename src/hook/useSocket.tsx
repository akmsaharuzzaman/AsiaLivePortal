import { socket } from "@/lib/socket-conection";
import { useEffect, useState } from "react";

interface VideoHostsResponse {
  status: number;
  hosts: any[];
}

interface AudioResponse {
  status: number;
  audio: any;
}

export function useSocket() {
  const [videoHosts, setVideoHosts] = useState<VideoHostsResponse | null>(null);
  const [audioData, setAudioData] = useState<AudioResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [getRooms, setGetRooms] = useState([]);

  useEffect(() => {
    socket.connect();

    // 1️⃣ When backend sends "get-video-hosts"
    socket.on("get-video-hosts", (data: VideoHostsResponse) => {
      console.log("VIDEO HOSTS:", data);
      setVideoHosts(data);
    });

    // 2️⃣ When backend sends "get-audio"
    socket.on("get-audio-hosts", (data: AudioResponse) => {
      console.log("AUDIO DATA:", data);
      setAudioData(data);
    });
    // When backend sends "get-rooms"
    socket.on("get-rooms", (data: any) => {
      console.log("ROOM DATA:", data);
      setGetRooms(data);
    });

    // 3️⃣ When backend sends error message
    socket.on("error-message", (msg: string) => {
      console.log("ERROR:", msg);
      setErrorMessage(msg);
    });

    return () => {
      socket.off("get-video-hosts");
      socket.off("get-audio");
      socket.off("error-message");
      socket.disconnect();
    };
  }, []);

  return { videoHosts, audioData, errorMessage, getRooms };
}
