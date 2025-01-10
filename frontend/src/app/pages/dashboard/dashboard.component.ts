import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  loggedInUser: { FirstName: string; LastName: string } | null = null;

  projects = [
    { id: 1, name: 'Alexandria, VA, 2022' },
    { id: 2, name: 'Prince William, VA, 2024' },
    { id: 3, name: 'County With A Very Long Name, VA, 2024' }
  ];
  selectedProjectId: number | null = null;

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    this.loggedInUser = this.userService.getUser();

    const defaultProjectId = localStorage.getItem('defaultProjectId');
    if (defaultProjectId) {
      this.selectedProjectId = parseInt(defaultProjectId, 10);
      this.router.navigate(['/dashboard/project', this.selectedProjectId]);
    }
  }

  selectProject(projectId: number): void {
    this.selectedProjectId = projectId;
    this.router.navigate(['/dashboard/project', projectId]);
  }

  setDefaultProject(projectId: number): void {
    localStorage.setItem('defaultProjectId', projectId.toString());
  }
}
