import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { UserService } from '../../services/user.service';
import { ProjectService } from '../../services/project.service';
import { ProjectListService } from '../../services/project-list.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  loggedInUser: { firstName: string; lastName: string } | null = null; 
  projects: any[] = [];
  selectedProjectId: number | null = null;
  favoriteProjectId: number | null = null;

  constructor(
    private userService: UserService,
    private projectListService: ProjectListService,
    private projectService: ProjectService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loggedInUser = this.userService.getUser();
    if (!this.loggedInUser) {
      this.router.navigate(['/']);
      return;
    }

    // Загружаем проекты
    this.projectListService.getProjects().subscribe({
      next: (data) => {
        this.projects = data;
        console.log('Projects loaded:', this.projects);

        // Проверяем, есть ли сохраненный избранный проект
        const savedFavoriteProjectId = localStorage.getItem('favoriteProjectId');
        if (savedFavoriteProjectId) {
          this.favoriteProjectId = parseInt(savedFavoriteProjectId, 10);
          this.selectProjectById(this.favoriteProjectId);
        }
      },
      error: (error) => {
        console.error('Error loading projects:', error);
      },
      complete: () => {
        console.log('Project loading completed.');
      }
    });
  }

  selectProject(project: { ID: number; Description: string }): void {
    this.projectService.setProject(project);
    this.selectedProjectId = project.ID;
    this.router.navigate(['/dashboard/project', project.ID]);
  }

  setFavoriteProject(projectId: number): void {
    this.favoriteProjectId = projectId;
    localStorage.setItem('favoriteProjectId', projectId.toString());
  }

  private selectProjectById(projectId: number): void {
    const project = this.projects.find(p => p.ID === projectId);
    if (project) {
      this.selectProject(project);
    }
  }

  logout(): void {
    this.userService.clearUser();
    localStorage.removeItem('favoriteProjectId');
    this.router.navigate(['/']);
  }
}
