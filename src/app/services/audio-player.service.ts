import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AudioTrack } from '../models/audio-track.model';
import MultiTrack, { TrackOptions } from 'wavesurfer-multitrack';

const TRACK_COLORS = [
  '#6366f1',
  '#8b5cf6',
  '#ec4899',
  '#f59e0b',
  '#10b981',
  '#3b82f6',
  '#ef4444',
  '#14b8a6',
];

@Injectable({ providedIn: 'root' })
export class AudioPlayerService implements OnDestroy {
  private multitrack: MultiTrack | null = null;
  private containerEl: HTMLElement | null = null;

  readonly tracks$ = new BehaviorSubject<AudioTrack[]>([]);
  readonly isPlaying$ = new BehaviorSubject<boolean>(false);
  readonly currentTime$ = new BehaviorSubject<number>(0);
  readonly duration$ = new BehaviorSubject<number>(0);
  readonly isReady$ = new BehaviorSubject<boolean>(false);

  private animFrame: number | null = null;
  private trackCounter = 0;

  /** Must be called once with the container div where WaveSurfer renders. */
  init(container: HTMLElement): void {
    this.containerEl = container;
    this.rebuildMultitrack();
  }

  private rebuildMultitrack(): void {
    if (!this.containerEl) return;

    // Destroy previous instance
    if (this.multitrack) {
      this.multitrack.destroy();
      this.multitrack = null;
    }
    this.isReady$.next(false);
    this.isPlaying$.next(false);

    const tracks = this.tracks$.value;
    if (tracks.length === 0) return;

    const trackDefs: TrackOptions[] = tracks.map((t) => ({
      id: t.id,
      url: t.url,
      volume: t.muted ? 0 : t.volume,
      startPosition: t.startPosition,
      options: {
        waveColor: t.color + '88',
        progressColor: t.color,
        height: 80,
        barWidth: 2,
        barGap: 1,
        barRadius: 2,
      },
    }));

    this.multitrack = MultiTrack.create(trackDefs, {
      container: this.containerEl,
      minPxPerSec: 10,
      rightButtonDrag: false,
      cursorWidth: 2,
      cursorColor: '#fff',
    });

    this.multitrack.once('canplay', () => {
      this.isReady$.next(true);
      this.duration$.next(this.multitrack!.getCurrentTime?.() ?? 0);
    });

    this.startTimeTracking();
  }

  private startTimeTracking(): void {
    if (this.animFrame !== null) cancelAnimationFrame(this.animFrame);

    const tick = () => {
      if (this.multitrack) {
        const playing = this.multitrack.isPlaying();
        this.isPlaying$.next(playing);
        const t = this.multitrack.getCurrentTime();
        this.currentTime$.next(t);
      }
      this.animFrame = requestAnimationFrame(tick);
    };
    this.animFrame = requestAnimationFrame(tick);
  }

  addTrackFromFile(file: File): void {
    const url = URL.createObjectURL(file);
    const idx = this.trackCounter++ % TRACK_COLORS.length;
    const track: AudioTrack = {
      id: crypto.randomUUID(),
      name: file.name.replace(/\.[^/.]+$/, ''),
      url,
      volume: 1,
      muted: false,
      startPosition: 0,
      color: TRACK_COLORS[idx],
    };
    this.tracks$.next([...this.tracks$.value, track]);
    this.rebuildMultitrack();
  }

  removeTrack(id: string): void {
    const url = this.tracks$.value.find((t) => t.id === id)?.url;
    if (url?.startsWith('blob:')) URL.revokeObjectURL(url);
    this.tracks$.next(this.tracks$.value.filter((t) => t.id !== id));
    this.rebuildMultitrack();
  }

  setVolume(id: string, volume: number): void {
    const tracks = this.tracks$.value.map((t) => (t.id === id ? { ...t, volume } : t));
    this.tracks$.next(tracks);
    if (this.multitrack) {
      const idx = tracks.findIndex((t) => t.id === id);
      const track = tracks[idx];
      if (idx !== -1 && track && !track.muted) {
        this.multitrack.setTrackVolume(idx, volume);
      }
    }
  }

  toggleMute(id: string): void {
    const tracks = this.tracks$.value.map((t) => (t.id === id ? { ...t, muted: !t.muted } : t));
    this.tracks$.next(tracks);
    if (this.multitrack) {
      const idx = tracks.findIndex((t) => t.id === id);
      const track = tracks[idx];
      if (idx !== -1 && track) {
        this.multitrack.setTrackVolume(idx, track.muted ? 0 : track.volume);
      }
    }
  }

  play(): void {
    this.multitrack?.play();
  }
  pause(): void {
    this.multitrack?.pause();
  }

  stop(): void {
    this.multitrack?.pause();
    this.multitrack?.seekTo(0);
    this.currentTime$.next(0);
  }

  seek(seconds: number): void {
    this.multitrack?.setTime(seconds);
  }

  ngOnDestroy(): void {
    if (this.animFrame !== null) cancelAnimationFrame(this.animFrame);
    this.multitrack?.destroy();
    this.tracks$.value.forEach((t) => {
      if (t.url.startsWith('blob:')) URL.revokeObjectURL(t.url);
    });
  }
}
