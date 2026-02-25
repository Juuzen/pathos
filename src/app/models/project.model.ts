import { AudioTrack } from './audio-track.model';

export interface Scene {
  id: string;
  name: string;
  description: string;
  tracks: AudioTrack[];
}

export interface Project {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  scenes: Scene[];
}
