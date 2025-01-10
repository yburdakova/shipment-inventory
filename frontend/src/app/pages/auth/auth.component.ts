import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { MOCK_USERS } from '../../mock-data/auth-data';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  standalone: true,
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements AfterViewInit {
  @ViewChild('scanInput') scanInput!: ElementRef;
  @ViewChild('note') note!: ElementRef;

  loggedInUser: string | null = null;

  constructor(private router: Router) {}

  ngAfterViewInit() {
    this.setFocus();

    this.loggedInUser = localStorage.getItem('loggedInUser');
  if (this.loggedInUser) {
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

      const user = MOCK_USERS.find(u => u.AuthCode === authCode);

      if (!user) {
        this.displayMessage('User not found');
        return;
      }

      if (user.UserRoleID !== 1) {
        this.displayMessage('Insufficient access level');
        return;
      }

      this.saveUserToState(user);
      this.router.navigate(['/dashboard']);
    }
  }

  displayMessage(message: string) {
    if (this.note) {
      this.note.nativeElement.textContent = message;
    }
    this.scanInput.nativeElement.value = '';
  }

  saveUserToState(user: any) {
    localStorage.setItem('loggedInUser', JSON.stringify(user));
  }
}
