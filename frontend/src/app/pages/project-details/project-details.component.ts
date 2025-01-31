import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProjectService } from '../../services/project.service';
import { ProjectStats } from '../../models/stats.model';

@Component({
  selector: 'app-project-details',
  templateUrl: './project-details.component.html',
  imports: [CommonModule],
  styleUrls: ['./project-details.component.scss']
})
export class ProjectDetailsComponent implements OnInit {
  project: { ID: number; Description: string } | null = null;
  stats: ProjectStats | null = null;

  constructor(private route: ActivatedRoute, private projectService: ProjectService) {}

  ngOnInit(): void {
    // Подписываемся на изменения параметров маршрута
    this.route.paramMap.subscribe(() => {
      this.loadProject();
    });
  }

  private loadProject(): void {
    this.project = this.projectService.getProject();

    if (!this.project || this.project.ID === undefined) {
      console.error('Project is not selected.');
      return;
    }

    this.fetchProjectStats(this.project.ID);
  }

  private fetchProjectStats(projectId: number): void {
    this.projectService.getProjectStats(projectId).subscribe({
      next: (data) => {
        this.stats = data;
        console.log('Project stats loaded:', this.stats);
      },
      error: (error) => {
        console.error('Error loading project stats:', error);
      },
      complete: () => {
        console.log('Project stats loading completed.');
      }
    });
  }
}
