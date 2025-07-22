import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { UserService } from '../../services/user.service';
import { ProjectService } from '../../services/project.service';
import { ProjectListService } from '../../services/project-list.service';
import { BoxService } from '../../services/box.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  @ViewChild('quickSearchInput') quickSearchInput!: ElementRef<HTMLInputElement>;
  
  loggedInUser: { firstName: string; lastName: string; role: number; currentProjectId: number } | null = null;
  projects: any[] = [];
  selectedProjectId: number | null = null;
  favoriteProjectId: number | null = null;
  isQuickSearchActive: boolean = false;
  isDashboardPage: boolean = false;
  isAdmin = false;
  activeToolBox: string  = "statsBtn";

  constructor(
    private userService: UserService,
    private projectListService: ProjectListService,
    private projectService: ProjectService,
    private boxService: BoxService,
    private router: Router
  ) {}

  setActiveToolBox(id: string): void {
    this.activeToolBox = id;
  }

  goToConversionTool() {
    this.isQuickSearchActive = false;
    console.log('Navigating to conversion tool...');
    this.setActiveToolBox('conversionTool');
    this.router.navigate(['/dashboard/conversion-tool']);
  }

  goToProjectStats() {
    this.isQuickSearchActive = false;
    console.log('Navigating to project stats...');
    this.setActiveToolBox('statsBtn');
    if (this.loggedInUser) {
      this.router.navigate([`/dashboard/project/${this.loggedInUser.currentProjectId}`]);
    } else {
      this.router.navigate(['/']); 
    }
  }

  goToPullRequestTool() {
    this.isQuickSearchActive = false;
    this.setActiveToolBox('pullRequestTool');
    this.router.navigate(['/dashboard/pull-request-tool']);
  }

  ngOnInit(): void {

    this.loggedInUser = this.userService.getUser();
    
    if (!this.loggedInUser) {
      this.router.navigate(['/']);
      return;
    }

    this.isAdmin = this.loggedInUser.role === 1; 

    this.router.events.subscribe(() => {
      this.isDashboardPage = this.router.url === '/dashboard';
    });

    this.projectListService.getProjects().subscribe({
      next: (data) => {
        this.projects = data;
        console.log('Projects loaded:', this.projects);

        const savedFavoriteProjectId = localStorage.getItem('favoriteProjectId');

        if (this.loggedInUser?.role === 4) {
          this.selectProjectById(this.loggedInUser.currentProjectId);
        } else if (savedFavoriteProjectId) {
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

  activateQuickSearch(): void {
    this.isQuickSearchActive = true;
    setTimeout(() => {
      this.quickSearchInput.nativeElement.focus();
    });
  }

  deactivateQuickSearch(): void {
    this.isQuickSearchActive = false;
  }

  toggleQuickSearch(): void {
    if (this.isQuickSearchActive) {
      this.deactivateQuickSearch();
    } else {
      this.activateQuickSearch();
    }
  }

  @HostListener('keyup.enter', ['$event'])
  handleQuickSearch(event: KeyboardEvent): void {
    const barcode = this.quickSearchInput.nativeElement.value.trim();
    console.log('Quick search barcode:', barcode);
    if (barcode) {
      this.fetchBoxDetails(barcode);
    }
  }

  fetchBoxDetails(barcode: string): void {
    this.boxService.getBoxIdByBarcode(barcode).subscribe({
      next: (response) => {
        if (response && response.ID) {
          this.router.navigate([`/dashboard/box/${response.ID}`]);
          this.setActiveToolBox("");
        } else {
          alert('Box not found.');
        }
        this.quickSearchInput.nativeElement.value = '';
        this.quickSearchInput.nativeElement.blur();
        this.isQuickSearchActive = false;
      },
      error: (error) => {
        console.error('Error fetching box details:', error);
        alert('Error fetching box details.');
        this.quickSearchInput.nativeElement.value = '';
        this.quickSearchInput.nativeElement.blur();
        this.isQuickSearchActive = false;
      }
    });
  }
  
}