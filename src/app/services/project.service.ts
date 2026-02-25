import { Injectable } from '@angular/core';
import { Project, Scene } from '../models/project.model';

const MOCK_PROJECTS: Project[] = [
  {
    id: 'proj-1',
    name: 'Ombre Sonore',
    description:
      'Un viaggio sonoro tra atmosfere oscure e melodie eteree. Paesaggi sonori costruiti su sintetizzatori modulari e field recording notturni.',
    imageUrl: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=600&h=400&fit=crop',
    scenes: [
      {
        id: 's1-1',
        name: 'Scena Predefinita',
        description: 'Tutte le tracce del progetto',
        tracks: [
          {
            id: 't1-1',
            name: 'Intro – Nebbia',
            url: '',
            volume: 1,
            muted: false,
            startPosition: 0,
            color: '#6366f1',
          },
          {
            id: 't1-2',
            name: 'Pulsazioni Notturne',
            url: '',
            volume: 1,
            muted: false,
            startPosition: 0,
            color: '#8b5cf6',
          },
          {
            id: 't1-3',
            name: 'Echi Lontani',
            url: '',
            volume: 1,
            muted: false,
            startPosition: 0,
            color: '#ec4899',
          },
          {
            id: 't1-4',
            name: 'Dissolvenza',
            url: '',
            volume: 1,
            muted: false,
            startPosition: 0,
            color: '#f59e0b',
          },
        ],
      },
    ],
  },
  {
    id: 'proj-2',
    name: 'Maree Elettriche',
    description:
      'Composizioni elettroniche ispirate al movimento delle maree. Ritmi ipnotici e bassi profondi che oscillano come onde.',
    imageUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&h=400&fit=crop',
    scenes: [
      {
        id: 's2-1',
        name: 'Scena Predefinita',
        description: 'Tutte le tracce del progetto',
        tracks: [
          {
            id: 't2-1',
            name: 'Alta Marea',
            url: '',
            volume: 1,
            muted: false,
            startPosition: 0,
            color: '#3b82f6',
          },
          {
            id: 't2-2',
            name: 'Corrente Sotterranea',
            url: '',
            volume: 1,
            muted: false,
            startPosition: 0,
            color: '#10b981',
          },
          {
            id: 't2-3',
            name: 'Risacca Digitale',
            url: '',
            volume: 1,
            muted: false,
            startPosition: 0,
            color: '#14b8a6',
          },
        ],
      },
    ],
  },
  {
    id: 'proj-3',
    name: 'Frammenti di Silenzio',
    description:
      'Un progetto minimalista che esplora il confine tra suono e silenzio. Pianoforte preparato, archi e granular synthesis.',
    imageUrl: 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=600&h=400&fit=crop',
    scenes: [
      {
        id: 's3-1',
        name: 'Scena Predefinita',
        description: 'Tutte le tracce del progetto',
        tracks: [
          {
            id: 't3-1',
            name: 'Primo Frammento',
            url: '',
            volume: 1,
            muted: false,
            startPosition: 0,
            color: '#ef4444',
          },
          {
            id: 't3-2',
            name: 'Spazio Bianco',
            url: '',
            volume: 1,
            muted: false,
            startPosition: 0,
            color: '#6366f1',
          },
          {
            id: 't3-3',
            name: 'Risonanze',
            url: '',
            volume: 1,
            muted: false,
            startPosition: 0,
            color: '#8b5cf6',
          },
          {
            id: 't3-4',
            name: 'Coda – Respiro',
            url: '',
            volume: 1,
            muted: false,
            startPosition: 0,
            color: '#ec4899',
          },
          {
            id: 't3-5',
            name: 'Epilogo',
            url: '',
            volume: 1,
            muted: false,
            startPosition: 0,
            color: '#f59e0b',
          },
        ],
      },
    ],
  },
];

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
export class ProjectService {
  private colorIndex = 0;

  getProjects(): Project[] {
    return MOCK_PROJECTS;
  }

  getProjectById(id: string): Project | undefined {
    return MOCK_PROJECTS.find((p) => p.id === id);
  }

  addTracksToProject(projectId: string, fileNames: string[]): void {
    const project = this.getProjectById(projectId);
    if (!project || project.scenes.length === 0) return;

    const newTracks = fileNames.map((name) => ({
      id: crypto.randomUUID(),
      name,
      url: '',
      volume: 1,
      muted: false,
      startPosition: 0,
      color: TRACK_COLORS[this.colorIndex++ % TRACK_COLORS.length],
    }));

    // For now, add to the first scene
    project.scenes[0].tracks.push(...newTracks);
  }

  addSceneToProject(projectId: string, name: string, description: string): Scene {
    const project = this.getProjectById(projectId);
    if (!project) throw new Error('Project not found');

    const newScene: Scene = {
      id: crypto.randomUUID(),
      name,
      description,
      tracks: [],
    };

    project.scenes.push(newScene);
    return newScene;
  }
}
