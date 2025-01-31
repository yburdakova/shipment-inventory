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

    this.projectListService.getProjects().subscribe({
      next: (data) => {
        this.projects = data;
        console.log('Projects loaded:', this.projects);
      },
      error: (error) => {
        console.error('Error loading projects:', error);
      },
      complete: () => {
        console.log('Project loading completed.');
      }
    });

    const defaultProjectId = localStorage.getItem('defaultProjectId');
    if (defaultProjectId) {
      this.selectedProjectId = parseInt(defaultProjectId, 10);
      this.router.navigate(['/dashboard/project', this.selectedProjectId]);
    }
  }

  selectProject(project: { ID: number; Description: string }): void {
    this.projectService.setProject(project);
    this.router.navigate(['/dashboard/project', project.ID]);
  }

  setDefaultProject(projectId: number): void {
    localStorage.setItem('defaultProjectId', projectId.toString());
  }

  logout(): void {
    this.userService.clearUser();
    localStorage.removeItem('defaultProjectId');
    this.router.navigate(['/']);
  }
}
