export interface AudioTrack {
  id: string;
  name: string;
  url: string;
  volume: number; // 0.0 - 1.0
  muted: boolean;
  startPosition: number; // offset in seconds on the timeline
  color: string;
}
