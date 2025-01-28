import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  private selectedProject: { ID: number; Description: string } | null = null;

  setProject(project: { ID: number; Description: string }): void {
    this.selectedProject = project;
  }

  getProject(): { ID: number; Description: string } | null {
    return this.selectedProject;
  }
}
