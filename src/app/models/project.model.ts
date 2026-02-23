import { AudioTrack } from './audio-track.model';

export interface Project {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  tracks: AudioTrack[];
}
