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
  deliveries: ProjectStats["deliveries"] = [];

  constructor(private route: ActivatedRoute, private projectService: ProjectService) {}

  ngOnInit(): void {
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
        this.deliveries = data.deliveries;
        console.log('Project stats loaded:', this.stats, "Deliveries:", this.deliveries);
      },
      error: (error) => {
        console.error('Error loading project stats:', error);
      },
      complete: () => {
        console.log('Project stats loading completed.');
      }
    });
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
  }
}
