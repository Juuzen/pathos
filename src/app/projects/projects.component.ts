import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';

import { ProjectService } from '../services/project.service';
import { Project } from '../models/project.model';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, CardModule, ButtonModule],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.css',
})
export class ProjectsComponent {
  projects: Project[];

  constructor(
    private readonly projectService: ProjectService,
    private readonly router: Router,
  ) {
    this.projects = this.projectService.getProjects();
  }

  openProject(id: string): void {
    this.router.navigate(['/projects', id]);
  }

  getTotalTracks(project: Project): number {
    return project.scenes.reduce((acc, scene) => acc + scene.tracks.length, 0);
  }
}
