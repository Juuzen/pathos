import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'player',
    loadComponent: () =>
      import('./audio-player/audio-player.component').then((m) => m.AudioPlayerComponent),
  },
  { path: '', redirectTo: 'player', pathMatch: 'full' },
  { path: '**', redirectTo: 'player' },
];
