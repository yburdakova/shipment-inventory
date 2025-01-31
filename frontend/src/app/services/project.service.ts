import { Injectable } from '@angular/core';
import { API_BASE_URL } from '../constants/api.constants';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  private selectedProject: { ID: number; Description: string } | null = null;
  constructor(private http: HttpClient) {}


  setProject(project: { ID: number; Description: string }): void {
    this.selectedProject = project;
  }

  getProject(): { ID: number; Description: string } | null {
    return this.selectedProject;
  }

  getProjectStats(projectId: number): Observable<any> {
    console.log('ProjectService (getProjectStats): Project ID:', projectId);
    if (!projectId) {
      throw new Error('Project is not selected');
    }

    const apiUrl = `${API_BASE_URL}/projects/stats/${projectId}`;
    return this.http.get<any>(apiUrl);
  }
}
