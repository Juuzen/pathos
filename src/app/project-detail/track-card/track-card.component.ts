import {
  Component,
  Input,
  OnInit,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  ViewChild,
  ElementRef,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { AudioTrack } from '../../models/audio-track.model';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-track-card',
  standalone: true,
  imports: [CommonModule, ButtonModule, TooltipModule],
  templateUrl: './track-card.component.html',
  styleUrl: './track-card.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TrackCardComponent implements OnInit, OnChanges, OnDestroy {
  @Input({ required: true }) track!: AudioTrack;

  @ViewChild('audioPlayer', { static: true }) audioPlayer!: ElementRef<HTMLAudioElement>;

  playbackState: 'stopped' | 'playing' | 'paused' = 'stopped';
  currentTime = 0;
  duration = 0;

  private timeUpdateHandler!: () => void;
  private loadedMetadataHandler!: () => void;
  private endedHandler!: () => void;

  constructor(private readonly cdr: ChangeDetectorRef) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['track'] && !changes['track'].isFirstChange()) {
      this.loadAudioSource();
    }
  }

  ngOnInit(): void {
    const audio = this.audioPlayer.nativeElement;

    this.timeUpdateHandler = () => {
      this.currentTime = audio.currentTime;
      this.cdr.markForCheck();
    };

    this.loadedMetadataHandler = () => {
      this.duration = audio.duration;
      this.cdr.markForCheck();
    };

    this.endedHandler = () => {
      this.playbackState = 'stopped';
      this.currentTime = 0;
      this.cdr.markForCheck();
    };

    audio.addEventListener('timeupdate', this.timeUpdateHandler);
    audio.addEventListener('loadedmetadata', this.loadedMetadataHandler);
    audio.addEventListener('ended', this.endedHandler);

    this.loadAudioSource();
  }

  private loadAudioSource(): void {
    const audio = this.audioPlayer.nativeElement;
    audio.src = this.track.url;
    audio.load();
  }

  ngOnDestroy(): void {
    const audio = this.audioPlayer?.nativeElement;
    if (audio) {
      audio.removeEventListener('timeupdate', this.timeUpdateHandler);
      audio.removeEventListener('loadedmetadata', this.loadedMetadataHandler);
      audio.removeEventListener('ended', this.endedHandler);
      audio.pause();
    }
  }

  play(): void {
    const audio = this.audioPlayer.nativeElement;
    audio
      .play()
      .then(() => {
        this.playbackState = 'playing';
        this.cdr.markForCheck();
      })
      .catch((err) => console.error('Error playing audio', err));
  }

  pause(): void {
    const audio = this.audioPlayer.nativeElement;
    audio.pause();
    this.playbackState = 'paused';
    this.cdr.markForCheck();
  }

  stop(): void {
    const audio = this.audioPlayer.nativeElement;
    audio.pause();
    audio.currentTime = 0;
    this.playbackState = 'stopped';
    this.currentTime = 0;
    this.cdr.markForCheck();
  }

  formatTime(s: number): string {
    if (Number.isNaN(s)) return '0:00';
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, '0')}`;
  }
}
