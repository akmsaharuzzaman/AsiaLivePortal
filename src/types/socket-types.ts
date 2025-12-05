// Types for socket events and payloads

export type ErrorMessagePayload =
  | string
  | { message: string }
  | { error: string };

export interface VideoHostActivityZone {
  zone: string;
}

export interface VideoHost {
  _id: string;
  level: number;
  avatar?: string;
  name: string;
  uid: string;
  activityZone?: VideoHostActivityZone;
  currentLevelBackground?: string;
  currentLevelTag?: string;
}

export interface GetVideoHostsResponse {
  status: number;
  hosts: VideoHost[];
}

export interface AudioHost {
  _id: string;
  name: string;
  avatar?: string;
  uid: string;
  currentBackground?: string;
  currentTag?: string;
  currentLevel?: number;
  isMuted?: boolean;
}

export interface GetAudioHostsResponse {
  success: boolean;
  data: AudioHost[];
}
