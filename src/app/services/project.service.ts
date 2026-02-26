import { Injectable } from '@angular/core';
import { Project, Scene } from '../models/project.model';

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

const MOCK_PROJECTS: Project[] = [
  {
    id: 'proj-test',
    name: 'Progetto di Prova',
    description: 'Progetto di test con sample audio.',
    imageUrl: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=600&h=400&fit=crop',
    scenes: [
      {
        id: 's-test-1',
        name: 'Scena Predefinita',
        description: 'Tutte le tracce del progetto',
        tracks: [
          {
            id: 't-test-1',
            name: 'Nature - Forest Birds',
            url: '/assets/samples/Nature%20-%20Forest%20Birds.wav',
            volume: 1,
            muted: false,
            startPosition: 0,
            color: TRACK_COLORS[0],
          },
          {
            id: 't-test-2',
            name: 'Nature - Jungle',
            url: '/assets/samples/Nature%20-%20Jungle.wav',
            volume: 1,
            muted: false,
            startPosition: 0,
            color: TRACK_COLORS[1],
          },
          {
            id: 't-test-3',
            name: 'Nature - River',
            url: '/assets/samples/Nature%20-%20River.wav',
            volume: 1,
            muted: false,
            startPosition: 0,
            color: TRACK_COLORS[2],
          },
        ],
      },
    ],
  },
];

@Injectable({ providedIn: 'root' })
export class ProjectService {
  private colorIndex = 3;

  getProjects(): Project[] {
    return MOCK_PROJECTS;
  }

  getProjectById(id: string): Project | undefined {
    return MOCK_PROJECTS.find((p) => p.id === id);
  }

  addTracksToProject(projectId: string, files: File[]): void {
    const project = this.getProjectById(projectId);
    if (!project || project.scenes.length === 0) return;

    const newTracks = files.map((file) => ({
      id: crypto.randomUUID(),
      name: file.name.replace(/\.[^/.]+$/, ''),
      url: URL.createObjectURL(file),
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
