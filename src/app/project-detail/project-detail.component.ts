import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import { ButtonModule } from 'primeng/button';
import { ButtonGroupModule } from 'primeng/buttongroup';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';

import { ProjectService } from '../services/project.service';
import { Project, Scene } from '../models/project.model';

@Component({
  selector: 'app-project-detail',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    ButtonGroupModule,
    DialogModule,
    InputTextModule,
    FormsModule,
  ],
  templateUrl: './project-detail.component.html',
  styleUrl: './project-detail.component.css',
})
export class ProjectDetailComponent implements OnInit {
  project: Project | undefined;
  selectedScene: Scene | null = null;

  isSceneViewerOpen = true;
  sceneViewMode: 'row' | 'grid' = 'row';

  showAddTracksDialog = false;
  showAddSceneDialog = false;

  newSceneName = '';
  newSceneDesc = '';

  queuedFiles: File[] = [];
  isDragOver = false;
  private dragCounter = 0;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly projectService: ProjectService,
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.project = this.projectService.getProjectById(id);
      if (this.project && this.project.scenes.length > 0) {
        this.selectedScene = this.project.scenes[0];
      }
    }
    if (!this.project) {
      this.router.navigate(['/projects']);
    }
  }

  selectScene(scene: Scene): void {
    this.selectedScene = scene;
  }

  toggleSceneViewer(): void {
    this.isSceneViewerOpen = !this.isSceneViewerOpen;
  }

  toggleSceneViewMode(): void {
    this.sceneViewMode = this.sceneViewMode === 'row' ? 'grid' : 'row';
  }

  openAddSceneDialog(): void {
    this.newSceneName = '';
    this.newSceneDesc = '';
    this.showAddSceneDialog = true;
  }

  confirmAddScene(): void {
    if (this.project && this.newSceneName.trim()) {
      const newScene = this.projectService.addSceneToProject(
        this.project.id,
        this.newSceneName.trim(),
        this.newSceneDesc.trim(),
      );
      this.selectedScene = newScene;
      this.showAddSceneDialog = false;
    }
  }

  goBack(): void {
    this.router.navigate(['/projects']);
  }

  openAddTracksDialog(): void {
    this.queuedFiles = [];
    this.dragCounter = 0;
    this.isDragOver = false;
    this.showAddTracksDialog = true;
  }

  onDialogHide(): void {
    this.queuedFiles = [];
    this.dragCounter = 0;
    this.isDragOver = false;
  }

  cancelDialog(): void {
    this.showAddTracksDialog = false;
  }

  confirmDialog(): void {
    if (this.project && this.queuedFiles.length > 0) {
      this.projectService.addTracksToProject(
        this.project.id,
        this.queuedFiles.map((f) => f.name),
      );
    }
    this.showAddTracksDialog = false;
  }

  onDragEnter(event: DragEvent): void {
    event.preventDefault();
    this.dragCounter++;
    this.isDragOver = true;
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.dragCounter--;
    if (this.dragCounter === 0) {
      this.isDragOver = false;
    }
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = false;
    this.dragCounter = 0;
    const files = event.dataTransfer?.files;
    if (files) {
      this.addFiles(files);
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.addFiles(input.files);
      input.value = '';
    }
  }

  removeQueuedFile(index: number): void {
    this.queuedFiles.splice(index, 1);
  }

  getFileBaseName(name: string): string {
    const parts = name.split('.');
    parts.pop();
    return parts.join('.');
  }

  getFileExt(name: string): string {
    return name.split('.').pop()?.toUpperCase() ?? '';
  }

  getTotalTracks(): number {
    if (!this.project) return 0;
    return this.project.scenes.reduce((acc, scene) => acc + scene.tracks.length, 0);
  }

  getSceneTrackIndex(sceneIndex: number, trackIndex: number): number {
    if (!this.project) return 0;
    let index = 0;
    for (let i = 0; i < sceneIndex; i++) {
      index += this.project.scenes[i].tracks.length;
    }
    return index + trackIndex + 1;
  }

  private addFiles(fileList: FileList): void {
    Array.from(fileList)
      .filter((f) => f.type.startsWith('audio/') || this.isAudioExtension(f.name))
      .forEach((f) => {
        if (!this.queuedFiles.some((q) => q.name === f.name)) {
          this.queuedFiles.push(f);
        }
      });
  }

  private isAudioExtension(name: string): boolean {
    const ext = name.split('.').pop()?.toLowerCase() ?? '';
    return ['mp3', 'wav', 'ogg', 'flac', 'aac', 'm4a', 'aiff', 'wma'].includes(ext);
  }
}
