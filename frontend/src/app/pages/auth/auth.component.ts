import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../../services/user.service';
import { API_BASE_URL } from '../../constants/api.constants';

@Component({
  selector: 'app-auth',
  standalone: true,
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements AfterViewInit {
  @ViewChild('scanInput') scanInput!: ElementRef;
  @ViewChild('note') note!: ElementRef;

  private apiUrl = `${API_BASE_URL}/auth/login`;

  constructor(private router: Router, private http: HttpClient, private userService: UserService) {}

  ngAfterViewInit() {
    this.setFocus();

    const user = this.userService.getUser();
    if (user) {
      this.router.navigate(['/dashboard']);
    }
  }

  setFocus() {
    if (this.scanInput) {
      this.scanInput.nativeElement.focus();
    }
  }

  handleKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      const authCode = this.scanInput.nativeElement.value.trim();
      this.authenticateUser(authCode);
    }
  }

  authenticateUser(authCode: string) {
    this.http.post<any>(this.apiUrl, { authCode }).subscribe({
      next: (response) => {
        this.userService.setUser(response);
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        this.displayMessage(error.error.error || 'An error occurred');
        console.error('Auth error:', error);
      }
    });
  }

  displayMessage(message: string) {
    if (this.note) {
      this.note.nativeElement.textContent = message;
    }
    this.scanInput.nativeElement.value = '';
  }
}
