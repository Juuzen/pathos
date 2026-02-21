import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';

import { ButtonModule } from 'primeng/button';
import { SliderModule } from 'primeng/slider';
import { TooltipModule } from 'primeng/tooltip';
import { CardModule } from 'primeng/card';
import { ProgressBarModule } from 'primeng/progressbar';

import { AudioPlayerService } from '../services/audio-player.service';
import { AudioTrack } from '../models/audio-track.model';

@Component({
  selector: 'app-audio-player',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    SliderModule,
    TooltipModule,
    CardModule,
    ProgressBarModule,
  ],
  templateUrl: './audio-player.component.html',
  styleUrl: './audio-player.component.css',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class AudioPlayerComponent implements OnInit, OnDestroy {
  @ViewChild('waveformContainer', { static: true })
  waveformContainer!: ElementRef<HTMLDivElement>;

  tracks: AudioTrack[] = [];
  isPlaying = false;
  isReady = false;
  currentTime = 0;
  duration = 0;

  private readonly subs = new Subscription();

  constructor(public playerService: AudioPlayerService) {}

  ngOnInit(): void {
    this.playerService.init(this.waveformContainer.nativeElement);

    this.subs.add(this.playerService.tracks$.subscribe((t) => (this.tracks = t)));
    this.subs.add(this.playerService.isPlaying$.subscribe((v) => (this.isPlaying = v)));
    this.subs.add(this.playerService.isReady$.subscribe((v) => (this.isReady = v)));
    this.subs.add(this.playerService.currentTime$.subscribe((v) => (this.currentTime = v)));
    this.subs.add(this.playerService.duration$.subscribe((v) => (this.duration = v)));
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files) return;
    Array.from(input.files).forEach((f) => this.playerService.addTrackFromFile(f));
    input.value = '';
  }

  playPause(): void {
    this.isPlaying ? this.playerService.pause() : this.playerService.play();
  }

  stop(): void {
    this.playerService.stop();
  }

  removeTrack(id: string): void {
    this.playerService.removeTrack(id);
  }

  onVolumeChange(id: string, value: number | number[]): void {
    const vol = Array.isArray(value) ? value[0] : value;
    this.playerService.setVolume(id, vol / 100);
  }

  toggleMute(id: string): void {
    this.playerService.toggleMute(id);
  }

  get progressPercent(): number {
    return this.duration > 0 ? (this.currentTime / this.duration) * 100 : 0;
  }

  formatTime(s: number): string {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, '0')}`;
  }
}
