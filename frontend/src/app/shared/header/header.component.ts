import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { ProjectListService } from '../../services/project-list.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  standalone: true,
  imports: [CommonModule]
})
export class HeaderComponent implements OnInit {
  loggedInUser: any = null;
  isAdmin = false;
  projects: any[] = [];

  constructor(
    private router: Router,
    private userService: UserService,
    private projectListService: ProjectListService
  ) {}

  ngOnInit(): void {
    const user = this.userService.getUser();
    if (user) {
      this.loggedInUser = user;
      this.isAdmin = user.role === 1;
    } else {
      this.router.navigate(['/auth']);
    }

    this.projectListService.getProjects().subscribe({
      next: (data) => this.projects = data,
      error: (err) => console.error('Error loading projects in header:', err)
    });
  }

  navigate(path: string): void {
    if (path === '/dashboard') {
      this.openFavoriteOrFirstProject();
    } else {
      this.router.navigate([path]);
    }
  }

  openFavoriteOrFirstProject(): void {
    const favoriteId = localStorage.getItem('favoriteProjectId');

    if (favoriteId) {
      this.router.navigate(['/dashboard/project', favoriteId]);
    } else if (this.projects.length > 0) {
      const firstProjectId = this.projects[0].ID;
      this.router.navigate(['/dashboard/project', firstProjectId]);
    } else {
      // fallback
      this.router.navigate(['/dashboard']);
    }
  }

  logout(): void {
    this.userService.clearUser();
    this.router.navigate(['/']);
  }
}
